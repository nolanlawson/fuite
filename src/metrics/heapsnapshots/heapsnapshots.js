import path from 'node:path'
import { createReadStream, createWriteStream } from 'node:fs'
import { realpath } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import {
  createJSHeapSnapshotForTesting,
  HeapSnapshotWorker,
  HeapSnapshotWorkerProxy
} from '../../thirdparty/devtools-frontend/index.js'
import { randomUUID } from 'node:crypto'

// via https://github.com/sindresorhus/temp-dir/blob/437937c/index.js#L4
const tempDir = await realpath(tmpdir())

export async function takeHeapSnapshot (page, cdpSession) {
  const filename = path.join(tempDir, `fuite-${randomUUID()}.heapsnapshot`)
  let writeStream
  const writeStreamPromise = new Promise((resolve, reject) => {
    writeStream = createWriteStream(filename, { encoding: 'utf8' })
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
  writeStream.close()
  await writeStreamPromise
  return filename
}

export async function createHeapSnapshotModel (filename) {
  let loader
  const loaderPromise = new Promise(resolve => {
    loader = new HeapSnapshotWorker.HeapSnapshotLoader.HeapSnapshotLoader({
      sendEvent (type, message) {
        const parsedMessage = JSON.parse(message)
        if (type === 'ProgressUpdate' && parsedMessage.string === 'Parsing strings…') {
          // queue microtask to wait for data to truly be written
          Promise.resolve().then(resolve)
        }
      }
    })
  })
  let readStream
  const readStreamPromise = new Promise((resolve, reject) => {
    readStream = createReadStream(filename, { encoding: 'utf8' })
    readStream.on('error', reject)
    readStream.on('end', () => resolve())
    readStream.on('data', chunk => {
      loader.write(chunk)
    })
  })
  await readStreamPromise

  loader.close()
  await loaderPromise

  const snapshot = loader.getSnapshot()

  return await createJSHeapSnapshotForTesting(snapshot)
  //
  // const secondWorker = new HeapSnapshotWorkerProxy(() => { })
  // try {
  //   // const channel = new MessageChannel()
  //   // channel.port1.onmessage = () => console.log('RECEIVED MESSAGE!!!')
  //   // await secondWorker.setupForSecondaryInit(channel.port2)
  //   return await loader.buildSnapshot(secondWorker)
  // } finally {
  //   secondWorker.dispose()
  // }
}
