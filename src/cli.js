import exitHook from 'exit-hook'
import { DEFAULT_ITERATIONS, defaultScenario, findLeaks } from './index.js'
import { Command } from 'commander'
import { createRequire } from 'node:module'
import path from 'node:path'
import { formatResult } from './format.js'
import chalk from 'chalk'
import { createWriteStream } from 'node:fs'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const { version } = require('../package.json')

const program = new Command()

// Parse `-b foo -b baz` as ["foo", "baz"], or `-b foo` as ["foo"]
const parseAsArray = (value, previousValue) => [...(previousValue || []), value]

program
  .argument('<url>', 'URL to load in the browser and analyze')
  .option('-o, --output <file>', 'Write JSON output to a file')
  .option('-i, --iterations <number>', 'Number of iterations', DEFAULT_ITERATIONS)
  .option('-H, --heapsnapshot', 'Save heapsnapshot files')
  .option('-s, --scenario <scenario>', 'Scenario file to run')
  .option('-S, --setup <setup>', 'Setup function to run (e.g. in the default scenario)')
  .option('-d, --debug', 'Run in debug mode')
  .option('-p, --progress', 'Show progress spinner (--no-progress to disable)', true)
  .option('-b, --browser-arg <arg>', 'Arg(s) to pass when launching the browser', parseAsArray)
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
    scenario = await import(pathToFileURL(path.resolve(process.cwd(), options.scenario)))
  } else {
    scenario = defaultScenario
  }
  if (options.setup) {
    // override whatever setup function is defined on the scenario
    const { setup } = await import(pathToFileURL(path.resolve(process.cwd(), options.setup)))
    scenario = {
      ...scenario,
      setup
    }
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

  const iterations = parseInt(options.iterations, 10)
  const { debug, heapsnapshot, progress, browserArg: browserArgs } = options
  console.log(chalk.blue('TEST RESULTS') + '\n\n' + '-'.repeat(20) + '\n')
  let writeCount = 0
  const writeStream = outputFilename && createWriteStream(outputFilename, 'utf8')
  if (writeStream) {
    writeStream.write('[\n')
  }
  let leaksDetected = false
  const findLeaksIterable = findLeaks(url, {
    debug,
    heapsnapshot,
    iterations,
    scenario,
    signal,
    progress,
    browserArgs
  })
  let numResults = 0
  for await (const result of findLeaksIterable) {
    numResults++
    console.log(formatResult(result))
    console.log('\n' + '-'.repeat(20) + '\n')
    if (result.leaks && result.leaks.detected) {
      leaksDetected = true
    }
    if (writeStream) {
      if (writeCount > 0) {
        writeStream.write(',\n')
      }
      writeStream.write(JSON.stringify(result, null, 2))
      writeCount++
    }
  }
  controller = undefined

  if (!numResults) {
    console.log('No tests to run.')
    if (!scenario) {
      console.log('(In the default scenario, this means that no internal links were found on the page.)\n')
    }
  } else if (leaksDetected) {
    let str = ''
    str += `
For more details:
  - Run with --debug
  - Run with --output <filename>
    `.trim() + '\n'
    console.log(str)
  }

  if (writeStream) {
    const writeStreamPromise = new Promise((resolve, reject) => {
      writeStream.on('error', reject)
      writeStream.on('finish', () => resolve())
    })
    writeStream.write('\n]')
    writeStream.close()
    await writeStreamPromise
  }
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
