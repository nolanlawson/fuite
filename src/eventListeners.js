import { v4 as uuidV4 } from 'uuid'
import { omit, pick } from './util.js'
import { getAllDomNodes } from './browser/getAllDomNodes.js'

// via https://stackoverflow.com/a/67030384
export async function getEventListeners (page) {
  const objectGroup = uuidV4()
  const cdpSession = await page.target().createCDPSession()
  try {
    const { result: { objectId } } = await cdpSession.send('Runtime.evaluate', {
      expression: `
        (function () {
          ${getAllDomNodes}
          return [...getAllDomNodes(), window, document]
        })()
      `,
      objectGroup
    })
    // Using the returned remote object ID, actually get the list of descriptors
    const { result } = await cdpSession.send('Runtime.getProperties', { objectId })

    const arrayProps = Object.fromEntries(result.map(_ => ([_.name, _.value])))

    const length = arrayProps.length.value

    const nodes = []

    for (let i = 0; i < length; i++) {
      nodes.push(arrayProps[i])
    }

    const nodesWithListeners = []

    for (const node of nodes) {
      const { objectId } = node

      const { listeners } = await cdpSession.send('DOMDebugger.getEventListeners', { objectId })

      if (listeners.length) {
        nodesWithListeners.push({
          node: pick(node, ['className', 'description']),
          listeners: listeners.map(listener => {
            return {
              // originalHandler seems to contain the same information as handler
              // as for objectId, these are useless since we will just release the object group anyway
              ...omit(listener, ['backendNodeId', 'originalHandler']),
              handler: omit(listener.handler, ['objectId'])
            }
          })
        })
      }
    }

    await cdpSession.send('Runtime.releaseObjectGroup', { objectGroup })
    return nodesWithListeners
  } finally {
    await cdpSession.detach()
  }
}
