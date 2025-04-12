// wrapper around Node's Worker to make onmessage work

import Worker from 'web-worker'

export { Worker as WebCompatibleWorker }