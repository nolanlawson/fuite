// wrapper around Node's Worker to make onmessage work

import { Worker } from 'node:worker_threads'

export class WebCompatibleWorker {
  #worker
  #onMessage = null
  #onError = null
  constructor (...args) {
    this.#worker = new Worker(...args)
  }

  get onmessage () {
    return this.#onMessage
  }

  set onmessage (listener) {
    if (listener === null) {
      if (this.#onMessage) {
        this.#worker.off('message', this.#onMessage)
      }
      this.#onMessage = null
    } else {
      const compatibleListener = data => listener({ data })
      console.log('setting listener on message')
      this.#worker.on('message', compatibleListener)
      this.#onMessage = compatibleListener
    }
  }

  get onerror () {
    return this.#onError
  }

  set onerror (listener) {
    if (listener === null) {
      if (this.#onError) {
        this.#worker.off('error', this.#onError)
      }
      this.#onError = null
    } else {
      const compatibleListener = error => listener({ error })
      this.#worker.on('error', compatibleListener)
      this.#onError = compatibleListener
    }
  }

  postMessage (message, transferList) {
    console.log('WORKER: postMessage', { message }, 'transferList', transferList)
    if (transferList) {
      const ports = transferList.filter(_ => _ instanceof MessagePort)
      message.__ports = ports
    }
    this.#worker.postMessage(message, transferList)
  }

  terminate () {
    this.#worker.terminate()
  }
}
