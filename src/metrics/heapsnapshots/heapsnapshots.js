import path from 'node:path'
import { createReadStream, createWriteStream } from 'node:fs'
import { realpath } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import {
  HeapSnapshotLoader,
  SecondaryInitManager
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
  const loader = new HeapSnapshotLoader.HeapSnapshotLoader()
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
  await loader.parsingComplete

  // Pattern borrowed from `createJSHeapSnapshotForTesting` in Chromium code.
  // https://github.com/ChromeDevTools/devtools-frontend/blob/866e7ab/front_end/entrypoints/heap_snapshot_worker/HeapSnapshot.ts#L3675-L3682
  // Rather than trying to make it work with two workers, we just do it all in one thread.
  // For context see this commit splitting the work into two workers:
  // https://github.com/ChromeDevTools/devtools-frontend/commit/6a523a7
  const channel = new MessageChannel()
  try {
    // eslint-disable-next-line no-new
    new SecondaryInitManager(channel.port2)
    return await loader.buildSnapshot(channel.port1)
  } finally {
    // Without this, the Node process will just hang forever
    channel.port1.close()
    channel.port2.close()
  }
}
