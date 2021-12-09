import chalk from 'chalk'
import prettyBytes from 'pretty-bytes'
import { markdownTable } from 'markdown-table'

export function formatResults (results) {
  let str = ''
  for (const { test, result } of results) {
    str += '\n' + '-'.repeat(20) + '\n'

    str += `\nTest          : ${chalk.blue(test.description)}\n`

    if (result.failed) {
      str += `Failed        : ${result.error.message}\n${result.error.stack}\n`
      continue
    }

    const tableData = [[
      'Object',
      '# added',
      'Retained size increase'
    ]]

    for (const { name, retainedSizeDeltaPerIteration, countDeltaPerIteration } of result.leaks.objects) {
      tableData.push([
        name,
        countDeltaPerIteration,
        prettyBytes(retainedSizeDeltaPerIteration)
      ])
    }

    let leakTables = ''
    if (result.leaks.objects.length) {
      const table = result.leaks.objects.length ? markdownTable(tableData) : ''
      leakTables += `
Leaking objects:

${table}
      `.trim() + '\n\n'
    }

    let snapshots = ''
    if (result.before.heapsnapshot && result.after.heapsnapshot) {
      snapshots = '\n' + `
Before: ${result.before.heapsnapshot} (${chalk.blue(prettyBytes(result.before.statistics.total))})
After : ${result.after.heapsnapshot} (${chalk.red(prettyBytes(result.after.statistics.total))}) (${result.numIterations} iterations)
      `.trim()
    }

    str += `
Memory change : ${result.deltaPerIteration > 0 ? chalk.red('+' + prettyBytes(result.deltaPerIteration)) : chalk.green(prettyBytes(result.deltaPerIteration))}
Leaks detected: ${result.leaks.detected ? chalk.red('Yes') : chalk.green('No') }

${leakTables}
${snapshots}
    `.trim() + '\n'
  }
  return str
}
