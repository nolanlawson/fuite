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
    expect(result.leaks.domNodes.delta).to.equal(3)
    expect(result.leaks.domNodes.deltaPerIteration).to.equal(1)

    expect(result.before.domNodes.count).to.equal(14)
    expect(result.after.domNodes.count).to.equal(17)

    expect(result.leaks.domNodes.nodes).to.deep.equal([
      {
        description: 'div',
        before: 2,
        after: 5,
        delta: 3,
        deltaPerIteration: 1
      }
    ]
    )
  })

  it('the tool does not leak dom nodes itself', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/recyclesDomNodes/', {
      iterations: 3
    }))

    expect(results.length).to.equal(1)
    expect(results.map(_ => ({ href: _.test.data.href }))).to.deep.equal([
      { href: 'about' }
    ])
    const result = results[0].result
    expect(result.leaks.detected).to.equal(false)
    expect(result.leaks.domNodes.deltaPerIteration).to.equal(0)
    expect(result.leaks.eventListeners).to.deep.equal([])
  })
})
