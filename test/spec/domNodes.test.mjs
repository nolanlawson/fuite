import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'
import { asyncIterableToArray } from './util.js'

describe('dom nodes', () => {
  it('can detect leaking dom nodes', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/domNodes/', {
      iterations: 3
    }))

    expect(results.length).to.equal(1)
    expect(results.map(_ => ({ href: _.test.data.href }))).to.deep.equal([
      { href: 'about' }
    ])
    const result = results[0].result
    expect(result.leaks.detected).to.equal(true)
    expect(result.leaks.domNodes.deltaPerIteration).to.equal(1)
  })
})
