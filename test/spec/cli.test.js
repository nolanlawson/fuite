import { createTempFile, runCli } from './util.js'
import { expect } from 'chai'
import fs from 'fs/promises'
import { before, describe, it } from 'node:test'
import waitForLocalhost from 'wait-for-localhost'

// This password has to be random or else Chrome will pop up a "you have an unsafe password" modal
const randoPassword = () => Array(5).fill().map(() => Math.floor(Math.random() * 1000000).toString(16)).join('-')

describe('cli test suite', () => {
  before(async () => {
    await waitForLocalhost({ port: 3000 })
  })
  it('minimal cli test', async () => {
    const results = await runCli(['http://localhost:3000/test/www/minimal/'])

    expect(results.length).to.equal(1)
    const { result } = results[0]
    expect(result.leaks.detected).to.equal(true)

    expect(result.deltaPerIteration).to.be.above(1000000)
    expect(result.deltaPerIteration).to.be.below(2000000)

    const leak = result.leaks.objects.find(_ => _.name === 'SomeBigObject')
    expect(leak.retainedSizeDeltaPerIteration).to.be.above(1000000)
    expect(leak.retainedSizeDeltaPerIteration).to.be.below(2000000)
  })

  it('custom setup function', async () => {
    const tempFile = createTempFile('mjs')
    const fileContents = `
      export async function setup(page) {
        await (await page.$('#username')).type('myusername')
        await (await page.$('#password')).type('${randoPassword()}')
        await (await page.$('#submit')).click()
      }
    `
    await fs.writeFile(tempFile, fileContents, 'utf8')

    const results = await runCli(['http://localhost:3000/test/www/login/', `--setup=${tempFile}`])

    expect(results.length).to.equal(1)
    const { result } = results[0]
    expect(result.leaks.detected).to.equal(true)

    expect(result.deltaPerIteration).to.be.above(1000000)
    expect(result.deltaPerIteration).to.be.below(2000000)

    const leak = result.leaks.objects.find(_ => _.name === 'SomeBigObject')
    expect(leak.retainedSizeDeltaPerIteration).to.be.above(1000000)
    expect(leak.retainedSizeDeltaPerIteration).to.be.below(2000000)
  })

  it('custom scenario', async () => {
    const tempFile = createTempFile('mjs')
    const fileContents = `
        export async function setup(page) {
          await page.type('#username', 'myusername')
          // This password has to be random or else Chrome will pop up a "you have an unsafe password" modal
          await page.type('#password', '${randoPassword()}')
          await page.click('#submit')
        }
        
        export async function iteration(page) {
          await page.click('a[href="info"]')
          await page.goBack()
        }
      `
    await fs.writeFile(tempFile, fileContents, 'utf8')

    const results = await runCli(['http://localhost:3000/test/www/login/', `--scenario=${tempFile}`])

    expect(results.length).to.equal(1)
    const { result } = results[0]
    expect(result.leaks.detected).to.equal(true)

    expect(result.deltaPerIteration).to.be.above(1000000)
    expect(result.deltaPerIteration).to.be.below(2000000)

    const leak = result.leaks.objects.find(_ => _.name === 'SomeBigObject')
    expect(leak.retainedSizeDeltaPerIteration).to.be.above(1000000)
    expect(leak.retainedSizeDeltaPerIteration).to.be.below(2000000)
  })
})
