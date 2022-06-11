export async function setup (page) {
  // Setup code to run before each test
}

export async function createTests (page) {
  // Code to run once on the page to determine which tests to run
  console.log('in createTests')

  return Promise.resolve([
    {
      description: 'a test',
      data: {
        foo: 1
      }
    }
  ])
}

export async function iteration (page, data) {
  // Run a single iteration against a page – e.g., click a link and then go back
  await page.waitForXPath('text=Data.ipynb')

  await page.click('li.jp-DirListing-item[title^="Name: Data.ipynb"]')

  await page.waitForXPath('[role="main"] >> text=Data.ipynb')

  await page.waitForTimeout(200)
}
