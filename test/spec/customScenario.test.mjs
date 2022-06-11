import { findLeaks } from '../../src/index.js'
import * as defaultScenario from '../../src/defaultScenario.js'
import { expect } from 'chai'
import { asyncIterableToArray } from './util.js'

describe('custom scenario', () => {
  it('can do a custom version of the default scenario', async () => {
    const scenario = {
      async setup (page) {
        await (await page.$('#username')).type('myusername')
        await (await page.$('#password')).type('mypassword')
        await (await page.$('#submit')).click()
      },
      createTests: defaultScenario.createTests,
      iteration: defaultScenario.iteration
    }
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/login/', {
      iterations: 3,
      scenario
    }))
    expect(results.length).to.equal(1)
    const { result } = results[0]
    expect(result.leaks.detected).to.equal(true)

    expect(result.deltaPerIteration).to.be.above(1000000)
    expect(result.deltaPerIteration).to.be.below(2000000)

    const leak = result.leaks.objects.find(_ => _.name === 'SomeBigObject')
    expect(leak.retainedSizeDeltaPerIteration).to.be.above(1000000)
    expect(leak.retainedSizeDeltaPerIteration).to.be.below(2000000)
  })

  it('can do a custom scenario with no createTests', async () => {
    const scenario = {
      async iteration (page) {
        await page.click('a[href="info"]')
        await page.evaluate(() => new Promise((resolve) => window.requestIdleCallback(resolve)))
        await page.goBack()
        await page.evaluate(() => new Promise((resolve) => window.requestIdleCallback(resolve)))
      }
    }

    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/minimal/', {
      iterations: 3,
      scenario
    }))
    expect(results.length).to.equal(1)
    const { result } = results[0]
    expect(result.leaks.detected).to.equal(true)

    expect(result.deltaPerIteration).to.be.above(1000000)
    expect(result.deltaPerIteration).to.be.below(2000000)

    const leak = result.leaks.objects.find(_ => _.name === 'SomeBigObject')
    expect(leak.retainedSizeDeltaPerIteration).to.be.above(1000000)
    expect(leak.retainedSizeDeltaPerIteration).to.be.below(2000000)
  })

  it('can do a custom scenario with teardown', async () => {
    let teardownCalled = false
    const scenario = {
      async iteration (page) {
        await page.click('a[href="info"]')
        await page.evaluate(() => new Promise((resolve) => window.requestIdleCallback(resolve)))
        await page.goBack()
        await page.evaluate(() => new Promise((resolve) => window.requestIdleCallback(resolve)))
      },
      teardown (page) {
        teardownCalled = true
        return Promise.resolve()
      }
    }

    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/minimal/', {
      iterations: 3,
      scenario
    }))

    expect(results.length).to.equal(1)
    expect(teardownCalled).to.equal(true)
  })
})
