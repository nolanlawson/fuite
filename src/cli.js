import puppeteer from 'puppeteer'
import esMain from 'es-main'
import * as HeapSnapshotWorker from './thirdparty/devtools/heap_snapshot_worker/heap_snapshot_worker.js'
import { createTests, iteration } from './basicScenario.js'
import tempy from 'tempy';
import fs from 'fs'
import fsPromises from 'fs/promises'

const ITERATIONS = 7

async function takeHeapSnapshot(page) {
  const tmpFile = tempy.file()
  console.log('tmpFile', tmpFile)

  const writeSnapshot = async () => {
    const cdpSession = await page.target().createCDPSession();
    let writeStream
    const writeStreamPromise = new Promise((resolve, reject) => {
      writeStream = fs.createWriteStream(tmpFile, { encoding: 'utf8' })
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
    });
    await cdpSession.send('HeapProfiler.takeHeapSnapshot', {
      reportProgress: true
    });

    await heapProfilerPromise
    await cdpSession.detach();
    writeStream.close()
    await writeStreamPromise
  }

  const readSnapshot = async () => {
    let loader
    const loaderPromise = new Promise(resolve => {
      loader = new HeapSnapshotWorker.HeapSnapshotLoader.HeapSnapshotLoader({
        sendEvent(type, message) {
          // console.log(type, message)
          if (message === 'Parsing strings…') {
            Promise.resolve().then(resolve)
          }
        }
      })
    })
    let readStream
    const readStreamPromise = new Promise((resolve, reject) => {
      readStream = fs.createReadStream(tmpFile, { encoding: 'utf8'})
      readStream.on('error', reject)
      readStream.on('end', () => resolve())
      readStream.on('data', chunk => {
        loader.write(chunk)
      })
    })
    await readStreamPromise

    loader.close()
    await loaderPromise

    const snapshot = await loader.buildSnapshot()
    return snapshot
  }

  await writeSnapshot()
  const snapshot = await readSnapshot()
  await fsPromises.rm(tmpFile)
  return snapshot
}

async function runOnPage(browser, pageUrl, runnable) {
  const page = await browser.newPage()
  await page.goto(pageUrl)
  await page.waitForNetworkIdle()

  try {
    return (await runnable(page))
  } finally {
    page.close()
  }
}

export async function main(pageUrl) {
  const browser = await puppeteer.launch();

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
          beforeStatistics: {...startSnapshot.statistics},
          afterStatistics: {...endSnapshot.statistics}
        }

        return {
          test,
          result
        }
      })
    }))
    return results
  } finally {
    await browser.close();
  }
}

if (esMain(import.meta)) {
  // TODO
  console.log('run as main')
}

process.on