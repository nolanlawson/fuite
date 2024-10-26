import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'
import { asyncIterableToArray } from './util.js'
import fs from 'fs/promises'
import { before, describe, it } from 'node:test'
import waitForLocalhost from 'wait-for-localhost'

describe('heapsnapshots', () => {
  before(async () => {
    await waitForLocalhost({ port: 3000 })
  })
  it('heapsnapshot option is false', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/minimal/', {
      iterations: 3
    }))

    expect(results.length).to.equal(1)

    const { result } = results[0]
    expect(result.leaks.detected).to.equal(true)

    expect(result.before.heapsnapshot).to.equal(undefined)
    expect(result.after.heapsnapshot).to.equal(undefined)

    const leak = result.leaks.objects.find(_ => _.name === 'SomeBigObject')
    expect(leak.retainedSizeDeltaPerIteration).to.be.above(1000000)
    expect(leak.retainedSizeDeltaPerIteration).to.be.below(2000000)
  })

  it('heapsnapshot option is true', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/minimal/', {
      iterations: 3,
      heapsnapshot: true
    }))

    expect(results.length).to.equal(1)

    const { result } = results[0]
    expect(result.leaks.detected).to.equal(true)

    expect(result.before.heapsnapshot).to.be.a('string')
    expect(result.after.heapsnapshot).to.be.a('string')

    const assertFileAndNonEmpty = async filename => {
      const stat = await fs.lstat(filename)
      expect(stat.size).to.be.above(0)
      expect(stat.isFile()).to.equal(true)
    }

    await assertFileAndNonEmpty(result.before.heapsnapshot)
    await assertFileAndNonEmpty(result.after.heapsnapshot)

    // clean up ourselves
    await fs.rm(result.before.heapsnapshot)
    await fs.rm(result.after.heapsnapshot)
  })
})
