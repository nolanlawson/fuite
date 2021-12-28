import { resolve } from 'source-map-resolve'
import { SourceMapConsumer } from 'source-map'
import { promisify } from 'util'
import fetch from 'node-fetch'
import QuickLRU from 'quick-lru'

const resolveSourceMap = promisify(resolve)

const cache = new QuickLRU({
  maxSize: 100
})

async function readFileNoCache (url) {
  return (await (await fetch(url)).text())
}

function readFile (url) {
  let result = cache.get(url)
  if (!result) {
    result = readFileNoCache(url)
    // cache the promise rather than the result so we don't hammer the server with concurrent requests
    cache.set(url, result)
  }
  return result
}

function readFileCB (url, callback) {
  readFile(url).then(
    res => callback(null, res),
    err => callback(err)
  )
}

export async function resolveSourceMappedPositions (url, line, column) {
  const code = await readFile(url)
  const resolved = await resolveSourceMap(code, url, readFileCB)
  resolved.map.sourcesContent = resolved.sourcesContent
  resolved.map.sources = resolved.sourcesResolved
  const consumer = await new SourceMapConsumer(resolved.map)
  // SourceMapConsumer is 1-based for lines and 0-based for columns
  // https://github.com/mozilla/source-map/blob/0.7.3/lib/source-map-consumer.js#L464-L487
  const result = consumer.originalPositionFor({ line, column })
  consumer.destroy()
  return result
}
