import * as HeapSnapshotModel from './thirdparty/devtools/heap_snapshot_worker/heap_snapshot_model.js'
import { sortBy } from './util.js'
import { createHeapSnapshotModel } from './heapsnapshots.js'

// Make the simplifying assumption that certain classes, especially browser-internal
// ones, aren't really leaks
const browserInternalClasses = new Set([
  // Closures and regexes are a bit unique in that there is no other way to capture when these things leak,
  // other than using the internal "(...)" classes. Even "(array)" has a corresponding "Array" we can track.
  // As for numbers and strings, these just seem too small to be worth tracking on their own.
  // '(closure)',
  // '(regexp)',
  '(array)',
  '(compiled code)',
  '(concatenated string)',
  '(number)',
  '(sliced string)',
  '(string)',
  '(system)',
  'InternalNode',
  'LayoutShift',
  'LayoutShiftAttribution',
  'PerformanceEntry',
  'PerformanceEventTiming',
  'PerformanceLongTaskTiming',
  'PerformanceNavigation',
  'PerformanceNavigationTiming',
  'PerformancePaintTiming',
  'PerformanceResourceTiming',
  'PerformanceTiming',
  'TaskAttributionTiming',
  'system / Context'
])

export async function analyzeHeapSnapshots (startSnapshotFilename, endSnapshotFilename, numIterations) {
  // Read in snapshots serially to avoid using too much memory at once
  let startSnapshot = await createHeapSnapshotModel(startSnapshotFilename)
  const startSnapshotUid = startSnapshot.uid
  const startStatistics = { ...startSnapshot.statistics }
  const aggregatesForDiff = await startSnapshot.aggregatesForDiff()
  const startAggregates = startSnapshot.aggregatesWithFilter(new HeapSnapshotModel.HeapSnapshotModel.NodeFilter())
  startSnapshot = undefined // free memory

  const endSnapshot = await createHeapSnapshotModel(endSnapshotFilename)
  const endStatistics = { ...endSnapshot.statistics }

  const diffByClassName = await endSnapshot.calculateSnapshotDiff(startSnapshotUid, aggregatesForDiff)
  const suspiciousObjects = Object.entries(diffByClassName).filter(([name, diff]) => {
    // look for objects added <iteration> times and not 0 times
    return diff.countDelta % numIterations === 0 && diff.countDelta > 0
  })

  const endAggregates = endSnapshot.aggregatesWithFilter(new HeapSnapshotModel.HeapSnapshotModel.NodeFilter())

  let leakingObjects = suspiciousObjects
    // filter browser internals
    .filter(([name]) => !browserInternalClasses.has(name))
    // Skip any objects that, for whatever reason, aren't in the aggregate collection.
    // We can't do anything with these
    .filter(([name]) => (name in startAggregates && name in endAggregates))

  leakingObjects = leakingObjects.map(([name, diff]) => {
    const startAggregatesForThisClass = startAggregates[name]
    const endAggregatesForThisClass = endAggregates[name]
    const retainedSizeDelta = endAggregatesForThisClass.maxRet - startAggregatesForThisClass.maxRet
    const retainedSizeDeltaPerIteration = Math.round(retainedSizeDelta / numIterations)
    const countDelta = diff.countDelta
    const countDeltaPerIteration = countDelta / numIterations
    return {
      name,
      diff: { ...diff },
      aggregates: {
        before: { ...startAggregatesForThisClass },
        after: { ...endAggregatesForThisClass }
      },
      retainedSizeDelta,
      retainedSizeDeltaPerIteration,
      countDelta,
      countDeltaPerIteration,
      numIterations
    }
  })
  leakingObjects = sortBy(leakingObjects, ['countDelta', 'name'])

  return { leakingObjects, startStatistics, endStatistics }
}
