import { parentPort } from 'node:worker_threads'
import { HeapSnapshotWorker } from '../thirdparty/devtools-frontend/index.js'

const dispatcher =
  new HeapSnapshotWorker.HeapSnapshotWorkerDispatcher.HeapSnapshotWorkerDispatcher(parentPort.postMessage.bind(parentPort))
parentPort.on('message', data => {
  console.log('got message from parent, dispatching message', { data })
  dispatcher.dispatchMessage({ data, ports: data.__ports ?? [] })
})
parentPort.postMessage('workerReady')
