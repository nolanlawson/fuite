import { main } from '../../src/cli.js'
import { expect } from 'chai'

describe('basic test suite', () => {
  it('can detect a simple leak', async () => {
    const results = await main('http://localhost:3000/test/www/basic/')

    console.log(results)
    expect(results.length).to.equal(3)
    expect(results.map(_ => _.test)).to.deep.equal([
      { href: 'http://localhost:3000/test/www/basic/about' },
      { href: 'http://localhost:3000/test/www/basic/info' },
      { href: 'http://localhost:3000/test/www/basic/contact' }
    ])

    const deltas = results.map(_ => _.result.memorySizeDelta)
    expect(deltas[0]).to.be.above(7000000)
    expect(deltas[0]).to.be.below(8000000)

    expect(deltas[1]).to.be.above(0)
    expect(deltas[1]).to.be.below(100000)

    expect(deltas[2]).to.be.above(0)
    expect(deltas[2]).to.be.below(100000)
  })
})