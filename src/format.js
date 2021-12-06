import chalk from 'chalk'
import prettyBytes from 'pretty-bytes'
import { markdownTable } from 'markdown-table'

export function formatResults (results) {
  let str = ''
  results.forEach(({ test, result }) => {
    str += '\n' + '-'.repeat(20) + '\n'
    const tableData = [[
      'Object',
      '# added',
      'Retained size'
    ]]

    for (const { name, retainedSizeDeltaPerIteration, countDeltaPerIteration } of result.leakingObjects) {
      tableData.push([
        name,
        countDeltaPerIteration,
        prettyBytes(retainedSizeDeltaPerIteration)
      ])
    }

    const table = result.leakingObjects.length ? markdownTable(tableData) : ''

    str += '\n' + `
Test: ${chalk.blue(test.description)}
Leak: ${(result.deltaPerIteration > 0 ? chalk.red : chalk.green)(prettyBytes(result.deltaPerIteration))}

Leaking objects:

${table}

Before: ${result.snapshots.before} (${chalk.blue(prettyBytes(result.before.statistics.total))})
After : ${result.snapshots.after} (${chalk.red(prettyBytes(result.after.statistics.total))}) (${result.numIterations} iterations)
    `.trim() + '\n'
  })
  return str
}
