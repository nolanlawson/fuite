import { getAllDomNodes } from './browser/getAllDomNodes.js'

export async function countDomNodes (page) {
  return (await page.evaluate(`
    (function () {
      ${getAllDomNodes}
      return getAllDomNodes().length
    })()
  `))
}
