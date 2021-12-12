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
    let nodes = []
    const uniqueNodeIds = new Set(endAggregate.summaries.map(_ => _.node.objectId))
    for (const objectId of uniqueNodeIds) {
      const endSummary = endAggregate.summaries.find(_ => _.node.objectId === objectId)

      nodes.push(
        endSummary.node
      )
    }
    nodes = sortBy(nodes, ['description'])
    result.push({
      type: listenerType,
      after: endAggregate.count,
      before: startAggregate.count,
      delta: endAggregate.count - startAggregate.count,
      deltaPerIteration: (endAggregate.count - startAggregate.count) / numIterations,
      nodes
    })
  })

  return sortBy(result, ['type'])
}
