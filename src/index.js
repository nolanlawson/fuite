import puppeteer from 'puppeteer'
import * as HeapSnapshotModel from './thirdparty/devtools/heap_snapshot_worker/heap_snapshot_model.js'
import * as defaultScenario from './defaultScenario.js'
import { takeHeapSnapshot } from './heapsnapshots.js'
import { noop, sortBy } from './util.js'
import { waitForPageIdle } from './puppeteerUtil.js'
import fs from 'fs/promises'

export const DEFAULT_ITERATIONS = 7

async function runOnPage (browser, pageUrl, beforeStep, runnable) {
  const page = await browser.newPage()

  try {
    await page.goto(pageUrl)
    await waitForPageIdle(page)

    if (beforeStep) {
      await beforeStep(page)
      await waitForPageIdle(page)
    }
    return (await runnable(page))
  } finally {
    await page.close()
  }
}

export async function findLeaks (pageUrl, options = {}) {
  const browser = await puppeteer.launch({
    headless: !options.debug
  })

  if (options.signal) {
    options.signal.addEventListener('abort', () => {
      browser.close()
    })
  }
  let scenario
  if (options.scenario) {
    scenario = options.scenario
  } else {
    scenario = defaultScenario
  }

  const numIterations = typeof options.iterations === 'number' ? options.iterations : DEFAULT_ITERATIONS

  const onProgress = options.onProgress || noop

  const beforeStep = scenario.before

  onProgress('Gathering tests...')
  const tests = await runOnPage(browser, pageUrl, beforeStep, async page => {
    return scenario.createTests(page)
  })

  try {
    const results = []

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      const messagePrefix = `Test ${i + 1}/${tests.length} - ${test.description} -`
      onProgress(`${messagePrefix} Setup...`)
      results.push(await runOnPage(browser, pageUrl, beforeStep, async page => {
        await scenario.iteration(page, test.data) // one throwaway iteration to avoid measuring one-time setup costs
        onProgress(`${messagePrefix} Taking start snapshot...`)
        const { snapshot: startSnapshot, filename: startFilename } = await takeHeapSnapshot(page)
        if (options.debug) {
          // "before" point in time
          debugger // eslint-disable-line no-debugger
        }
        const startSize = startSnapshot.statistics.total
        for (let i = 0; i < numIterations; i++) {
          onProgress(`${messagePrefix} Iteration ${i + 1}/${numIterations}...`)
          await scenario.iteration(page, test.data)
        }
        onProgress(`${messagePrefix} Taking end snapshot...`)
        const { snapshot: endSnapshot, filename: endFilename } = await takeHeapSnapshot(page)
        if (options.debug) {
          // "after" point in time
          debugger // eslint-disable-line no-debugger
        }
        const endSize = endSnapshot.statistics.total

        onProgress(`${messagePrefix} Comparing snapshots...`)
        const aggregatesForDiff = await startSnapshot.aggregatesForDiff()
        const diffByClassName = await endSnapshot.calculateSnapshotDiff(startSnapshot.uid, aggregatesForDiff)
        const suspiciousObjects = Object.entries(diffByClassName).filter(([name, diff]) => {
          // look for objects added <iteration> times and not 0 times
          return diff.countDelta % numIterations === 0 && diff.countDelta !== 0
        })
        const startAggregates = startSnapshot.aggregatesWithFilter(new HeapSnapshotModel.HeapSnapshotModel.NodeFilter())
        const endAggregates = endSnapshot.aggregatesWithFilter(new HeapSnapshotModel.HeapSnapshotModel.NodeFilter())

        let leakingObjects = suspiciousObjects.map(([name, diff]) => {
          const startAggregatesForThisClass = startAggregates[name]
          const endAggregatesForThisClass = endAggregates[name]
          const retainedSizeDelta = endAggregatesForThisClass.maxRet - startAggregatesForThisClass.maxRet
          const retainedSizeDeltaPerIteration = Math.round(retainedSizeDelta / numIterations)
          const countDelta = diff.countDelta
          const countDeltaPerIteration = countDelta / numIterations
          return {
            name,
            diff: { ...diff },
            aggregates: {
              before: { ...startAggregatesForThisClass },
              after: { ...endAggregatesForThisClass }
            },
            retainedSizeDelta,
            retainedSizeDeltaPerIteration,
            countDelta,
            countDeltaPerIteration,
            numIterations
          }
        })
        leakingObjects = sortBy(leakingObjects, ['-retainedSizeDelta', 'name'])
        const result = {
          delta: endSize - startSize,
          deltaPerIteration: Math.round((endSize - startSize) / numIterations),
          before: { statistics: { ...startSnapshot.statistics } },
          after: { statistics: { ...endSnapshot.statistics } },
          numIterations,
          leakingObjects
        }

        if (options.heapsnapshot) {
          result.snapshots = {
            before: startFilename,
            after: endFilename
          }
        } else {
          await Promise.all([
            fs.rm(startFilename),
            fs.rm(endFilename)
          ])
        }

        return {
          test,
          result
        }
      }))
    }
    return results
  } finally {
    await browser.close()
  }
}
