import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'
import { asyncIterableToArray } from './util.js'
import { before, describe, it } from 'node:test'
import waitForLocalhost from 'wait-for-localhost'

describe('invalid collection', () => {
  before(async () => {
    await waitForLocalhost({ port: 3000 })
  })
  it('invalid map', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/invalidCollection/', {
      iterations: 17 // avoid false positives
    }))

    expect(results.length).to.equal(1)
    expect(results[0].result.leaks.detected).to.equal(false)
  })
})
