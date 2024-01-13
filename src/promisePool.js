// basic promise pool to replace Promise.all for memory-sensitive cases

export async function promisePool (size, promiseFactories) {
  const results = Array(promiseFactories.length).fill()
  let current = 0

  async function promiseChain () {
    while (current !== promiseFactories.length) {
      const index = current
      current++
      results[index] = await promiseFactories[index]()
    }
  }

  const inFlight = Array(size).fill().map(promiseChain)
  await Promise.all(inFlight)

  return results
}
