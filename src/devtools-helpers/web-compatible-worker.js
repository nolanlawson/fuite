// wrapper around Node's Worker to make onmessage work

import { Worker } from 'node:worker_threads'

export class WebCompatibleWorker {
  #worker
  #onMessage = null
  #onError = null
  constructor(...args) {
    this.#worker = new Worker(...args)
  }

  get onmessage() {
    return this.#onMessage
  }
  set onmessage(listener) {
    if (listener === null) {
      if (this.#onMessage) {
        this.#worker.off('message', this.#onMessage)
      }
    } else {
      this.#worker.on('message', listener)
    }
    this.#onMessage = null
  }

  get onerror() {
    return this.#onError
  }
  set onerror(listener) {
    if (listener === null) {
      if (this.#onError) {
        this.#worker.off('error', this.#onError)
      }
    } else {
      this.#worker.on('error', listener)
    }
    this.#onError = null
  }

  postMessage(...args) {
    this.#worker.postMessage(...args)
  }

  terminate() {
    this.#worker.terminate()
  }
}