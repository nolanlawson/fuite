import { spawn } from 'node:child_process'
import path from 'node:path'
import url from 'node:url'
import fs from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { randomUUID } from 'node:crypto'

// via https://github.com/sindresorhus/temp-dir/blob/437937c/index.js#L4
const tempDir = await fs.realpath(tmpdir())

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

export async function asyncIterableToArray (iterable) {
  const res = []
  for await (const item of iterable) {
    res.push(item)
  }
  return res
}

export function createTempFile (extension) {
  return path.join(tempDir, `fuite-tmp-${randomUUID()}.${extension}`)
}

export async function runCli (args) {
  const binPath = path.join(__dirname, '../../src/cli.cjs')
  const tempFile = createTempFile('json')
  args = [...args, `--output=${tempFile}`]

  await new Promise((resolve, reject) => {
    const child = spawn(binPath, args)

    // for debugging
    // child.stderr.pipe(process.stderr)
    // child.stdout.pipe(process.stdout)

    child.on('close', code => {
      if (code !== 0) {
        return reject(new Error(`Child process exited with code ${code}`))
      }
      return resolve()
    })
  })
  return JSON.parse(await fs.readFile(tempFile, 'utf8'))
}
