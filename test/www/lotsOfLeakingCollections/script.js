import { makeRouter } from '../basicRouter.js'

const router = makeRouter(['', 'about'])

const collections = Array(5000).fill().map(_ => [])

router.addAfterHook('/about', function aboutHook () {
  for (const collection of collections) {
    collection.push(0)
  }
})
