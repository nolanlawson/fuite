import { sortBy } from './util.js'

export function analyzeEventListeners (startListenersSummary, endListenersSummary, numIterations) {
  const result = []

  const createLookupMap = listenersSummary => {
    const map = new Map()
    for (const { listeners } of listenersSummary) {
      for (const listener of listeners) {
        if (!map.has(listener.type)) {
          map.set(listener.type, 0)
        }
        map.set(listener.type, map.get(listener.type) + 1)
      }
    }
    return map
  }

  const [startlistenerTypesToCounts, endlistenerTypesToCounts] = [
    createLookupMap(startListenersSummary),
    createLookupMap(endListenersSummary)
  ]

  endlistenerTypesToCounts.forEach((endCount, listenerType) => {
    const startCount = startlistenerTypesToCounts.get(listenerType) || 0
    if (endCount <= startCount) {
      return
    }
    const leakingNodes = []
    for (const { listeners, node } of endListenersSummary) {
      const countForThisNode = listeners.filter(_ => _.type === listenerType).length
      const oldSummaryForThisNode = startListenersSummary.find(_ => _.node.objectId === node.objectId)

      let oldCountForThisNode = 0
      if (oldSummaryForThisNode) {
        oldCountForThisNode = oldSummaryForThisNode.listeners.filter(_ => _.type === listenerType).length
      }
      if (countForThisNode > oldCountForThisNode) {
        leakingNodes.push({
          node,
          before: oldCountForThisNode,
          after: countForThisNode,
          delta: countForThisNode - oldCountForThisNode,
          deltaPerIteration: (countForThisNode - oldCountForThisNode) / numIterations
        })
      }
    }
    result.push({
      type: listenerType,
      after: endCount,
      before: startCount,
      delta: endCount - startCount,
      deltaPerIteration: (endCount - startCount) / numIterations,
      leakingNodes
    })
  })

  return sortBy(result, ['type'])
}
