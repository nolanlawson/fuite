function createDescriptionToCounts (nodes) {
  const map = new Map()
  for (const { description } of nodes) {
    const count = map.get(description) || 0
    map.set(description, count + 1)
  }
  return map
}

export function analyzeDomNodes (nodesBefore, nodesAfter, numIterations) {
  const result = []

  const descriptionToCountsBefore = createDescriptionToCounts(nodesBefore)
  const descriptionToCountsAfter = createDescriptionToCounts(nodesAfter)

  descriptionToCountsAfter.forEach((countAfter, description) => {
    const countBefore = descriptionToCountsBefore.get(description) || 0
    const delta = countAfter - countBefore
    if (delta > 0) {
      result.push({
        description,
        before: countBefore,
        after: countAfter,
        delta,
        deltaPerIteration: delta / numIterations
      })
    }
  })
  return result
}
