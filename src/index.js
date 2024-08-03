import puppeteer from 'puppeteer'
import * as defaultScenario from './defaultScenario.js'
import { defaultWaitForPageIdle } from './puppeteerUtil.js'
import ora from 'ora'
import { serial } from './util.js'
import { collectionsMetric } from './metrics/collections/index.js'
import { domNodesAndListenersMetric } from './metrics/domNodesAndListeners/index.js'
import { heapsnapshotsMetric } from './metrics/heapsnapshots/index.js'
import { setCustomWaitForPageIdle } from './customWaitForPageIdle.js'

// Maximum 32-bit signed integer, for sending CDP a high enough timeout
const MAX_SIGNED_INT32 = Math.pow(2, 31) - 1

// it's important that heapsnapshotsMetric is the last one here, because we want to run it after all the other metrics
// (in the "before" step) and before all the other ones (in the "after" step) to avoid capturing unnecessary
// stuff in the heapsnapshot
const metricFactories = [
  collectionsMetric,
  domNodesAndListenersMetric,
  heapsnapshotsMetric
]

export const DEFAULT_ITERATIONS = 7

async function runOnFreshPage (browser, pageUrl, setup, teardown, waitForIdle, runnable) {
  const page = await browser.newPage()

  const doWaitForIdle = waitForIdle || defaultWaitForPageIdle

  try {
    await page.goto(pageUrl)
    await doWaitForIdle(page)

    if (setup) {
      await setup(page)
      await doWaitForIdle(page)
    }
    try {
      return await runnable(page)
    } finally {
      if (teardown) {
        await doWaitForIdle(page)
        await teardown(page)
      }
    }
  } finally {
    await page.close()
  }
}

async function analyzeOptions (options) {
  const { debug, heapsnapshot, progress } = options
  const args = Array.isArray(options.browserArgs) ? options.browserArgs : []
  const browser = await puppeteer.launch({
    headless: !debug,
    defaultViewport: { width: 1280, height: 800 },
    args,
    ...(debug && { protocolTimeout: MAX_SIGNED_INT32 }) // avoid timeouts when you're trying to debug
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

function mergeResults (results, numIterations) {
  const result = {
    leaks: Object.assign({}, ...results.map(_ => _.leaks)),
    before: Object.assign({}, ...results.map(_ => _.before)),
    after: Object.assign({}, ...results.map(_ => _.after))
  }

  // This data comes from the heap snapshot metric. The current heuristic is to only
  // report "leaks detected" if the deltaPerIteration is >0 and any metric reported something
  // detected. This is to avoid saying "leaks detected" when the deltaPerIteration is below
  // zero, which would probably be confusing.
  const delta = result.after.statistics.total - result.before.statistics.total
  const deltaPerIteration = Math.round(delta / numIterations)
  const leaksDetected = deltaPerIteration > 0 && results.some(_ => _.leaksDetected)

  result.delta = delta
  result.deltaPerIteration = deltaPerIteration
  result.leaks.detected = leaksDetected
  result.numIterations = numIterations

  return result
}

export async function * findLeaks (pageUrl, options = {}) {
  const {
    scenario, numIterations, progress, debug, heapsnapshot, browser
  } = await analyzeOptions(options)
  const { setup, createTests, iteration, teardown, waitForIdle } = scenario

  pageUrl = massagePageUrl(pageUrl)

  const runIterationOnPage = async (onProgress, test) => {
    return (await runOnFreshPage(browser, pageUrl, setup, teardown, waitForIdle, async page => {
      await iteration(page, test.data) // one throwaway iteration to avoid measuring one-time setup costs
      return (await runWithCdpSession(page, async cdpSession => {
        const metrics = metricFactories.map(_ => _({ page, cdpSession, heapsnapshot, debug, numIterations }))

        onProgress('Taking start snapshot...')
        for (const metric of metrics) {
          await metric.beforeIterations()
        }
        if (debug) {
          // Point in time after the first throwaway iteration but before the main loop of iterations.
          // If you're paused here, this is a good time to open the *browser* DevTools and take a manual heap snapshot.
          // (Memory -> heap snapshot -> take snapshot)
          debugger // eslint-disable-line no-debugger
        }
        for (let i = 0; i < numIterations; i++) {
          onProgress(`Iteration ${i + 1}/${numIterations}...`)
          await iteration(page, test.data)
        }
        onProgress('Taking end snapshot...')
        for (const metric of [...metrics].reverse()) { // run in reverse order to ensure heap snapshot happens first
          await metric.afterIterations()
        }
        if (debug) {
          // Point in time after running the main loop of iterations.
          // If you're paused here, this is a good time to open the *browser* DevTools, so you can:
          //   1. take a second heap snapshot to compare with the first, and/or
          //   2. wait for more debugger statements if you're trying to debug leaking collections.
          debugger // eslint-disable-line no-debugger
        }

        try {
          if (metrics.some(metric => metric.needsExtraIteration?.())) {
            onProgress('Extra iteration for analysis...')
            await iteration(page, test.data)
            for (const metric of metrics) {
              await (metric.afterExtraIteration?.())
            }
          }
        } catch (err) {
          // ignore if the extra iteration doesn't work for any reason; it's optional
          // TODO: error log
        }

        onProgress('Analyzing snapshots...')
        // Run in serial just in case something consumes a lot of memory (e.g. heap snapshot analysis)
        const results = await serial(metrics.map(metric => () => metric.getResult()))
        const result = mergeResults(results, numIterations)

        // Assume cleanup code can run in parallel
        await Promise.all(metrics.map(metric => metric.cleanup?.()))

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

  const doCreateTests = async () => {
    return (await runWithSpinner(progress, async onProgress => {
      onProgress('Gathering tests...')
      return (await runOnFreshPage(browser, pageUrl, setup, teardown, waitForIdle, page => createTests(page)))
    }))
  }

  try {
    setCustomWaitForPageIdle(waitForIdle) // communicate with defaultScenario.js about how to check for idle
    const tests = createTests
      ? (await doCreateTests())
      : [{}] // default - one test with empty data
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      const result = (await runIteration(test, i, tests.length))
      yield result
    }
  } finally {
    setCustomWaitForPageIdle(undefined) // revert to default
    await browser.close()
  }
}

export { defaultScenario }
