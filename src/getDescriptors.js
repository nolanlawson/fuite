// Given an array of objects, get their descriptors
export async function getDescriptors (cdpSession, objectId) {
  // via https://stackoverflow.com/a/67030384
  const { result } = await cdpSession.send('Runtime.getProperties', { objectId })

  const arrayProps = Object.fromEntries(result.map(_ => ([_.name, _.value])))
  const length = arrayProps.length.value
  const descriptors = []

  for (let i = 0; i < length; i++) {
    descriptors.push(arrayProps[i])
  }
  return descriptors
}
