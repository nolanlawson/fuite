export async function countDomNodes (page) {
  return (await page.evaluate(() => document.querySelectorAll('*').length))
}