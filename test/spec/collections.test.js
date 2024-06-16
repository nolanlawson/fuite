import { findLeaks } from '../../src/index.js'
import { expect } from 'chai'
import { asyncIterableToArray } from './util.js'
import { omit } from '../../src/util.js'
import { before, describe, it } from 'node:test'
import waitForLocalhost from 'wait-for-localhost'

const normalizeStackTrace = stacktrace => {
  return stacktrace.trim()
    .split('\n')
    .map(_ => _.trim().split(/\s+/))
}

describe('collections', () => {
  before(async () => {
    await waitForLocalhost({ port: 3000 })
  })
  it('can detect leaking collections', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/collections/', {
      iterations: 3
    }))

    expect(results.length).to.equal(1)
    expect(results.map(_ => ({ href: _.test.data.href }))).to.deep.equal([
      { href: 'about' }
    ])
    const result = results[0].result
    expect(result.leaks.detected).to.equal(true)
    expect(result.leaks.collections.map(_ => omit(_, 'stacktraces'))).to.deep.equal([
      {
        type: 'Array',
        sizeBefore: 3,
        sizeAfter: 12,
        delta: 9,
        deltaPerIteration: 3,
        preview: '[function arrayClosure () {}, ...]'
      },
      {
        type: 'Map',
        sizeBefore: 2,
        sizeAfter: 8,
        delta: 6,
        deltaPerIteration: 2,
        preview: 'Map(1: function mapClosure () {}, ...)'
      },
      {
        type: 'Object',
        sizeBefore: 4,
        sizeAfter: 16,
        delta: 12,
        deltaPerIteration: 4,
        preview: '{3: function objectClosure () {}, ...}'
      },
      {
        type: 'Set',
        sizeBefore: 1,
        sizeAfter: 4,
        delta: 3,
        deltaPerIteration: 1,
        preview: 'Set(function setClosure () {}, ...)'
      }
    ])
  })

  it('stacktraces with source maps', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/collectionsWithSourceMaps/', {
      iterations: 3
    }))

    const result = results[0].result
    expect(result.leaks.detected).to.equal(true)
    const expected = `
push           http://localhost:3000/test/www/collectionsWithSourceMaps/script.js:35:8
               webpack://navigo/src/middlewares/checkForAfterHook.ts:10:52
Array.forEach  <anonymous>
forEach        webpack://navigo/src/middlewares/checkForAfterHook.ts:10:36
context        webpack://navigo/src/Q.ts:31:31
next           webpack://navigo/src/Q.ts:34:10
done           webpack://navigo/src/middlewares/callHandler.ts:9:2
context        webpack://navigo/src/Q.ts:31:31
next           webpack://navigo/src/Q.ts:34:10
    `
    const { pretty } = result.leaks.collections[0].stacktraces[0]
    expect(normalizeStackTrace(pretty)).to.deep.equal(normalizeStackTrace(expected))
  })

  it('stacktraces with broken source maps', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/collectionsWithBrokenSourceMaps/', {
      iterations: 3
    }))

    const result = results[0].result
    expect(result.leaks.detected).to.equal(true)
    const expected = `
aboutHook      http://localhost:3000/test/www/collectionsWithBrokenSourceMaps/script.min.js:1:526
               webpack://navigo/src/middlewares/checkForAfterHook.ts:10:52
Array.forEach  <anonymous>
forEach        webpack://navigo/src/middlewares/checkForAfterHook.ts:10:36
context        webpack://navigo/src/Q.ts:31:31
next           webpack://navigo/src/Q.ts:34:10
done           webpack://navigo/src/middlewares/callHandler.ts:9:2
context        webpack://navigo/src/Q.ts:31:31
next           webpack://navigo/src/Q.ts:34:10
    `
    const { pretty } = result.leaks.collections[0].stacktraces[0]
    expect(normalizeStackTrace(pretty)).to.deep.equal(normalizeStackTrace(expected))
  })

  it('no stacktraces when cannot spy on collection size increases', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/collectionsThatCannotBeTracked/', {
      iterations: 3
    }))
    const result = results[0].result
    expect(result.leaks.detected).to.equal(true)
    expect(result.leaks.collections).to.deep.equal([
      {
        type: 'Set',
        sizeBefore: 1,
        sizeAfter: 4,
        delta: 3,
        deltaPerIteration: 1,
        preview: 'Set(ArrayBuffer, ...)',
        stacktraces: []
      }
    ])
  })

  it('lots of leaking collections', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/lotsOfLeakingCollections/', {
      iterations: 3
    }))

    const result = results[0].result
    expect(result.leaks.detected).to.equal(true)
    expect(result.leaks.collections.length).to.equal(5000)

    const firstCollection = result.leaks.collections[0]
    const {
      delta,
      deltaPerIteration,
      preview,
      sizeAfter,
      sizeBefore,
      type
    } = firstCollection
    expect({
      delta,
      deltaPerIteration,
      preview,
      sizeAfter,
      sizeBefore,
      type
    }).to.deep.equal({
      delta: 3,
      deltaPerIteration: 1,
      preview: '[0, ...]',
      sizeAfter: 4,
      sizeBefore: 1,
      type: 'Array'
    })

    const expected = `
aboutHook      http://localhost:3000/test/www/lotsOfLeakingCollections/script.js:9:16
               webpack://navigo/src/middlewares/checkForAfterHook.ts:10:52
Array.forEach  <anonymous>
forEach        webpack://navigo/src/middlewares/checkForAfterHook.ts:10:36
context        webpack://navigo/src/Q.ts:31:31
next           webpack://navigo/src/Q.ts:34:10
done           webpack://navigo/src/middlewares/callHandler.ts:9:2
context        webpack://navigo/src/Q.ts:31:31
next           webpack://navigo/src/Q.ts:34:10
    `
    const { pretty } = firstCollection.stacktraces[0]
    expect(normalizeStackTrace(pretty)).to.deep.equal(normalizeStackTrace(expected))
  })

  it('collections with lots of leaks', async () => {
    const results = await asyncIterableToArray(findLeaks('http://localhost:3000/test/www/collectionsWithLotsOfLeaks/', {
      iterations: 3
    }))

    const result = results[0].result
    expect(result.leaks.detected).to.equal(true)
    expect(result.leaks.collections.length).to.equal(5)

    const firstCollection = result.leaks.collections[0]
    const {
      delta,
      deltaPerIteration,
      preview,
      sizeAfter,
      sizeBefore,
      type
    } = firstCollection
    expect({
      delta,
      deltaPerIteration,
      preview,
      sizeAfter,
      sizeBefore,
      type
    }).to.deep.equal({
      delta: 6000,
      deltaPerIteration: 2000,
      preview: '[0, ...]',
      sizeAfter: 8000,
      sizeBefore: 2000,
      type: 'Array'
    })

    const expected = `
aboutHook      http://localhost:3000/test/www/collectionsWithLotsOfLeaks/script.js:10:18
               webpack://navigo/src/middlewares/checkForAfterHook.ts:10:52
Array.forEach  <anonymous>
forEach        webpack://navigo/src/middlewares/checkForAfterHook.ts:10:36
context        webpack://navigo/src/Q.ts:31:31
next           webpack://navigo/src/Q.ts:34:10
done           webpack://navigo/src/middlewares/callHandler.ts:9:2
context        webpack://navigo/src/Q.ts:31:31
next           webpack://navigo/src/Q.ts:34:10
    `
    const { pretty } = firstCollection.stacktraces[0]
    expect(normalizeStackTrace(pretty)).to.deep.equal(normalizeStackTrace(expected))
  })
})
