import { parentPort } from 'node:worker_threads'
import { HeapSnapshotWorker } from '../thirdparty/devtools-frontend/index.js'

const dispatcher =
  new HeapSnapshotWorker.HeapSnapshotWorkerDispatcher.HeapSnapshotWorkerDispatcher(parentPort.postMessage.bind(parentPort))
parentPort.on('message', dispatcher.dispatchMessage.bind(dispatcher))
parentPort.postMessage('workerReady')
