import puppeteer from 'puppeteer'
import * as HeapSnapshotModel from './thirdparty/devtools/heap_snapshot_worker/heap_snapshot_model.js'
import * as defaultScenario from './defaultScenario.js'
import { takeHeapSnapshot } from './heapsnapshots.js'
import { noop, sortBy, sum } from './util.js'
import { waitForPageIdle } from './puppeteerUtil.js'
import fs from 'fs/promises'
import { v4 as uuidV4 } from 'uuid'

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

// Make the simplifying assumption that certain classes, especially browser-internal
// ones, aren't really leaks
const browserInternalClasses = new Set([
  // '(array)',
  // '(closure)',
  // '(regexp)',
  '(compiled code)',
  '(concatenated string)',
  '(number)',
  '(sliced string)',
  '(string)',
  '(system)',
  'PerformanceLongTaskTiming',
  'LayoutShift',
  'LayoutShiftAttribution',
  'TaskAttributionTiming'
])

// via https://stackoverflow.com/a/67030384
async function getEventListeners(page) {
  const objectGroup = uuidV4()
  const cdpSession = await page.target().createCDPSession();
  try {
    const { result: { objectId } } = await cdpSession.send('Runtime.evaluate', {
      expression: `[...document.querySelectorAll("*"), window, document]`,
      objectGroup
    });
    // Using the returned remote object ID, actually get the list of descriptors
    const { result } = await cdpSession.send('Runtime.getProperties', { objectId });

    const arrayProps = Object.fromEntries(result.map(_ => ([_.name, _.value])))

    const length = arrayProps['length'].value

    const elements = [];

    for (let i = 0; i < length; i++) {
      elements.push(arrayProps[i])
    }

    const elementsWithListeners = []

    for (const element of elements) {
      const {objectId} = element;

      const { listeners } = await cdpSession.send('DOMDebugger.getEventListeners', { objectId });

      if (listeners.length) {
        elementsWithListeners.push({
          ...element,
          listeners
        })
      }
    }

    await cdpSession.send('Runtime.releaseObjectGroup', { objectGroup });
    return elementsWithListeners
  } finally {
    await cdpSession.detach()
  }
}

async function countDomNodes(page) {
  return (await page.evaluate(() => document.querySelectorAll('*').length))
}

export async function findLeaks (pageUrl, options = {}) {
  const browser = await puppeteer.launch({
    headless: !options.debug,
    defaultViewport: {width: 1280, height: 800}
  })

  if (options.signal) {
    options.signal.addEventListener('abort', () => {
      browser.close()
    })
  }
  const scenario = options.scenario || defaultScenario
  const numIterations = typeof options.iterations === 'number' ? options.iterations : DEFAULT_ITERATIONS
  const onProgress = options.onProgress || noop
  const beforeStep = scenario.before

  onProgress('Gathering tests...')
  const tests = await runOnPage(browser, pageUrl, beforeStep, async page => {
    return scenario.createTests(page)
  })

  async function runIteration(test, i) {
    const messagePrefix = `Test ${i + 1}/${tests.length} - ${test.description} -`
    onProgress(`${messagePrefix} Setup...`)
    return runOnPage(browser, pageUrl, beforeStep, async page => {
      await scenario.iteration(page, test.data) // one throwaway iteration to avoid measuring one-time setup costs
      onProgress(`${messagePrefix} Taking start snapshot...`)
      const eventListenersStart = await getEventListeners(page)
      const domNodesCountStart = await countDomNodes(page)
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
      const eventListenersEnd = await getEventListeners(page)
      const domNodesCountEnd = await countDomNodes(page)
      if (options.debug) {
        // "after" point in time
        debugger // eslint-disable-line no-debugger
      }
      const endSize = endSnapshot.statistics.total
      const delta = endSize - startSize
      const deltaPerIteration = Math.round((endSize - startSize) / numIterations)

      onProgress(`${messagePrefix} Comparing snapshots...`)
      const aggregatesForDiff = await startSnapshot.aggregatesForDiff()
      const diffByClassName = await endSnapshot.calculateSnapshotDiff(startSnapshot.uid, aggregatesForDiff)
      const suspiciousObjects = Object.entries(diffByClassName).filter(([name, diff]) => {
        // look for objects added <iteration> times and not 0 times
        return diff.countDelta % numIterations === 0 && diff.countDelta > 0
      })
      const startAggregates = startSnapshot.aggregatesWithFilter(new HeapSnapshotModel.HeapSnapshotModel.NodeFilter())
      const endAggregates = endSnapshot.aggregatesWithFilter(new HeapSnapshotModel.HeapSnapshotModel.NodeFilter())

      let leakingObjects = suspiciousObjects
        // filter browser internals
        .filter(([name]) => !browserInternalClasses.has(name))
        // Skip any objects that, for whatever reason, aren't in the aggregate collection.
        // We can't do anything with these
        .filter(([name]) => (name in startAggregates && name in endAggregates))
      leakingObjects = leakingObjects.map(([name, diff]) => {
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
      leakingObjects = sortBy(leakingObjects, ['countDelta', 'name'])

      const areLeaksDetected = () => {
        if (leakingObjects.length) {
          return true
        }
        return false
      }

      const leaksDetected = areLeaksDetected()

      const result = {
        delta,
        deltaPerIteration,
        numIterations,
        leaks: {
          detected: leaksDetected,
          objects: leakingObjects,
        },
        before: {
          statistics: { ...startSnapshot.statistics },
          eventListeners: eventListenersStart,
          domNodesCount: domNodesCountStart
        },
        after: {
          statistics: { ...endSnapshot.statistics } ,
          eventListeners: eventListenersEnd,
          domNodesCount: domNodesCountEnd
        },
      }

      if (options.heapsnapshot) {
        result.before.heapsnapshot = startFilename
        result.after.heapsnapshot = endFilename
      } else {
        await Promise.all([fs.rm(startFilename), fs.rm(endFilename)])
      }

      return {
        test,
        result
      }
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
          result: {
            failed: true,
            error
          }
        })
      }
    }
    return results
  } finally {
    await browser.close()
  }
}
