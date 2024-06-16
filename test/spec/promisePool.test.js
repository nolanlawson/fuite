import { promisePool } from '../../src/promisePool.js'
import { expect } from 'chai'
import { describe, it } from 'node:test'

describe('promisePool', () => {
  it('basic test', async () => {
    let callCount = 0
    const promiseFactories = Array(100).fill().map((_, i) => async () => {
      callCount++
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 5)))
      return i
    })

    const results = await promisePool(5, promiseFactories)
    expect(results).to.deep.equal(new Array(100).fill().map((_, i) => i))
    expect(callCount).to.equal(100)
  })
})
