import * as stackTraceParser from 'stacktrace-parser'
import { resolveSourceMappedPositions } from './resolveSourceMappedPositions.js'
import asTable from 'as-table'

// prettify and add sourcemaps
export async function prettifyStacktrace (stacktrace) {
  const parsed = stackTraceParser.parse(stacktrace)
    // remove the puppeteer code itself; this is confusing for devs since we wrote this code, not them
    .filter(({ file, methodName }) => {
      return !(
        file && file.includes('__puppeteer_evaluation_script__')
      ) && !(
        methodName && methodName.includes('pptr:evaluate')
      )
    })
  const parsedWithSourceMaps = await Promise.all(parsed.map(async (original) => {
    const { lineNumber, methodName, file, column } = original
    if (/^https?:\/\//.test(original.file)) { // looks like a URL we can fetch
      try {
        const resolved = await resolveSourceMappedPositions(file, lineNumber, column)
        return {
          lineNumber: resolved.line,
          column: resolved.column,
          methodName: resolved.name,
          file: resolved.source
        }
      } catch (err) {
        // ignore any individual lines that have broken sourcemaps; we can still show the other lines
        // TODO: exception logging
      }
    }
    return {
      lineNumber,
      column,
      methodName,
      file
    }
  }))

  const tableData = parsedWithSourceMaps.map(({ lineNumber, column, methodName, file }) => {
    const fileAndLocation = [
      file,
      typeof lineNumber === 'number' && `:${lineNumber}`,
      typeof column === 'number' && `:${column}`
    ].filter(Boolean).join('')
    return [
      methodName || '',
      fileAndLocation
    ]
  })

  return asTable(tableData)
}
