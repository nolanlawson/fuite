import { sortBy } from './util.js'

export function analyzeEventListeners (startListenersSummary, endListenersSummary, numIterations) {
  const result = []

  const createListenerTypeToAggregatesMap = listenersSummary => {
    const map = new Map()
    for (const summary of listenersSummary) {
      for (const listener of summary.listeners) {
        let aggregate = map.get(listener.type)
        if (!aggregate) {
          aggregate = {
            count: 0,
            summaries: []
          }
          map.set(listener.type, aggregate)
        }
        aggregate.count++
        if (!aggregate.summaries.includes(summary)) {
          aggregate.summaries.push(summary)
        }
      }
    }
    return map
  }

  const [startListenerTypesToAggregates, endListenerTypesToAggregates] = [
    createListenerTypeToAggregatesMap(startListenersSummary),
    createListenerTypeToAggregatesMap(endListenersSummary)
  ]


  endListenerTypesToAggregates.forEach((endAggregate, listenerType) => {
    const startAggregate = startListenerTypesToAggregates.get(listenerType)
    debugger
    if (!startAggregate) {
      return
    }
    if (endAggregate.count <= startAggregate.count) {
      return
    }
    const leakingNodes = []
    const uniqueNodeIds = new Set(endAggregate.summaries.map(_ => _.node.objectId))
    debugger
    for (const objectId of uniqueNodeIds) {
      const endSummary = endAggregate.summaries.find(_ => _.node.objectId === objectId)

      const newCountForThisNodeAndListener = endSummary.listeners.filter(_ => _.type === listenerType).length
      const startSummary = startAggregate.summaries.find(startSummary => startSummary.node.objectId === objectId)

      let oldCountForThisNodeAndListener = 0
      if (startSummary) {
        oldCountForThisNodeAndListener = startSummary.listeners.filter(_ => _.type === listenerType).length
      }
      if (newCountForThisNodeAndListener > oldCountForThisNodeAndListener) {
        const delta = newCountForThisNodeAndListener - oldCountForThisNodeAndListener
        const deltaPerIteration = delta / numIterations
        leakingNodes.push({
          node: endSummary.node,
          before: oldCountForThisNodeAndListener,
          after: newCountForThisNodeAndListener,
          delta,
          deltaPerIteration
        })
      }
    }
    result.push({
      type: listenerType,
      after: endAggregate.count,
      before: startAggregate.count,
      delta: endAggregate.count - startAggregate.count,
      deltaPerIteration: (endAggregate.count - startAggregate.count) / numIterations,
      leakingNodes
    })
  })

  return sortBy(result, ['type'])
}
