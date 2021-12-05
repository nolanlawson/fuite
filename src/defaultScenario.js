const getAnchor = async (page, href) => {
  const anchors = await page.$$('a[href]')
  for (const anchor of anchors) {
    const isTargetAnchor = await anchor.evaluate(
      (el, targetHref) => new URL(el.getAttribute('href'), window.location.href).href === targetHref,
      href
    )
    if (isTargetAnchor) {
      return anchor
    }
  }
}

export async function createTests (page) {
  const location = await page.evaluate('window.location.href')
  const baseUrl = new URL(location)
  const links = await page.$$eval('a[href]', elements => elements.map(el => el.getAttribute('href')))

  const uniqueLinks = [...new Set(links.map(_ => new URL(_, location)).filter(url => {
    // origin may be the same for blob: URLs, but the protocol is different
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/origin
    return url.origin === baseUrl.origin && url.protocol === baseUrl.protocol &&
      url.href !== baseUrl.href // ignore links to this very page
  }).map(url => url.href))]

  return uniqueLinks.map(href => {
    const url = new URL(href)
    return {
      data: { href: url.href },
      description: `Go to ${url.pathname + url.search + url.hash} and go back`
    }
  })
}

export async function iteration (page, { href }) {
  const anchor = await getAnchor(page, href)
  await anchor.click()
  await page.waitForNetworkIdle()
  await page.goBack()
  await page.waitForNetworkIdle()
}
