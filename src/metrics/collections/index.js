import {
  augmentLeakingCollectionsWithStacktraces,
  findLeakingCollections,
  startTrackingCollections
} from './collections.js'
import { omit } from '../../util.js'

export function collectionsMetric ({ page, numIterations, debug }) {
  let collectionsToCountsMap
  let leakingCollections
  let trackedStacktraces

  return {
    async beforeIterations () {
      collectionsToCountsMap = await startTrackingCollections(page)
    },

    async afterIterations () {
      const result = await findLeakingCollections(page, collectionsToCountsMap, numIterations, debug)

      trackedStacktraces = result.trackedStacktraces
      leakingCollections = result.collections
    },

    needsExtraIteration () {
      return leakingCollections.length > 0
    },

    async afterExtraIteration () {
      leakingCollections = await augmentLeakingCollectionsWithStacktraces(page, leakingCollections, trackedStacktraces)
    },

    getResult () {
      leakingCollections = leakingCollections.map(_ => omit(_, ['id']))

      const leaksDetected = leakingCollections.length > 0

      return {
        leaksDetected,
        leaks: {
          collections: leakingCollections
        }
      }
    },

    cleanup () {
      if (trackedStacktraces) {
        trackedStacktraces.dispose()
      }
    }
  }
}
