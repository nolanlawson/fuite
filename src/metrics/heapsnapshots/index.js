import { takeHeapSnapshot } from './heapsnapshots.js'
import fs from 'node:fs/promises'
import { analyzeHeapSnapshots } from './analyzeHeapsnapshots.js'

export function heapsnapshotsMetric ({ page, cdpSession, numIterations, heapsnapshot }) {
  let startSnapshotFilename
  let endSnapshotFilename

  return {
    async beforeIterations () {
      startSnapshotFilename = await takeHeapSnapshot(page, cdpSession)
    },

    async afterIterations () {
      endSnapshotFilename = await takeHeapSnapshot(page, cdpSession)
    },

    async getResult () {
      const { leakingObjects, startStatistics, endStatistics } = await analyzeHeapSnapshots(
        startSnapshotFilename, endSnapshotFilename, numIterations
      )

      const leaksDetected = leakingObjects.length > 0

      const result = {
        leaksDetected,
        leaks: {
          objects: leakingObjects
        },
        before: {
          statistics: startStatistics
        },
        after: {
          statistics: endStatistics
        }
      }

      if (heapsnapshot) {
        result.before.heapsnapshot = startSnapshotFilename
        result.after.heapsnapshot = endSnapshotFilename
      }

      return result
    },

    async cleanup () {
      if (!heapsnapshot) {
        await Promise.all([fs.rm(startSnapshotFilename), fs.rm(endSnapshotFilename)])
      }
    }
  }
}
