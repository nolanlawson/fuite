import { makeRouter } from '../basicRouter.js'

const router = makeRouter(['', 'about'])

// these are not leaking and should be ignored
// eslint-disable-next-line no-unused-vars
const nonLeakyCollections = [
  new Map(Object.entries({ foo: 'bar' })),
  new Set(['foo']),
  ['foo'],
  { bar: 'baz' }
]

// these are leaking
let map
let set
let arr
let obj

let count = 0

router.addAfterHook('/about', function aboutHook () {
  map = map || new Map()
  set = set || new Set()
  arr = arr || []
  obj = obj || {}

  const buff = new ArrayBuffer(1000000)

  for (let i = 0; i < 2; i++) {
    map.set(++count, function mapClosure () { console.log(buff) })
  }
  set.add(function setClosure () { console.log(buff) })
  for (let i = 0; i < 3; i++) {
    arr.push(function arrayClosure () { console.log(buff) })
  }
  for (let i = 0; i < 4; i++) {
    obj[++count] = function objectClosure () { console.log(buff) }
  }
})
