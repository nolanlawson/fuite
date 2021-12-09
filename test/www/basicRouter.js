/* global Navigo */
export const makeRouter = (routes) => {
  const router = new Navigo(window.location.pathname)

  const div = document.createElement('div')
  div.innerHTML = `
    ${
      routes.map(route => (
        `<a href="${route}" data-navigo>${route || 'home'}</a>`
      )).join('\n')
    }
    ${
      routes.map(route => (
        `<div id="${route || 'home'}" style="display:none">${route || 'home'}!</div>`
      )).join('\n')
    }
  `
  document.body.appendChild(div)

  const show = currentRoute => {
    for (const route of routes) {
      document.getElementById(route || 'home').style.display = route === currentRoute ? '' : 'none'
    }
  }

  for (const route of routes) {
    router.on(`/${route}`, () => {
      show(route)
    })
  }

  router.resolve()

  return router
}
