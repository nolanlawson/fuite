import { randomUUID } from 'node:crypto'
import { omit, pick } from '../../util.js'
import { getDescriptors } from '../../getDescriptors.js'
import { getAllDomNodes } from '../../browser/getAllDomNodes.js'

// via https://stackoverflow.com/a/67030384
export async function getDomNodesAndListeners (page, cdpSession) {
  const objectGroup = randomUUID()
  const { result: { objectId } } = await cdpSession.send('Runtime.evaluate', {
    expression: `
        (function () {
          ${getAllDomNodes}
          return [...getAllDomNodes(), window, document]
        })()
      `,
    objectGroup
  })
  const nodeDescriptors = await getDescriptors(cdpSession, objectId)

  const listenersWithNodes = []

  // scrub the objects for external consumption, remove unnecessary stuff like objectId
  const cleanNode = node => pick(node, ['className', 'description'])
  const cleanListener = listener => ({
    // originalHandler seems to contain the same information as handler
    ...omit(listener, ['backendNodeId', 'originalHandler']),
    handler: omit(listener.handler, ['objectId'])
  })

  for (const node of nodeDescriptors) {
    const { objectId } = node

    const { listeners } = await cdpSession.send('DOMDebugger.getEventListeners', { objectId })

    if (listeners.length) {
      listenersWithNodes.push({
        node: cleanNode(node),
        listeners: listeners.map(cleanListener)
      })
    }
  }

  await cdpSession.send('Runtime.releaseObjectGroup', { objectGroup })

  // don't include the window/document objects in the list of dom nodes
  const returnNodes = nodeDescriptors.slice(0, nodeDescriptors.length - 2).map(cleanNode)

  return {
    nodes: returnNodes,
    listeners: listenersWithNodes
  }
}
