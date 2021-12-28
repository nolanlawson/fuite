import { makeRouter } from '../basicRouter.js'

const router = makeRouter(['', 'about'])

// make the set impossible to track; this throws an error
const set = new Set()

Object.defineProperty(set, 'add', {
  get () {
    return Set.prototype.add
  },
  set () {
    throw new Error('cannot set!')
  },
  configurable: false,
  enumerable: false
})

router.addAfterHook('/about', function aboutHook () {
  const buff = new ArrayBuffer(1000000)

  set.add(buff)
})
