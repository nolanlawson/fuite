import { spawn } from 'child_process'
import path from 'path'
import url from 'url'
import tempDir from 'temp-dir'
import cryptoRandomString from 'crypto-random-string'
import fs from 'fs/promises'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

export async function asyncIterableToArray (iterable) {
  const res = []
  for await (const item of iterable) {
    res.push(item)
  }
  return res
}

export function createTempFile (extension) {
  return path.join(tempDir, `fuite-tmp-${cryptoRandomString({ length: 8, type: 'alphanumeric' })}.${extension}`)
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
