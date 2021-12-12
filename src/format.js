import chalk from 'chalk'
import prettyBytes from 'pretty-bytes'
import { markdownTable } from 'markdown-table'

function formatLeakingObjects (objects) {
  const tableData = [[
    'Object',
    '# added',
    'Retained size increase'
  ]]

  for (const { name, retainedSizeDeltaPerIteration, countDeltaPerIteration } of objects) {
    tableData.push([
      name,
      countDeltaPerIteration,
      '+' + prettyBytes(retainedSizeDeltaPerIteration)
    ])
  }
  return `
Leaking objects:

${markdownTable(tableData)}
      `.trim() + '\n\n'
}

function formatLeakingEventListeners (listenerSummaries) {
  const tableData = [[
    'Event',
    '# added',
    'Nodes'
  ]]

  for (const { type, deltaPerIteration, leakingNodes } of listenerSummaries) {
    const nodesFormatted = leakingNodes.map(({ description, nodeCountDeltaPerIteration }) => {
      return `${description}${nodeCountDeltaPerIteration !== 0 ? ` (+${nodeCountDeltaPerIteration})` : ''}`
    }).join(', ')
    tableData.push([
      type,
      deltaPerIteration,
      nodesFormatted
    ])
  }
  return `
Leaking event listeners:

${markdownTable(tableData)}
      `.trim() + '\n\n'
}

function formatLeakingDomNodes (domNodes) {
  return `
Leaking DOM nodes:

DOM size grew by ${domNodes.deltaPerIteration} node(s)
  `.trim() + '\n\n'
}

function formatLeakingCollections (leakingCollections) {
  const tableData = [[
    'Collection type',
    'Size increase',
    'Preview'
  ]]

  for (const { type, deltaPerIteration, preview } of leakingCollections) {
    tableData.push([
      type,
      deltaPerIteration,
      preview
    ])
  }
  return `
Leaking collections:

${markdownTable(tableData)}
      `.trim() + '\n\n'
}

export function formatResults (results) {
  let str = ''
  for (const { test, result } of results) {
    str += '\n' + '-'.repeat(20) + '\n'

    str += `\nTest         : ${chalk.blue(test.description)}\n`

    if (result.failed) {
      str += `Failed       : ${result.error.message}\n${result.error.stack}\n`
      continue
    }

    let leakTables = ''
    if (result.leaks.objects.length) {
      leakTables += formatLeakingObjects(result.leaks.objects)
    }
    if (result.leaks.eventListeners.length) {
      leakTables += formatLeakingEventListeners(result.leaks.eventListeners)
    }
    if (result.leaks.domNodes.delta > 0) {
      leakTables += formatLeakingDomNodes(result.leaks.domNodes)
    }
    if (result.leaks.collections.length) {
      leakTables += formatLeakingCollections(result.leaks.collections)
    }

    let snapshots = ''
    if (result.before.heapsnapshot && result.after.heapsnapshot) {
      snapshots = '\n' + `
Before: ${result.before.heapsnapshot} (${chalk.blue(prettyBytes(result.before.statistics.total))})
After : ${result.after.heapsnapshot} (${chalk.red(prettyBytes(result.after.statistics.total))}) (${result.numIterations} iterations)
      `.trim()
    }

    str += `
Memory change: ${result.deltaPerIteration > 0 ? chalk.red('+' + prettyBytes(result.deltaPerIteration)) : chalk.green(prettyBytes(result.deltaPerIteration))}
Leak detected: ${result.leaks.detected ? chalk.red('Yes') : chalk.green('No')}

${leakTables}
${snapshots}
    `.trim() + '\n'
  }

  if (results.some(({ result }) => result.leaks?.detected)) {
    str += '\n' + '-'.repeat(20) + '\n\n'
    str += `
For more details:
  - Run with --debug
  - Run with --output <filename>
    `.trim() + '\n'
  }

  return str
}
