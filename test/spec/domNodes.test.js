import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'
import { asyncIterableToArray } from './util.js'
import { before, describe, it } from 'node:test'
import waitForLocalhost from 'wait-for-localhost'

describe('dom nodes', () => {
  before(async () => {
    await waitForLocalhost({ port: 3000 })
  })
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
    ])

    expect(result.before.domNodes.count).to.equal(14)
    expect(result.after.domNodes.count).to.equal(17)

    expect(result.before.domNodes.nodes.length).to.equal(14)
    expect(result.after.domNodes.nodes.length).to.equal(17)

    // don't expose any keys except for className/description
    for (const node of [...result.before.domNodes.nodes, ...result.after.domNodes.nodes]) {
      expect(Object.keys(node).sort()).to.deep.equal(['className', 'description'])
    }
  })

  it('the tool does not leak dom nodes itself', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/recyclesDomNodes/', {
      iterations: 17 // avoid false positives
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

  it('can handle dom nodes with changing descriptions', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/recyclesDomNodesNewIds/', {
      iterations: 17 // avoid false positives
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

  it('can ignore recycled nodes with changing ids and detect the real leak', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/recyclesDomNodesNewIdsAndActualLeak/', {
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

    expect(result.before.domNodes.count).to.equal(15)
    expect(result.after.domNodes.count).to.equal(18)

    expect(result.leaks.domNodes.nodes).to.deep.equal([
      {
        description: 'div.actually-leaking',
        before: 1,
        after: 4,
        delta: 3,
        deltaPerIteration: 1
      }
    ])
  })

  it('can handle dom nodes leaking with different tag names every time', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/domNodesLeakWithNewNames/', {
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

    expect(result.before.domNodes.count).to.equal(12)
    expect(result.after.domNodes.count).to.equal(15)

    expect(result.leaks.domNodes.nodes).to.deep.equal([
      // TODO: it'd be great to have something here, but it's hard to summarize this situation
    ])
  })
})
