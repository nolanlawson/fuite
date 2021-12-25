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
  const collectionsToCountsMap = await page.evaluateHandle(() => new WeakMap())
  await page.evaluate(
    (objects, collectionsToCountsMap) => {
      const { hasOwnProperty, toString } = Object.prototype
      const { isArray } = Array

      // Via https://github.com/jonschlinkert/is-plain-object/blob/0a47f0f/is-plain-object.js
      function isPlainObject (o) {
        function isObject (o) {
          return toString.call(o) === '[object Object]'
        }
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
        try {
          if (obj instanceof Map || obj instanceof Set) {
            return obj.size
          }
          if (isArray(obj)) {
            return obj.length
          } // else plain object
          return Object.keys(obj).length
        } catch (err) {
          // If for whatever reason the collection errors (e.g. somebody extended Map), return 0.
          // There is not much we can do in these cases
          return 0
        }
      }

      for (const obj of objects) {
        if (obj instanceof Map || obj instanceof Set || Array.isArray(obj) || isPlainObject(obj)) {
          const size = getSize(obj)
          collectionsToCountsMap.set(obj, size)
        }
      }
    },
    objects,
    collectionsToCountsMap
  )

  await Promise.all([prototype.dispose(), objects.dispose()])
  return collectionsToCountsMap
}

export async function findLeakingCollections (page, collectionsToCountsMap, numIterations, debug) {
  const prototype = await page.evaluateHandle(() => {
    return Object.prototype
  })
  const objects = await page.queryObjects(
    prototype
  )

  // Test if the collectionsToCountsMap is still available
  try {
    await page.evaluate(() => {
      // no-op
    }, collectionsToCountsMap)
  } catch (err) {
    if (err.message.includes('JSHandles can be evaluated only in the context they were created')) {
      return [] // multi-page app, not single-page app
    }
    throw err
  }

  const trackedStacktraces = await page.evaluateHandle(() => ([]))

  const leakingCollections = await page.evaluate((objects, collectionsToCountsMap, trackedStacktraces, numIterations, debug) => {
    const { isArray } = Array
    function getSize (obj) {
      try {
        if (obj instanceof Map || obj instanceof Set) {
          return obj.size
        }
        if (isArray(obj)) {
          return obj.length
        } // else plain object
        return Object.keys(obj).length
      } catch (err) {
        // If for whatever reason the collection errors (e.g. somebody extended Map), return 0.
        // There is not much we can do in these cases
        return 0
      }
    }
    function getType (obj) {
      if (obj instanceof Map) {
        return 'Map'
      }
      if (obj instanceof Set) {
        return 'Set'
      }
      if (isArray(obj)) {
        return 'Array'
      }
      return 'Object'
    }
    function createPreviewOfValue (val) {
      if (isArray(val)) {
        return 'Array'
      }
      if (typeof val === 'object' && val) {
        if (val.constructor.name && val.constructor.name !== 'Object') {
          return val.constructor.name
        }
        // only show first 3 keys
        const keys = Object.keys(val)
        const LIMIT = 3
        return `{${keys.slice(0, LIMIT).join(', ')}${keys.length > LIMIT ? ', ...' : ''}}`
      } else if (typeof val === 'function') {
        return val.name ? `function ${val.name} () {}` : '(anonymous function)'
      }
      return (val + '') // primitive
    }
    function createPreviewOfFirstItem (obj) {
      try {
        let keyValue = false
        let firstItem
        if (obj instanceof Map) {
          keyValue = true
          firstItem = [...obj.entries()][0]
        } else if (obj instanceof Set) {
          firstItem = [...obj][0]
        } else if (isArray(obj)) {
          firstItem = obj[0]
        } else {
          keyValue = true
          firstItem = Object.entries(obj)[0]
        }
        if (keyValue) {
          return `${firstItem[0]}: ${createPreviewOfValue(firstItem[1])}`
        }
        return createPreviewOfValue(firstItem)
      } catch (err) {
        return '...'
      }
    }
    function createPreview (obj) {
      if (obj instanceof Map) {
        return `Map(${createPreviewOfFirstItem(obj)}, ...)`
      }
      if (obj instanceof Set) {
        return `Set(${createPreviewOfFirstItem(obj)}, ...)`
      }
      if (isArray(obj)) {
        return `[${createPreviewOfFirstItem(obj)}, ...]`
      }
      return `{${createPreviewOfFirstItem(obj)}, ...}`
    }
    function trackMethods (obj, stacktraces, methods) {
      for (const method of methods) {
        const oldMethod = obj[method]
        obj[method] = function () {
          if (method !== 'splice' || (arguments.length > 2)) { // splice is only an addition if args.length > 2
            if (debug) {
              // Detected someone adding to a collection that is suspected to leak
              debugger // eslint-disable-line no-debugger
            }
            stacktraces.push(new Error().stack)
          }
          return oldMethod.apply(this, arguments)
        }
      }
    }
    function trackPlainObject (obj, stacktraces) {
      Object.setPrototypeOf(obj, new Proxy(Object.create(null), {
        set (obj, prop, val) {
          if (debug) {
            // Detected someone adding to a collection that is suspected to leak
            debugger // eslint-disable-line no-debugger
          }
          stacktraces.push(new Error().stack)
          return (obj[prop] = val)
        }
      }))
    }
    function trackSizeIncreases (obj, stacktraces) {
      if (obj instanceof Map) {
        trackMethods(obj, stacktraces, ['set'])
      } else if (obj instanceof Set) {
        trackMethods(obj, stacktraces, ['add'])
      } else if (isArray(obj)) {
        trackMethods(obj, stacktraces, ['push', 'concat', 'splice', 'unshift'])
      } else { // plain object
        trackPlainObject(obj, stacktraces)
      }
    }
    const result = []
    let id = 0
    for (const obj of objects) {
      if (collectionsToCountsMap.has(obj)) {
        const sizeBefore = collectionsToCountsMap.get(obj)
        const sizeAfter = getSize(obj)
        const delta = sizeAfter - sizeBefore
        if (delta % numIterations === 0 && delta > 0) {
          if (debug) { // found a leaking collection
            debugger // eslint-disable-line no-debugger
          }
          const type = getType(obj)
          const preview = createPreview(obj)
          const details = {
            id: id++,
            type,
            sizeBefore,
            sizeAfter,
            delta,
            deltaPerIteration: delta / numIterations,
            preview
          }
          result.push(details)
          const stacktraces = []
          trackedStacktraces.push({
            id: details.id,
            stacktraces
          })

          try {
            trackSizeIncreases(obj, stacktraces)
          } catch (err) {
            // ignore if this doesn't work for any reason
          }
        }
      }
    }

    return result
  },
  objects,
  collectionsToCountsMap,
  trackedStacktraces,
  numIterations,
  debug
  )

  await Promise.all([prototype.dispose(), objects.dispose(), collectionsToCountsMap.dispose()])

  const collections = sortBy(leakingCollections, ['type', 'delta'])
  return {
    collections,
    trackedStacktraces
  }
}

export async function augmentLeakingCollectionsWithStacktraces (page, collections, trackedStacktraces) {
  const trackedStacktracesArray = await page.evaluate((trackedStacktraces) => {
    return trackedStacktraces
  }, trackedStacktraces)

  const idsToStacktraces = Object.fromEntries(trackedStacktracesArray.map(({ id, stacktraces }) => ([id, stacktraces])))

  return collections.map(collection => {
    const res = { ...collection }
    if (collection.id in idsToStacktraces) {
      res.stacktraces = idsToStacktraces[collection.id]
    }
    return res
  })
}
