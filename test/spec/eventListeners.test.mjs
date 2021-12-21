import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'
import { asyncIterableToArray } from './util.js'

describe('event listeners', () => {
  it('can detect leaking event listeners', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/eventListeners/', {
      iterations: 3
    }))

    expect(results.length).to.equal(1)
    expect(results.map(_ => ({ href: _.test.data.href }))).to.deep.equal([
      { href: 'about' }
    ])
    const result = results[0].result
    expect(result.leaks.detected).to.equal(true)

    expect(result.leaks.eventListenersSummary).to.deep.equal({
      before: 9,
      after: 21,
      delta: 12,
      deltaPerIteration: 4
    })

    expect(result.leaks.eventListeners).to.deep.equal([
      {
        type: 'click',
        after: 7,
        before: 4,
        delta: 3,
        deltaPerIteration: 1,
        leakingNodes: [
          {
            countBefore: 1,
            countAfter: 4,
            delta: 3,
            deltaPerIteration: 1,
            description: '#document',
            nodesBefore: [
              {
                className: 'HTMLDocument',
                description: '#document'
              }
            ],
            nodesAfter: [
              {
                className: 'HTMLDocument',
                description: '#document'
              }
            ],
            nodeCountDelta: 0,
            nodeCountDeltaPerIteration: 0
          }
        ]
      },
      {
        type: 'resize',
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
            description: 'Window',
            nodesBefore: [
              {
                className: 'Window',
                description: 'Window'
              }
            ],
            nodesAfter: [
              {
                className: 'Window',
                description: 'Window'
              }
            ],
            nodeCountDelta: 0,
            nodeCountDeltaPerIteration: 0
          }
        ]
      },
      {
        type: 'transitionend',
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
            description: 'div#persistent',
            nodesBefore: [
              {
                className: 'HTMLDivElement',
                description: 'div#persistent'
              }
            ],
            nodesAfter: [
              {
                className: 'HTMLDivElement',
                description: 'div#persistent'
              }
            ],
            nodeCountDelta: 0,
            nodeCountDeltaPerIteration: 0
          }
        ]
      },
      {
        type: 'transitionstart',
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
            description: 'footer#also-persistent',
            nodesBefore: [
              {
                className: 'HTMLElement',
                description: 'footer#also-persistent'
              }
            ],
            nodesAfter: [
              {
                className: 'HTMLElement',
                description: 'footer#also-persistent'
              }
            ],
            nodeCountDelta: 0,
            nodeCountDeltaPerIteration: 0
          }
        ]
      }
    ])
  })

  it('can detect leaking event listeners in new nodes', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/eventListenersNewNodes/', {
      iterations: 3
    }))

    expect(results.length).to.equal(1)
    expect(results.map(_ => ({ href: _.test.data.href }))).to.deep.equal([
      { href: 'about' }
    ])
    const result = results[0].result
    expect(result.leaks.detected).to.equal(true)

    expect(result.leaks.eventListenersSummary).to.deep.equal({
      before: 7,
      after: 10,
      delta: 3,
      deltaPerIteration: 1
    }
    )

    expect(result.leaks.eventListeners).to.deep.equal([
      {
        type: 'resize',
        after: 7,
        before: 4,
        delta: 3,
        deltaPerIteration: 1,
        leakingNodes: [
          {
            countBefore: 1,
            countAfter: 4,
            delta: 3,
            deltaPerIteration: 1,
            description: 'div',
            nodesBefore: [
              {
                className: 'HTMLDivElement',
                description: 'div'
              }
            ],
            nodesAfter: [
              {
                className: 'HTMLDivElement',
                description: 'div'
              },
              {
                className: 'HTMLDivElement',
                description: 'div'
              },
              {
                className: 'HTMLDivElement',
                description: 'div'
              },
              {
                className: 'HTMLDivElement',
                description: 'div'
              }
            ],
            nodeCountDelta: 3,
            nodeCountDeltaPerIteration: 1
          }
        ]
      }
    ])
  })
})
