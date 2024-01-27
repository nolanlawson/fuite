import { makeRouter } from '../basicRouter.js'

const router = makeRouter(['', 'about'])

const collections = Array(5).fill().map(_ => [])

router.addAfterHook('/about', function aboutHook () {
  for (const collection of collections) {
    for (let i = 0; i < 2000; i++) {
      collection.push(0)
    }
  }
})
