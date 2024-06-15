import { resolve } from './thirdparty/source-map-resolve/source-map-resolve.js'
import { SourceMapConsumer } from 'source-map'
import { promisify } from 'node:util'
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

function readFileAsErrback (url, callback) {
  readFile(url).then(
    res => callback(null, res),
    err => callback(err)
  )
}

// I found this code very helpful for figuring out how to do this
// https://github.com/DataDog/dd-trace-js/blob/7b27059/packages/dd-trace/src/profiling/mapper.js
export async function resolveSourceMappedPositions (url, line, column) {
  const code = await readFile(url)
  const resolved = await resolveSourceMap(code, url, readFileAsErrback)
  resolved.map.sourcesContent = resolved.sourcesContent
  resolved.map.sources = resolved.sourcesResolved
  const consumer = await new SourceMapConsumer(resolved.map)
  try {
    return consumer.originalPositionFor({ line, column })
  } finally {
    consumer.destroy()
  }
}
