// get all dom nodes, even those inside open shadow roots. kind of like `querySelectorAll('*')`
export function getAllDomNodes () {
  const result = []
  const stack = [...document.querySelectorAll('*')]

  let current
  while ((current = stack.shift())) {
    if (current.shadowRoot) {
      stack.unshift(...current.shadowRoot.querySelectorAll('*'))
    }
    result.push(current)
  }

  return result
}
