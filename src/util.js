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

export function sum(array) {
  return array.reduce((a, b) => a + b, 0)
}