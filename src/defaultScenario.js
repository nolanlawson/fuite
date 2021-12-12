import { waitForPageIdle } from './puppeteerUtil.js'

function urlsAreEqual (url1, url2) {
  for (const prop of ['protocol', 'hostname', 'port', 'pathname', 'search', 'hash']) {
    let value1 = url1[prop]
    let value2 = url2[prop]
    if (prop === 'pathname') {
      // ignore trailing slashes, most of the time these are effectively the same URL
      value1 = value1.replace(/\/+$/g, '')
      value2 = value2.replace(/\/+$/g, '')
    }
    if (value1 !== value2) {
      return false
    }
  }
  return true
}

async function clickFirstVisible (page, selector) {
  const element = await page.evaluateHandle((selector) => {
    return [...document.querySelectorAll(selector)].filter(el => {
      // avoid links that open in a new tab
      return el.target === '' &&
        // quick and dirty visibility check
        window.getComputedStyle(el).getPropertyValue('display') !== 'none' &&
        el.offsetHeight > 0 &&
        el.offsetWidth > 0
    })[0]
  }, selector)
  try {
    await element.click()
  } finally {
    await element.dispose()
  }
}

export async function createTests (page) {
  const location = await page.evaluate('window.location.href')
  const baseUrl = new URL(location)
  const hrefs = await page.$$eval('a[href]', elements => {
    return elements
      .filter(el => {
        // avoid links that open in a new tab
        return el.target === '' &&
          // quick and dirty visibility check
          window.getComputedStyle(el).getPropertyValue('display') !== 'none' &&
          el.offsetHeight > 0 &&
          el.offsetWidth > 0
      })
      .map(el => el.getAttribute('href'))
  })

  // Find unique links, dedup based on full url
  const fullLinksToLinks = new Map()
  for (const href of hrefs) {
    const url = new URL(href, location)
    // origin may be the same for blob: URLs, but the protocol is different
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/origin
    const isInternalLink = url.origin === baseUrl.origin &&
      url.protocol === baseUrl.protocol &&
      !urlsAreEqual(url, baseUrl) // ignore links to this very page
    if (isInternalLink && !fullLinksToLinks.has(url.href)) {
      fullLinksToLinks.set(url.href, href)
    }
  }

  return [...fullLinksToLinks.entries()].map(([fullHref, originalHref]) => {
    const url = new URL(fullHref)
    return {
      data: {
        href: originalHref,
        fullHref: fullHref
      },
      description: `Go to ${url.pathname + url.search + url.hash} and back`
    }
  })
}

export async function iteration (page, { href }) {
  await clickFirstVisible(page, `a[href=${JSON.stringify(href)}]`)
  await waitForPageIdle(page)
  await page.goBack()
  await waitForPageIdle(page)
}
