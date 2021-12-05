import esMain from 'es-main'
import exitHook from 'exit-hook';
import { findLeaks } from './index.js'
import { Command } from 'commander';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

if (!esMain(import.meta)) {
  throw new Error('cli.js should be run directly from the CLI')
}

const program = new Command();

program
  .requiredOption('-u, --url <url>', 'URL to load in the browser')
  .option('-s, --scenario <scenario>', 'Scenario file to run')
  .option('-d, --debug', 'Run in debug mode')
  .version(version)
program.parse(process.argv)
const options = program.opts()

let controller

async function main() {
  controller = new AbortController()
  const { signal } = controller
  const results = await findLeaks(options.url, {
    debug: options.debug,
    scenario: options.scenario,
    signal
  })
  console.log('results.length', results.length)
  console.log('setting controller to undefined')
  controller = undefined
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