import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'

function createSummary (eventListeners) {
  return eventListeners.map(_ => ({
    type: _.type,
    before: _.before,
    after: _.after,
    nodes: _.nodes.map(node => ({
      className: node.className,
      description: node.description
    }))
  }))
}

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

    const summary = createSummary(result.leaks.eventListeners)
    expect(summary).to.deep.equal([
      {
        type: 'click',
        before: 4,
        after: 7,
        nodes: [
          {
            className: 'HTMLDocument',
            description: '#document'
          },
          {
            'className': 'HTMLAnchorElement',
            'description': 'a'
          },
          {
            'className': 'HTMLAnchorElement',
            'description': 'a'
          },
          {
            'className': 'HTMLBodyElement',
            'description': 'body'
          },
        ]
      },
      {
        type: 'resize',
        before: 1,
        after: 4,
        nodes: [
          {
            className: 'Window',
            description: 'Window'
          }
        ]
      },
      {
        type: 'transitionend',
        before: 1,
        after: 4,
        nodes: [
          {
            className: 'HTMLDivElement',
            description: 'div#persistent'
          }
        ]
      },
      {
        type: 'transitionstart',
        before: 1,
        after: 4,
        nodes: [{
          className: 'HTMLElement',
          description: 'footer#also-persistent'
        }
        ]
      }
    ])
  })

  it('can detect leaking event listeners in new nodes', async () => {
    const results = await findLeaks('http://localhost:3000/test/www/eventListenersNewNodes/', {
      iterations: 3
    })

    expect(results.length).to.equal(1)
    expect(results.map(_ => ({ href: _.test.data.href }))).to.deep.equal([
      { href: 'about' }
    ])
    const result = results[0].result
    expect(result.leaks.detected).to.equal(true)

    const summary = createSummary(result.leaks.eventListeners)
    expect(summary).to.deep.equal([
      {
        'type': 'resize',
        'before': 4,
        'after': 7,
        'nodes': [
          {
            'className': 'HTMLDocument',
            'description': '#document'
          },
          {
            'className': 'Window',
            'description': 'Window'
          },
          {
            'className': 'HTMLBodyElement',
            'description': 'body'
          },
          {
            'className': 'HTMLDivElement',
            'description': 'div'
          },
          {
            'className': 'HTMLDivElement',
            'description': 'div'
          },
          {
            'className': 'HTMLDivElement',
            'description': 'div'
          },
          {
            'className': 'HTMLDivElement',
            'description': 'div'
          },
        ]
      }
    ])
  })
})
