import puppeteer from 'puppeteer'
import esMain from 'es-main'
import * as HeapSnapshotWorker from './thirdparty/devtools/heap_snapshot_worker/heap_snapshot_worker.js'
import { createTests, iteration } from './basicScenario.js'
import { createReadStream, createWriteStream } from 'fs'
import path from 'path'
import tempDirectory from 'temp-dir'
import cryptoRandomString from 'crypto-random-string'
import { mkdir } from 'fs/promises'

const ITERATIONS = 7

let tempDir

async function writeSnapshot (page) {
  if (!tempDir) {
    tempDir = path.join(tempDirectory, `fuite-${cryptoRandomString({ length: 16 })}`)
    await mkdir(tempDir)
  }
  const tmpFile = path.join(tempDir, `heapsnap-${cryptoRandomString({ length: 16 })}.json`)
  console.log('tmpFile', tmpFile)
  const cdpSession = await page.target().createCDPSession()
  let writeStream
  const writeStreamPromise = new Promise((resolve, reject) => {
    writeStream = createWriteStream(tmpFile, { encoding: 'utf8' })
    writeStream.on('error', reject)
    writeStream.on('finish', () => resolve())
  })
  const heapProfilerPromise = new Promise(resolve => {
    cdpSession.on('HeapProfiler.reportHeapSnapshotProgress', ({ finished }) => {
      if (finished) {
        resolve()
      }
    })
  })
  await cdpSession.send('HeapProfiler.enable')
  await cdpSession.send('HeapProfiler.collectGarbage')
  cdpSession.on('HeapProfiler.addHeapSnapshotChunk', ({ chunk }) => {
    writeStream.write(chunk)
  })
  await cdpSession.send('HeapProfiler.takeHeapSnapshot', {
    reportProgress: true
  })

  await heapProfilerPromise
  await cdpSession.detach()
  writeStream.close()
  await writeStreamPromise
  return tmpFile
}

async function readSnapshot (tmpFile) {
  let loader
  const loaderPromise = new Promise(resolve => {
    loader = new HeapSnapshotWorker.HeapSnapshotLoader.HeapSnapshotLoader({
      sendEvent (type, message) {
        if (message === 'Parsing strings…') {
          // queue microtask to wait for data to truly be written
          Promise.resolve().then(resolve)
        }
      }
    })
  })
  let readStream
  const readStreamPromise = new Promise((resolve, reject) => {
    readStream = createReadStream(tmpFile, { encoding: 'utf8' })
    readStream.on('error', reject)
    readStream.on('end', () => resolve())
    readStream.on('data', chunk => {
      loader.write(chunk)
    })
  })
  await readStreamPromise

  loader.close()
  await loaderPromise

  return (await loader.buildSnapshot())
}

async function takeHeapSnapshot (page) {
  const filename = await writeSnapshot(page)
  return (await readSnapshot(filename))
}

async function runOnPage (browser, pageUrl, runnable) {
  const page = await browser.newPage()
  await page.goto(pageUrl)
  await page.waitForNetworkIdle()

  try {
    return (await runnable(page))
  } finally {
    page.close()
  }
}

export async function main (pageUrl) {
  const browser = await puppeteer.launch()

  const tests = await runOnPage(browser, pageUrl, async page => {
    return createTests(page)
  })

  try {
    const results = await Promise.all(tests.map(async test => {
      return runOnPage(browser, pageUrl, async page => {
        const startSnapshot = await takeHeapSnapshot(page)
        const startSize = startSnapshot.statistics.total
        for (let i = 0; i < ITERATIONS; i++) {
          await iteration(page, test)
        }
        const endSnapshot = await takeHeapSnapshot(page)
        const endSize = endSnapshot.statistics.total

        const result = {
          memorySizeDelta: endSize - startSize,
          beforeStatistics: { ...startSnapshot.statistics },
          afterStatistics: { ...endSnapshot.statistics }
        }

        return {
          test,
          result
        }
      })
    }))
    return results
  } finally {
    await browser.close()
  }
}

if (esMain(import.meta)) {
  // TODO
  console.log('run as main')
}
