export function noop () {

}

export function sortBy (array, keys) {
  return array.sort((a, b) => {
    for (let key of keys) {
      let invert = false
      if (key.startsWith('-')) {
        key = key.substring(1)
        invert = true
      }
      if (a[key] < b[key]) {
        return invert ? 1 : -1
      }
      if (a[key] > b[key]) {
        return invert ? -1 : 1
      }
    }
    return 0
  })
}

export function sum (array) {
  return array.reduce((a, b) => a + b, 0)
}

// like Promise.all, but run serially
export async function serial (promiseFactories) {
  const res = []
  for (const promiseFactory of promiseFactories) {
    res.push(await promiseFactory())
  }
  return res
}

// like lodash.pick
export function pick (obj, keys) {
  const res = {}
  for (const key of keys) {
    res[key] = obj[key]
  }
  return res
}

// like lodash.omit

export function omit (obj, keys) {
  const res = {}
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      res[key] = obj[key]
    }
  }
  return res
}
