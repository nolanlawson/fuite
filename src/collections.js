import { sortBy } from './util.js'

export async function startTrackingCollections (page) {
  // The basic idea for this comes from
  // https://media-codings.com/articles/automatically-detect-memory-leaks-with-puppeteer
  const prototype = await page.evaluateHandle(() => {
    return Object.prototype
  })
  const objects = await page.queryObjects(
    prototype
  )
  const weakMap = await page.evaluateHandle(() => new WeakMap())
  await page.evaluate(
    (objects, weakMap) => {

      const { hasOwnProperty, toString } = Object.prototype
      const { isArray } = Array

      // Via https://github.com/jonschlinkert/is-plain-object/blob/0a47f0f/is-plain-object.js
      function isObject (o) {
        return toString.call(o) === '[object Object]'
      }
      function isPlainObject (o) {
        if (isObject(o) === false) {
          return false
        }

        // If has modified constructor
        const ctor = o.constructor
        if (ctor === undefined) {
          return true
        }

        // If has modified prototype
        const prot = ctor.prototype
        if (isObject(prot) === false) {
          return false
        }

        // If constructor does not have an Object-specific method
        if (hasOwnProperty.call(prot, 'isPrototypeOf') === false) {
          return false
        }

        // Most likely a plain Object
        return true
      }

      function getSize (obj) {
        if (obj instanceof Map || obj instanceof Set) {
          return obj.size
        }
        if (isArray(obj)) {
          return obj.length
        } // else plain object
        return Object.keys(obj).length
      }

      for (const obj of objects) {
        if (obj instanceof Map || obj instanceof Set || Array.isArray(obj) || isPlainObject(obj)) {
          const size = getSize(obj)
          weakMap.set(obj, size)
        }
      }
    },
    objects,
    weakMap
  )

  await Promise.all([prototype.dispose(), objects.dispose()])
  return weakMap
}

export async function findLeakingCollections (page, weakMap, numIterations, debug) {
  const prototype = await page.evaluateHandle(() => {
    return Object.prototype
  })
  const objects = await page.queryObjects(
    prototype
  )
  const leakingCollections = await page.evaluate((objects, weakMap, numIterations, debug) => {
    function getSize (obj) {
      if (obj instanceof Map || obj instanceof Set) {
        return obj.size
      }
      if (Array.isArray(obj)) {
        return obj.length
      } // else plain object
      return Object.keys(obj).length
    }
    function getType (obj) {
      if (obj instanceof Map) {
        return 'Map'
      }
      if (obj instanceof Set) {
        return 'Set'
      }
      if (Array.isArray(obj)) {
        return 'Array'
      }
      return 'Object'
    }
    const result = []
    for (const obj of objects) {
      if (weakMap.has(obj)) {
        const sizeBefore = weakMap.get(obj)
        const sizeAfter = getSize(obj)
        const delta = sizeAfter - sizeBefore
        if (delta % numIterations === 0 && delta > 0) {
          if (debug) { // found a leaking collection
            debugger // eslint-disable-line no-debugger
          }
          const type = getType(obj)
          result.push({
            type,
            sizeBefore,
            sizeAfter,
            delta,
            deltaPerIteration: delta / numIterations
          })
        }
      }
    }

    return result
  },
  objects,
  weakMap,
  numIterations,
  debug
  )

  await Promise.all([prototype.dispose(), objects.dispose(), weakMap.dispose()])

  return sortBy(leakingCollections, ['type', 'delta'])
}
