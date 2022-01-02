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
    if (!descriptionToCountsBefore.has(description)) {
      // ignore any dom nodes that didn't exist before, because recycled DOM nodes may change their id/classes,
      // leading to dom nodes like div#NTk4NzE4 being "leaked" 0.1428 times
      return
    }
    const countBefore = descriptionToCountsBefore.get(description)
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
