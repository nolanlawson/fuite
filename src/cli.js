import esMain from 'es-main'
import exitHook from 'exit-hook'
import { DEFAULT_ITERATIONS, findLeaks } from './index.js'
import { Command } from 'commander'
import { createRequire } from 'module'
import path from 'path'
import { formatResults } from './format.js'
import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs/promises'

const require = createRequire(import.meta.url)
const { version } = require('../package.json')

if (!esMain(import.meta)) {
  throw new Error('cli.js should be run directly from the CLI')
}

const program = new Command()

program
  .argument('<url>', 'URL to load in the browser and analyze')
  .option('-o, --output <file>', 'Write JSON output to a file')
  .option('-i, --iterations <number>', 'Number of iterations', DEFAULT_ITERATIONS)
  .option('-H, --heapsnapshot', 'Save heapsnapshot files')
  .option('-s, --scenario <scenario>', 'Scenario file to run')
  .option('-d, --debug', 'Run in debug mode')
  .version(version)
program.parse(process.argv)
const options = program.opts()
const [url] = program.args

let controller

async function main () {
  controller = new AbortController()
  const { signal } = controller
  let scenario
  if (options.scenario) {
    scenario = await import(path.join(process.cwd(), options.scenario))
  }

  console.log('\n' + `
${chalk.blue('URL')}       : ${url}
${chalk.blue('Scenario')}  : ${options.scenario || 'Default'}
${chalk.blue('Iterations')}: ${options.iterations} ${options.iterations === DEFAULT_ITERATIONS ? '(Default)' : ''}
  `.trim())

  let outputFilename
  if (options.output) {
    outputFilename = path.resolve(process.cwd(), options.output)
    console.log(`
${chalk.blue('Output')}    : ${outputFilename}
    `.trim())
  }
  console.log()

  const spinner = ora('Starting...').start()
  const results = await findLeaks(url, {
    debug: options.debug,
    heapsnapshot: options.heapsnapshot,
    iterations: parseInt(options.iterations, 10),
    scenario,
    signal,
    onProgress (message) {
      spinner.text = message
    }
  })
  spinner.stop()
  controller = undefined

  if (outputFilename) {
    await fs.writeFile(outputFilename, JSON.stringify(results, null, 2), 'utf8')
  }

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
