async function waitForMainThreadIdle (page) {
  const MAX_RETRIES = 5
  const DELAY = 100
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await page.evaluate(() => {
        return new Promise(resolve => window.requestIdleCallback(resolve))
      })
      return
    } catch (err) {
      // we should typically ignore any errors here, which may occur due to page navigation
      if (i === MAX_RETRIES - 1) {
        throw err
      }
      await new Promise(resolve => setTimeout(resolve, DELAY))
    }
  }
}

export async function defaultWaitForPageIdle (page) {
  await waitForMainThreadIdle(page)
  try {
    await page.waitForNetworkIdle()
  } catch (err) {
    if (err.name !== 'TimeoutError') { // ignore timeouts, just proceed
      throw err
    }
  }
  await waitForMainThreadIdle(page)
}
