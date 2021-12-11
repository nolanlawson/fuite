import puppeteer from 'puppeteer'
import * as defaultScenario from './defaultScenario.js'
import { takeHeapSnapshot } from './heapsnapshots.js'
import { noop } from './util.js'
import { waitForPageIdle } from './puppeteerUtil.js'
import { getEventListeners } from './eventListeners.js'
import fs from 'fs/promises'
import { analyzeHeapSnapshots } from './analyzeHeapsnapshots.js'
import { analyzeEventListeners } from './analyzeEventListeners.js'
import { countDomNodes } from './domNodes.js'
import { findLeakingCollections, startTrackingCollections } from './collections.js'

export const DEFAULT_ITERATIONS = 7

async function runOnFreshPage (browser, pageUrl, setup, runnable) {
  const page = await browser.newPage()

  try {
    await page.goto(pageUrl)
    await waitForPageIdle(page)

    if (setup) {
      await setup(page)
      await waitForPageIdle(page)
    }
    return (await runnable(page))
  } finally {
    await page.close()
  }
}

export async function findLeaks (pageUrl, options = {}) {
  const browser = await puppeteer.launch({
    headless: !options.debug,
    defaultViewport: { width: 1280, height: 800 }
  })

  if (options.signal) {
    options.signal.addEventListener('abort', () => {
      browser.close()
    })
  }
  const scenario = options.scenario || defaultScenario
  const numIterations = typeof options.iterations === 'number' ? options.iterations : DEFAULT_ITERATIONS
  const onProgress = options.onProgress || noop
  const { setup, createTests, iteration } = scenario

  onProgress('Gathering tests...')
  const tests = await runOnFreshPage(browser, pageUrl, setup, async page => {
    return createTests(page)
  })

  const runIteration = async (test, i) => {
    const messagePrefix = `Test ${i + 1}/${tests.length} - ${test.description} -`
    onProgress(`${messagePrefix} Setup...`)
    return runOnFreshPage(browser, pageUrl, setup, async page => {
      await iteration(page, test.data) // one throwaway iteration to avoid measuring one-time setup costs
      onProgress(`${messagePrefix} Taking start snapshot...`)
      const weakMap = await startTrackingCollections(page)
      const eventListenersStart = await getEventListeners(page)
      const domNodesCountStart = await countDomNodes(page)
      const startSnapshotFilename = await takeHeapSnapshot(page)
      if (options.debug) {
        // Point in time before running any iterations
        debugger // eslint-disable-line no-debugger
      }
      for (let i = 0; i < numIterations; i++) {
        onProgress(`${messagePrefix} Iteration ${i + 1}/${numIterations}...`)
        await iteration(page, test.data)
      }
      onProgress(`${messagePrefix} Taking end snapshot...`)
      const endSnapshotFilename = await takeHeapSnapshot(page)
      const domNodesCountEnd = await countDomNodes(page)
      const eventListenersEnd = await getEventListeners(page)
      const leakingCollections = await findLeakingCollections(page, weakMap, numIterations, options.debug)
      if (options.debug) {
        // Point in time after running iterations
        debugger // eslint-disable-line no-debugger
      }

      onProgress(`${messagePrefix} Analyzing snapshots...`)
      const { leakingObjects, startStatistics, endStatistics } = await analyzeHeapSnapshots(
        startSnapshotFilename, endSnapshotFilename, numIterations
      )
      const leakingListeners = analyzeEventListeners(eventListenersStart, eventListenersEnd, numIterations)
      const domNodesCountDelta = domNodesCountEnd - domNodesCountStart
      const delta = endStatistics.total - startStatistics.total
      const deltaPerIteration = Math.round(delta / numIterations)
      const leaksDetected = !!(
        leakingObjects.length ||
        leakingListeners.length ||
        domNodesCountDelta > 0 ||
        leakingCollections.length
      )

      const result = {
        delta,
        deltaPerIteration,
        numIterations,
        leaks: {
          detected: leaksDetected,
          objects: leakingObjects,
          eventListeners: leakingListeners,
          domNodes: {
            delta: domNodesCountDelta,
            deltaPerIteration: domNodesCountDelta / numIterations
          },
          collections: leakingCollections
        },
        before: {
          statistics: startStatistics,
          eventListeners: eventListenersStart,
          domNodes: {
            count: domNodesCountStart
          }
        },
        after: {
          statistics: endStatistics,
          eventListeners: eventListenersEnd,
          domNodes: {
            count: domNodesCountEnd
          }
        }
      }

      if (options.heapsnapshot) {
        result.before.heapsnapshot = startSnapshotFilename
        result.after.heapsnapshot = endSnapshotFilename
      } else {
        await Promise.all([fs.rm(startSnapshotFilename), fs.rm(endSnapshotFilename)])
      }

      return { test, result }
    })
  }

  try {
    const results = []

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      try {
        const result = await runIteration(test, i)
        results.push(result)
      } catch (error) {
        results.push({
          test,
          result: { failed: true, error }
        })
      }
    }
    return results
  } finally {
    await browser.close()
  }
}
