export async function asyncIterableToArray (iterable) {
  const res = []
  for await (const item of iterable) {
    res.push(item)
  }
  return res
}
