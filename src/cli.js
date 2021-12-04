import puppeteer from 'puppeteer'
import esMain from 'es-main'
import * as HeapSnapshotWorker from './thirdparty/devtools/heap_snapshot_worker/heap_snapshot_worker.js'
const ITERATIONS = 7

async function getInternalLinks(pageUrl) {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(pageUrl);
    await page.waitForNetworkIdle()

    const location = await page.evaluate('window.location.href')
    const baseUrl = new URL(location)
    const links = await page.$$eval('a[href]', elements => elements.map(el => el.getAttribute('href')))

    return links.map(_ => new URL(_, location)).filter(url => {
      // origin may be the same for blob: URLs, but the protocol is different
      // https://developer.mozilla.org/en-US/docs/Web/API/URL/origin
      return url.origin === baseUrl.origin && url.protocol === baseUrl.protocol &&
        url.href !== baseUrl.href // ignore links to this very page
    })
  } finally {
    await browser.close();
  }
}

async function takeThrowawaySnapshot(page) {
  const cdpSession = await page.target().createCDPSession();
  await cdpSession.send('HeapProfiler.collectGarbage');
  await cdpSession.send('HeapProfiler.takeHeapSnapshot', {
    reportProgress: false,
  });
  await cdpSession.detach();
}

async function takeHeapSnapshot(page) {
  const cdpSession = await page.target().createCDPSession();

  await cdpSession.send('HeapProfiler.enable')
  await cdpSession.send('HeapProfiler.collectGarbage')
  let loader
  const loaderPromise = new Promise(resolve => {
    loader = new HeapSnapshotWorker.HeapSnapshotLoader.HeapSnapshotLoader({
      sendEvent(type, message) {
        if (message === 'Loading strings…') {
          resolve()
        }
      }
    })
  })

  cdpSession.on('HeapProfiler.addHeapSnapshotChunk', ({ chunk }) => {
    loader.write(chunk)
  });
  await cdpSession.send('HeapProfiler.takeHeapSnapshot', {
    reportProgress: false,
  });
  await cdpSession.detach();
  loader.close()
  await loaderPromise
  const snapshot = await loader.buildSnapshot()
  return snapshot
}

async function main() {
  const pageUrl = 'http://localhost:3000/test/www/basic/'
  const internalLinks = await getInternalLinks(pageUrl)

  const leakingLinks = await Promise.all(internalLinks.map(async url => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto(pageUrl)
    await page.waitForNetworkIdle()

    console.log('url', url.href)
    const getAnchor = async () => {
      const anchors = await page.$$('a[href]')
      for (const anchor of anchors) {
        const isTargetAnchor = await anchor.evaluate(
          (el, targetHref) => new URL(el.getAttribute('href'), window.location.href).href === targetHref,
          url.href
        )
        if (isTargetAnchor) {
          return anchor
        }
      }
    }

    const startSnapshot = await takeHeapSnapshot(page)
    const startSize = startSnapshot.statistics.total
    for (let i = 0; i < ITERATIONS; i++) {
      const anchor = await getAnchor()
      await anchor.click()
      await page.waitForNetworkIdle()
      await page.goBack()
      await page.waitForNetworkIdle()
    }
    const endSnapshot = await takeHeapSnapshot(page)
    const endSize = endSnapshot.statistics.total

    console.log(url.href, endSize - startSize)

    await browser.close();
  }))
}

if (esMain(import.meta)) {
  main().catch(err => {
    console.error(err)
    process.exit(1)
  })
}

export default main