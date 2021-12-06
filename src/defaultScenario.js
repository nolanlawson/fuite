import { waitForPageIdle } from './puppeteerUtil.js'

export async function createTests (page) {
  const location = await page.evaluate('window.location.href')
  const baseUrl = new URL(location)
  const hrefs = await page.$$eval('a[href]', elements => elements.map(el => el.getAttribute('href')))

  // Find unique links, dedup based on full url
  const fullLinksToLinks = new Map()
  for (const href of hrefs) {
    const url = new URL(href, location)
    // origin may be the same for blob: URLs, but the protocol is different
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/origin
    const isInternalLink = url.origin === baseUrl.origin &&
      url.protocol === baseUrl.protocol &&
      url.href !== baseUrl.href // ignore links to this very page
    if (isInternalLink && !fullLinksToLinks.has(url.href)) {
      fullLinksToLinks.set(url.href, href)
    }
  }

  return [...fullLinksToLinks.entries()].map(([fullHref, originalHref]) => {
    const url = new URL(fullHref)
    return {
      data: { href: originalHref },
      description: `Go to ${url.pathname + url.search + url.hash} and back`
    }
  })
}

export async function iteration (page, { href }) {
  await page.click(`a[href=${JSON.stringify(href)}]`)
  await waitForPageIdle(page)
  await page.goBack()
  await waitForPageIdle(page)
}
