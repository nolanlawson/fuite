import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'
import { asyncIterableToArray } from './util.js'
import { before, describe, it } from 'node:test'
import waitForLocalhost from 'wait-for-localhost'

describe('shadow dom', () => {
  before(async () => {
    await waitForLocalhost({ port: 3000 })
  })
  it('can detect leaking dom nodes and listeners', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/shadowDom/', {
      iterations: 3
    }))

    expect(results.length).to.equal(1)
    expect(results.map(_ => ({ href: _.test.data.href }))).to.deep.equal([
      { href: 'info' }
    ])
    const result = results[0].result
    expect(result.leaks.detected).to.equal(true)
    expect(result.leaks.domNodes.deltaPerIteration).to.equal(1)
    expect(result.leaks.eventListeners).to.deep.equal([
      {
        type: 'mouseenter',
        after: 4,
        before: 1,
        delta: 3,
        deltaPerIteration: 1,
        leakingNodes: [
          {
            countBefore: 1,
            countAfter: 4,
            delta: 3,
            deltaPerIteration: 1,
            description: 'div.inside-shadow-leaks-listener',
            nodesBefore: [
              {
                className: 'HTMLDivElement',
                description: 'div.inside-shadow-leaks-listener'
              }
            ],
            nodesAfter: [
              {
                className: 'HTMLDivElement',
                description: 'div.inside-shadow-leaks-listener'
              }
            ],
            nodeCountDelta: 0,
            nodeCountDeltaPerIteration: 0
          }
        ]
      }
    ]
    )
  })
})
