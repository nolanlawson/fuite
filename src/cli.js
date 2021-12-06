import esMain from 'es-main'
import exitHook from 'exit-hook'
import { DEFAULT_ITERATIONS, findLeaks } from './index.js'
import { Command } from 'commander'
import { createRequire } from 'module'
import path from 'path'
import { formatResults } from './format.js'
import chalk from 'chalk'
import ora from 'ora';

const require = createRequire(import.meta.url)
const { version } = require('../package.json')

if (!esMain(import.meta)) {
  throw new Error('cli.js should be run directly from the CLI')
}

const program = new Command()

program
  .requiredOption('-u, --url <url>', 'URL to load in the browser')
  .option('-s, --scenario <scenario>', 'Scenario file to run')
  .option('-i, --iterations <number>', 'Number of iterations', DEFAULT_ITERATIONS)
  .option('-d, --debug', 'Run in debug mode')
  .version(version)
program.parse(process.argv)
const options = program.opts()

let controller

async function main () {
  controller = new AbortController()
  const { signal } = controller
  let scenario
  if (options.scenario) {
    scenario = await import(path.join(process.cwd(), options.scenario))
  }

  console.log(`
${chalk.blue('URL')}       : ${options.url}
${chalk.blue('Scenario')}  : ${options.scenario || 'Default'}
${chalk.blue('Iterations')}: ${options.iterations} ${options.iterations === DEFAULT_ITERATIONS ? '(Default)' : ''}
  `.trim() + '\n')

  const spinner = ora('Analyzing...').start()
  const results = await findLeaks(options.url, {
    debug: options.debug,
    iterations: parseInt(options.iterations, 10),
    scenario,
    signal
  })
  spinner.stop()
  controller = undefined
  console.log(chalk.blue('TEST RESULTS'))
  console.log(formatResults(results))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

exitHook(() => {
  if (controller) {
    controller.abort()
  }
})
