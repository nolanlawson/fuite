import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'

describe('event listeners', () => {
  it('can detect leaking event listeners', async () => {
    const results = await findLeaks('http://localhost:3000/test/www/collections/', {
      iterations: 3
    })

    expect(results.length).to.equal(1)
    expect(results.map(_ => ({ href: _.test.data.href }))).to.deep.equal([
      { href: 'about' }
    ])
    const result = results[0].result
    expect(result.leaks.detected).to.equal(true)
    expect(result.leaks.collections).to.deep.equal([
      {
        'type': 'Array',
        'sizeBefore': 3,
        'sizeAfter': 12,
        'delta': 9,
        'deltaPerIteration': 3
      },
      {
        'type': 'Map',
        'sizeBefore': 2,
        'sizeAfter': 8,
        'delta': 6,
        'deltaPerIteration': 2
      },
      {
        'type': 'Object',
        'sizeBefore': 4,
        'sizeAfter': 16,
        'delta': 12,
        'deltaPerIteration': 4
      },
      {
        'type': 'Set',
        'sizeBefore': 1,
        'sizeAfter': 4,
        'delta': 3,
        'deltaPerIteration': 1
      }
    ])
  })
})
