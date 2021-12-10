import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'

describe('event listeners', () => {
  it('can detect leaking event listeners', async () => {
    const results = await findLeaks('http://localhost:3000/test/www/eventListeners/', {
      iterations: 3
    })

    expect(results.length).to.equal(1)
    expect(results.map(_ => ({ href: _.test.data.href }))).to.deep.equal([
      { href: 'about' }
    ])
    const result = results[0].result
    expect(result.leaks.detected).to.equal(true)
    expect(result.leaks.eventListeners.length).to.equal(4)

    const summary = result.leaks.eventListeners.map(_ => ({
      type: _.type,
      before: _.before,
      after: _.after,
      leakingNodes: _.leakingNodes.map(node => ({
        before: node.before,
        after: node.after,
        delta: node.delta,
        node: {
          className: node.node.className,
          description: node.node.description
        }
      }))
    }))
    expect(summary).to.deep.equal([
      {
        type: 'click',
        before: 4,
        after: 7,
        leakingNodes: [
          {
            before: 1,
            after: 4,
            delta: 3,
            node: {
              className: 'HTMLDocument',
              description: '#document'
            }
          }
        ]
      },
      {
        type: 'resize',
        before: 1,
        after: 4,
        leakingNodes: [
          {
            before: 1,
            after: 4,
            delta: 3,
            node: {
              className: 'Window',
              description: 'Window'
            }
          }
        ]
      },
      {
        type: 'transitionend',
        before: 1,
        after: 4,
        leakingNodes: [
          {
            before: 1,
            after: 4,
            delta: 3,
            node: {
              className: 'HTMLDivElement',
              description: 'div#persistent'
            }
          }
        ]
      },
      {
        type: 'transitionstart',
        before: 1,
        after: 4,
        leakingNodes: [
          {
            before: 1,
            after: 4,
            delta: 3,
            node: {
              className: 'HTMLElement',
              description: 'footer#also-persistent'
            }
          }
        ]
      }
    ])
  })
})
