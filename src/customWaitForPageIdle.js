// Set the custom idle logic globally so it's accessible in defaultScenario.js
let customWaitForPageIdle

export function setCustomWaitForPageIdle (waitForPageIdle) {
  customWaitForPageIdle = waitForPageIdle
}

export function getCustomWaitForPageIdle () {
  return customWaitForPageIdle
}
