import { getDomNodesAndListeners } from './eventListeners.js'
import { analyzeEventListeners, calculateEventListenersSummary } from './analyzeEventListeners.js'
import { analyzeDomNodes } from './analyzeDomNodes.js'

export function domNodesAndListenersMetric ({ page, cdpSession, numIterations }) {
  let domNodesStart
  let domNodesEnd
  let eventListenersStart
  let eventListenersEnd

  return {
    async beforeIterations () {
      const { nodes, listeners } = await getDomNodesAndListeners(page, cdpSession)
      domNodesStart = nodes
      eventListenersStart = listeners
    },

    async afterIterations () {
      const { nodes, listeners } = await getDomNodesAndListeners(page, cdpSession)
      domNodesEnd = nodes
      eventListenersEnd = listeners
    },

    getResult () {
      const leakingListeners = analyzeEventListeners(eventListenersStart, eventListenersEnd, numIterations)
      const eventListenersSummary = calculateEventListenersSummary(eventListenersStart, eventListenersEnd, numIterations)
      const leakingDomNodes = analyzeDomNodes(domNodesStart, domNodesEnd, numIterations)
      const domNodesSummary = {
        delta: domNodesEnd.length - domNodesStart.length,
        deltaPerIteration: (domNodesEnd.length - domNodesStart.length) / numIterations,
        nodes: leakingDomNodes
      }

      const leaksDetected = (eventListenersSummary.delta > 0) || (domNodesSummary.delta > 0)

      return {
        leaksDetected,
        leaks: {
          eventListeners: leakingListeners,
          eventListenersSummary, // eventListenersSummary is a separate object for backwards compat
          domNodes: domNodesSummary
        },
        before: {
          eventListeners: eventListenersStart,
          domNodes: {
            count: domNodesStart.length, // domNodesAndListeners.count is redundant, but for backwards compat
            nodes: domNodesStart
          }
        },
        after: {
          eventListeners: eventListenersEnd,
          domNodes: {
            count: domNodesEnd.length, // domNodesAndListeners.count is redundant, but for backwards compat
            nodes: domNodesEnd
          }
        }
      }
    }
  }
}
