import chalk from 'chalk'
import prettyBytes from 'pretty-bytes'
import { markdownTable } from 'markdown-table'

export function formatResults (results) {
  let str = ''
  for (const { test, result } of results) {
    str += '\n' + '-'.repeat(20) + '\n'

    str += `\nTest: ${chalk.blue(test.description)}\n`

    if (result.failed) {
      str += `Failed: ${result.error.message}\n${result.error.stack}\n`
      continue
    }

    const tableData = [[
      'Object',
      '# added',
      'Retained size increase'
    ]]

    for (const { name, retainedSizeDeltaPerIteration, countDeltaPerIteration } of result.leakingObjects) {
      tableData.push([
        name,
        countDeltaPerIteration,
        prettyBytes(retainedSizeDeltaPerIteration)
      ])
    }

    const table = result.leakingObjects.length ? markdownTable(tableData) : ''

    let snapshots = ''
    if (result.snapshots) {
      snapshots = '\n' + `
Before: ${result.snapshots.before} (${chalk.blue(prettyBytes(result.before.statistics.total))})
After : ${result.snapshots.after} (${chalk.red(prettyBytes(result.after.statistics.total))}) (${result.numIterations} iterations)
      `.trim()
    }

    str += `
Leak: ${(result.deltaPerIteration > 0 ? chalk.red : chalk.green)(prettyBytes(result.deltaPerIteration))}
Probably not leaking: ${result.probablyNotLeaking}

Leaking objects:

${table}
${snapshots}
    `.trim() + '\n'
  }
  return str
}
