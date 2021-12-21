import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'
import { asyncIterableToArray } from './util.js'

describe('invalid collection', () => {
  it('invalid map', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/invalidCollection/', {
      iterations: 3
    }))

    expect(results.length).to.equal(1)
    expect(results[0].result.leaks.detected).to.equal(false)
  })
})
