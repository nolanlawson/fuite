import { pick, sortBy, sum } from '../../util.js'

function getSumForSummaryAndListenerType (summary, listenerType) {
  return summary.listeners.filter(_ => _.type === listenerType).length
}

function createListenerTypeToAggregatesMap (listenersSummary) {
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

export function analyzeEventListeners (startListenersSummary, endListenersSummary, numIterations) {
  const result = []

  const [startListenerTypesToAggregates, endListenerTypesToAggregates] = [
    createListenerTypeToAggregatesMap(startListenersSummary),
    createListenerTypeToAggregatesMap(endListenersSummary)
  ]

  endListenerTypesToAggregates.forEach((endAggregate, listenerType) => {
    const startAggregate = startListenerTypesToAggregates.get(listenerType)
    if (!startAggregate) {
      return
    }
    if (endAggregate.count <= startAggregate.count) {
      return
    }
    let leakingNodes = []
    const uniqueNodeDescriptions = new Set(endAggregate.summaries.map(_ => _.node.description))
    for (const description of uniqueNodeDescriptions) {
      const startSummaries = startAggregate.summaries.filter(_ => _.node.description === description)
      const endSummaries = endAggregate.summaries.filter(_ => _.node.description === description)

      const countBefore = sum(startSummaries.map(summary => getSumForSummaryAndListenerType(summary, listenerType)))
      const countAfter = sum(endSummaries.map(summary => getSumForSummaryAndListenerType(summary, listenerType)))

      if (countAfter > countBefore) {
        const delta = countAfter - countBefore
        const deltaPerIteration = delta / numIterations
        const nodesBefore = startSummaries.map(_ => pick(_.node, ['className', 'description']))
        const nodesAfter = endSummaries.map(_ => pick(_.node, ['className', 'description']))
        const nodeCountBefore = nodesBefore.length
        const nodeCountAfter = nodesAfter.length
        const nodeCountDelta = nodeCountAfter - nodeCountBefore
        const nodeCountDeltaPerIteration = nodeCountDelta / numIterations
        leakingNodes.push({
          countBefore,
          countAfter,
          delta,
          deltaPerIteration,
          description,
          nodesBefore,
          nodesAfter,
          nodeCountDelta,
          nodeCountDeltaPerIteration
        })
      }
    }
    leakingNodes = sortBy(leakingNodes, ['description'])
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

export function calculateEventListenersSummary (eventListenersStart, eventListenersEnd, numIterations) {
  const before = sum(eventListenersStart.map(({ listeners }) => listeners.length))
  const after = sum(eventListenersEnd.map(({ listeners }) => listeners.length))
  const delta = after - before
  const deltaPerIteration = delta / numIterations

  return {
    before,
    after,
    delta,
    deltaPerIteration
  }
}
