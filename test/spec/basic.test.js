import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'
import { asyncIterableToArray } from './util.js'
import { before, describe, it } from 'node:test'
import waitForLocalhost from 'wait-for-localhost'

describe('basic test suite', () => {
  before(async () => {
    await waitForLocalhost({ port: 3000 })
  })
  it('can detect a simple leak', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/basic/', {
      iterations: 3
    }))

    expect(results.length).to.equal(3)
    expect(results.map(_ => ({ href: _.test.data.href }))).to.deep.equal([
      { href: 'about' },
      { href: 'info' },
      { href: 'contact' }
    ])
    expect(results.map(_ => _.result.leaks.detected)).to.deep.equal([true, false, false])
    expect(results.map(_ => _.result.numIterations)).to.deep.equal([3, 3, 3])

    const deltas = results.map(_ => _.result.deltaPerIteration)
    expect(deltas[0]).to.be.above(1000000)
    expect(deltas[0]).to.be.below(2000000)

    expect(deltas[1]).to.be.above(0)
    expect(deltas[1]).to.be.below(100000)

    expect(deltas[2]).to.be.above(0)
    expect(deltas[2]).to.be.below(100000)

    const leak = results[0].result.leaks.objects.find(_ => _.name === 'SomeBigObject')
    expect(leak.retainedSizeDeltaPerIteration).to.be.above(1000000)
    expect(leak.retainedSizeDeltaPerIteration).to.be.below(2000000)

    expect(Object.keys(results[0].result.before.statistics).sort()).to.deep.equal([
      'native', 'total', 'v8heap'
    ])
    expect(Object.keys(results[0].result.after.statistics).sort()).to.deep.equal([
      'native', 'total', 'v8heap'
    ])
  })

  it('works with invisible links', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/invisibleLinks/', {
      iterations: 3
    }))

    expect(results.length).to.equal(3)
    expect(results.map(_ => ({ href: _.test.data.href }))).to.deep.equal([
      { href: 'about' },
      { href: 'info' },
      { href: 'contact' }
    ])
    expect(results.map(_ => _.result.leaks.detected)).to.deep.equal([false, false, false])

    const deltas = results.map(_ => _.result.deltaPerIteration)
    expect(deltas[0]).to.be.above(0)
    expect(deltas[0]).to.be.below(100000)

    expect(deltas[1]).to.be.above(0)
    expect(deltas[1]).to.be.below(100000)

    expect(deltas[2]).to.be.above(0)
    expect(deltas[2]).to.be.below(100000)
  })
})
