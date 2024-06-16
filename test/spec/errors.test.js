import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'
import { asyncIterableToArray } from './util.js'
import { before, describe, it } from 'node:test'
import waitForLocalhost from 'wait-for-localhost'

describe('errors', () => {
  before(async () => {
    await waitForLocalhost({ port: 3000 })
  })
  it('bad URL', async () => {
    try {
      await asyncIterableToArray(findLeaks('http://localhost:52313'))
    } catch (err) {
      expect(err).to.be.an.instanceof(Error)
      return
    }
    throw new Error('Expected an error')
  })

  it('multi-page URL', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/multiPage/a', {
      iterations: 17 // avoid false positives
    }))
    expect(results.length).to.equal(1)
    const { result } = results[0]

    expect(result.leaks.detected).to.equal(false)
    expect(result.leaks.collections.length).to.equal(0)
    expect(result.leaks.domNodes.deltaPerIteration).to.equal(0)
    expect(result.leaks.eventListeners.length).to.equal(0)
  })
})
