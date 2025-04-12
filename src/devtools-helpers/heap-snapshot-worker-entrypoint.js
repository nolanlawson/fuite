import 'web-worker'
import { HeapSnapshotWorker } from '../thirdparty/devtools-frontend/index.js'

/* global self */

const dispatcher =
  new HeapSnapshotWorker.HeapSnapshotWorkerDispatcher.HeapSnapshotWorkerDispatcher(self.postMessage.bind(self))
self.addEventListener('message', dispatcher.dispatchMessage.bind(dispatcher), false)
self.postMessage('workerReady')
