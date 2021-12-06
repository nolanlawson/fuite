async function waitForMainThreadIdle (page) {
  await page.evaluate(() => {
    let promise = Promise.resolve()
    // consider 3 rICs to be "idle"
    for (let i = 0; i < 3; i++) {
      promise = promise.then(() => new Promise(resolve => window.requestIdleCallback(resolve)))
    }
    return promise
  })
}

export async function waitForPageIdle (page) {
  await waitForMainThreadIdle(page)
  await page.waitForNetworkIdle()
  await waitForMainThreadIdle(page)
}
