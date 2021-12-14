import puppeteer from 'puppeteer'
import * as defaultScenario from './defaultScenario.js'
import { takeHeapSnapshot } from './heapsnapshots.js'
import { waitForPageIdle } from './puppeteerUtil.js'
import { getEventListeners } from './eventListeners.js'
import fs from 'fs/promises'
import { analyzeHeapSnapshots } from './analyzeHeapsnapshots.js'
import { analyzeEventListeners } from './analyzeEventListeners.js'
import { countDomNodes } from './domNodes.js'
import { findLeakingCollections, startTrackingCollections } from './collections.js'
import ora from 'ora'

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

async function analyzeOptions (options) {
  const { debug, heapsnapshot, progress } = options
  const browser = await puppeteer.launch({
    headless: !debug,
    defaultViewport: { width: 1280, height: 800 }
  })
  if (options.signal) {
    options.signal.addEventListener('abort', () => {
      browser.close()
    })
  }
  const scenario = options.scenario || defaultScenario
  const numIterations = typeof options.iterations === 'number' ? options.iterations : DEFAULT_ITERATIONS

  return {
    scenario,
    numIterations,
    progress,
    debug,
    heapsnapshot,
    browser
  }
}

async function runWithSpinner (enableSpinner, runnable) {
  const spinner = enableSpinner && ora().start()
  try {
    return (await runnable(text => {
      if (spinner) {
        spinner.text = text
      }
    }))
  } finally {
    if (spinner) {
      spinner.stop()
    }
  }
}

export async function * findLeaks (pageUrl, options = {}) {
  const {
    scenario, numIterations, progress, debug, heapsnapshot, browser
  } = await analyzeOptions(options)
  const { setup, createTests, iteration } = scenario

  const runIterationOnPage = async (onProgress, test) => {
    return (await runOnFreshPage(browser, pageUrl, setup, async page => {
      await iteration(page, test.data) // one throwaway iteration to avoid measuring one-time setup costs
      onProgress('Taking start snapshot...')
      const weakMap = await startTrackingCollections(page)
      const eventListenersStart = await getEventListeners(page)
      const domNodesCountStart = await countDomNodes(page)
      const startSnapshotFilename = await takeHeapSnapshot(page)
      if (debug) {
        // Point in time before running any iterations
        debugger // eslint-disable-line no-debugger
      }
      for (let i = 0; i < numIterations; i++) {
        onProgress(`Iteration ${i + 1}/${numIterations}...`)
        await iteration(page, test.data)
      }
      onProgress('Taking end snapshot...')
      const endSnapshotFilename = await takeHeapSnapshot(page)
      const domNodesCountEnd = await countDomNodes(page)
      const eventListenersEnd = await getEventListeners(page)
      const leakingCollections = await findLeakingCollections(page, weakMap, numIterations, debug)
      if (debug) {
        // Point in time after running iterations
        debugger // eslint-disable-line no-debugger
      }

      onProgress('Analyzing snapshots...')
      const { leakingObjects, startStatistics, endStatistics } = await analyzeHeapSnapshots(
        startSnapshotFilename, endSnapshotFilename, numIterations
      )
      const leakingListeners = analyzeEventListeners(eventListenersStart, eventListenersEnd, numIterations)
      const domNodesCountDelta = domNodesCountEnd - domNodesCountStart
      const delta = endStatistics.total - startStatistics.total
      const deltaPerIteration = Math.round(delta / numIterations)
      const leaksDetected = Boolean(
        deltaPerIteration > 0 && (
          leakingObjects.length ||
          leakingListeners.length ||
          domNodesCountDelta > 0 ||
          leakingCollections.length
        )
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

      if (heapsnapshot) {
        result.before.heapsnapshot = startSnapshotFilename
        result.after.heapsnapshot = endSnapshotFilename
      } else {
        await Promise.all([fs.rm(startSnapshotFilename), fs.rm(endSnapshotFilename)])
      }

      return { test, result }
    }))
  }

  const runIteration = async (test, i, numTests) => {
    try {
      const prefix = `Test ${i + 1}/${numTests} - ${test.description} -`
      return (await runWithSpinner(progress, async (onProgress) => {
        const onProgressWithPrefix = message => {
          onProgress(`${prefix} ${message}`)
        }
        onProgressWithPrefix('Setup...')
        return (await runIterationOnPage(onProgressWithPrefix, test))
      }))
    } catch (error) {
      return {
        test,
        result: { failed: true, error }
      }
    }
  }

  try {
    let tests
    if (createTests) {
      tests = await runWithSpinner(progress, async onProgress => {
        onProgress('Gathering tests...')
        return (await runOnFreshPage(browser, pageUrl, setup, async page => {
          return createTests(page)
        }))
      })
    } else {
      tests = [{}] // default - one test with empty data
    }
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      const result = (await runIteration(test, i, tests.length))
      yield result
    }
  } finally {
    await browser.close()
  }
}

export { defaultScenario }
