async function waitForMainThreadIdle(page) {
  const MAX_RETRIES = 5;
  const DELAY = 100;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await page.evaluate(() => {
        return new Promise((resolve) => window.requestIdleCallback(resolve));
      });
      return;
    } catch (err) {
      // we should typically ignore any errors here, which may occur due to page navigation
      if (i === MAX_RETRIES - 1) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, DELAY));
    }
  }
}

export async function waitForPageIdle(page) {
  await waitForMainThreadIdle(page);
  // waitForNetworkIdle does not exist on Playwright
  if (page.waitForNetworkIdle) {
    try {
      await page.waitForNetworkIdle();
    } catch (err) {
      if (err.name !== "TimeoutError") {
        // ignore timeouts, just proceed
        throw err;
      }
    }
  }
  await waitForMainThreadIdle(page);
}
