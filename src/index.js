import puppeteer from 'puppeteer'
import * as defaultScenario from './defaultScenario.js'
import { takeHeapSnapshot } from './heapsnapshots.js'
import { waitForPageIdle } from './puppeteerUtil.js'
import { getDomNodesAndListeners } from './eventListeners.js'
import fs from 'fs/promises'
import { analyzeHeapSnapshots } from './analyzeHeapsnapshots.js'
import { analyzeEventListeners, calculateEventListenersSummary } from './analyzeEventListeners.js'
import {
  augmentLeakingCollectionsWithStacktraces,
  findLeakingCollections,
  startTrackingCollections
} from './collections.js'
import ora from 'ora'
import { analyzeDomNodes } from './analyzeDomNodes.js'
import { omit } from './util.js'

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

function massagePageUrl (pageUrl) {
  // add the scheme if necessary
  if (!/^https?:\/\//.test(pageUrl)) {
    // use insecure for localhost
    if (pageUrl.startsWith('localhost') || pageUrl.startsWith('127.0.0.1')) {
      return `http://${pageUrl}`
    }
    // use secure everywhere else
    return `https://${pageUrl}`
  }
  return pageUrl
}

async function runWithCdpSession (page, runnable) {
  const cdpSession = await page.target().createCDPSession()
  try {
    return (await runnable(cdpSession))
  } finally {
    await cdpSession.detach()
  }
}

export async function * findLeaks (pageUrl, options = {}) {
  const {
    scenario, numIterations, progress, debug, heapsnapshot, browser
  } = await analyzeOptions(options)
  const { setup, createTests, iteration } = scenario

  pageUrl = massagePageUrl(pageUrl)

  const runIterationOnPage = async (onProgress, test) => {
    return (await runOnFreshPage(browser, pageUrl, setup, async page => {
      await iteration(page, test.data) // one throwaway iteration to avoid measuring one-time setup costs
      onProgress('Taking start snapshot...')
      return (await runWithCdpSession(page, async cdpSession => {
        const collectionsToCountsMap = await startTrackingCollections(page)
        const { nodes: domNodesStart, listeners: eventListenersStart } = await getDomNodesAndListeners(page, cdpSession)
        const startSnapshotFilename = await takeHeapSnapshot(page, cdpSession)
        if (debug) {
          // Point in time before running any iterations
          debugger // eslint-disable-line no-debugger
        }
        for (let i = 0; i < numIterations; i++) {
          onProgress(`Iteration ${i + 1}/${numIterations}...`)
          await iteration(page, test.data)
        }
        onProgress('Taking end snapshot...')
        const endSnapshotFilename = await takeHeapSnapshot(page, cdpSession)
        const { nodes: domNodesEnd, listeners: eventListenersEnd } = await getDomNodesAndListeners(page, cdpSession)
        let {
          collections: leakingCollections,
          trackedStacktraces
        } = await findLeakingCollections(page, collectionsToCountsMap, numIterations, debug)
        if (debug) {
          // Point in time after running iterations
          debugger // eslint-disable-line no-debugger
        }

        // Run one extra iteration to track additions to leaking collections
        if (leakingCollections.length) {
          try {
            onProgress('Extra iteration to analyze collections...')
            await iteration(page, test.data)
            leakingCollections = await augmentLeakingCollectionsWithStacktraces(page, leakingCollections, trackedStacktraces)
          } catch (err) {
            debugger
            // ignore if the tracking logic doesn't work for any reason
            // TODO: error log
          }
        }
        trackedStacktraces.dispose()
        leakingCollections = leakingCollections.map(_ => omit(_, ['id']))

        onProgress('Analyzing snapshots...')
        const { leakingObjects, startStatistics, endStatistics } = await analyzeHeapSnapshots(
          startSnapshotFilename, endSnapshotFilename, numIterations
        )
        const leakingListeners = analyzeEventListeners(eventListenersStart, eventListenersEnd, numIterations)
        const eventListenersSummary = calculateEventListenersSummary(eventListenersStart, eventListenersEnd, numIterations)
        const leakingDomNodes = analyzeDomNodes(domNodesStart, domNodesEnd, numIterations)
        const domNodesSummary = {
          delta: domNodesEnd.length - domNodesStart.length,
          deltaPerIteration: (domNodesEnd.length - domNodesStart.length) / numIterations,
          nodes: leakingDomNodes
        }
        const delta = endStatistics.total - startStatistics.total
        const deltaPerIteration = Math.round(delta / numIterations)
        const leaksDetected = Boolean(
          deltaPerIteration > 0 && (
            leakingObjects.length ||
            (eventListenersSummary.delta > 0) ||
            (domNodesSummary.delta > 0) ||
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
            eventListenersSummary, // eventListenersSummary is a separate object for backwards compat
            domNodes: domNodesSummary,
            collections: leakingCollections
          },
          before: {
            statistics: startStatistics,
            eventListeners: eventListenersStart,
            domNodes: {
              count: domNodesStart.length, // domNodes.count is redundant, but for backwards compat
              nodes: domNodesStart
            }
          },
          after: {
            statistics: endStatistics,
            eventListeners: eventListenersEnd,
            domNodes: {
              count: domNodesEnd.length, // domNodes.count is redundant, but for backwards compat
              nodes: domNodesEnd
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
    }))
  }

  const runIteration = async (test, i, numTests) => {
    try {
      const prefix = `Test ${i + 1}/${numTests}${test.description ? ` - ${test.description}` : ''} -`
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
