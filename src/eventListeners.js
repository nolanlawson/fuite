import { v4 as uuidV4 } from 'uuid'

// via https://stackoverflow.com/a/67030384
export async function getEventListeners (page) {
  const objectGroup = uuidV4()
  const cdpSession = await page.target().createCDPSession()
  try {
    const { result: { objectId } } = await cdpSession.send('Runtime.evaluate', {
      expression: '[...document.querySelectorAll("*"), window, document]',
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
          node,
          listeners
        })
      }
    }

    await cdpSession.send('Runtime.releaseObjectGroup', { objectGroup })
    return nodesWithListeners
  } finally {
    await cdpSession.detach()
  }
}
