import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'
describe('errors', () => {
  it('bad URL', async () => {
    try {
      await findLeaks('http://localhost:52313')
    } catch (err) {
      expect(err).to.be.an.instanceof(Error)
      return
    }
    throw new Error('Expected an error')
  })

  it('multi-page URL', async () => {
    const results = await findLeaks('http://localhost:3000/test/www/multiPage/a', {
      iterations: 3
    })
    expect(results.length).to.equal(1)
    const { result } = results[0]
    expect(result.leaks.detected).to.equal(false)
    expect(result.leaks.collections.length).to.equal(0)
  })
})