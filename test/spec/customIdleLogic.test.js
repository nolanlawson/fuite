import { findLeaks } from '../../src/index.js'
import * as defaultScenario from '../../src/defaultScenario.js'
import { expect } from 'chai'
import { asyncIterableToArray } from './util.js'
import { before, describe, it } from 'node:test'
import waitForLocalhost from 'wait-for-localhost'

describe('custom idle logic', () => {
  before(async () => {
    await waitForLocalhost({ port: 3000 })
  })
  it('can get custom idle logic from a scenario', async () => {
    const scenario = {
      createTests: defaultScenario.createTests,
      iteration: defaultScenario.iteration,
      waitForIdle (page) {
        return page.waitForSelector('#done', { timeout: 1000 })
      }
    }

    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/customIdleLogic/', {
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
})
