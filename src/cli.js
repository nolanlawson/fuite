import esMain from 'es-main'
import exitHook from 'exit-hook'
import { DEFAULT_ITERATIONS, findLeaks } from './index.js'
import { Command } from 'commander'
import { createRequire } from 'module'
import path from 'path'
import { formatResult } from './format.js'
import chalk from 'chalk'
import { createWriteStream } from 'fs'

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
  .option('-p, --progress', 'Show progress spinner (--no-progress to disable)', true)
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

  const iterations = parseInt(options.iterations, 10)
  const { debug, heapsnapshot, progress } = options
  console.log(chalk.blue('TEST RESULTS') + '\n\n' + '-'.repeat(20) + '\n')
  let writeCount = 0
  const writeStream = outputFilename && createWriteStream(outputFilename, 'utf8')
  if (writeStream) {
    writeStream.write('[\n')
  }
  let leaksDetected = false
  await findLeaks(url, {
    debug,
    heapsnapshot,
    iterations,
    scenario,
    signal,
    progress,
    returnResults: false,
    onResult: result => {
      console.log(formatResult(result))
      console.log('\n' + '-'.repeat(20) + '\n')
      if (result.leaks?.detected) {
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
  })
  controller = undefined

  if (leaksDetected) {
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
