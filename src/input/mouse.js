import { mat4, vec4, vec3 } from 'gl-matrix'

const canvas = document.getElementById('render')

export const mouseState = {
  x: 0,
  y: 0,
  buttons: 0,
  justPressed: false
}
const updateState = (e) => {
  mouseState.x = e.x
  mouseState.y = e.y
  mouseState.buttons = e.buttons
}
canvas.addEventListener('mousedown', (e) => {
  updateState(e)
  mouseState.justPressed = true
  e.preventDefault()
})
canvas.addEventListener('mouseup', updateState)
canvas.addEventListener('mousemove', updateState)
canvas.addEventListener('contextmenu', (e) => e.preventDefault())

export const getMouseScreen = (mouseState) => {
  const rect = canvas.getBoundingClientRect()
  const clipCoordinates = [
      (2 * (mouseState.x - rect.x)) / rect.width - 1,
      1 - (2 * (mouseState.y - rect.y)) / rect.height,
      -1,
      1]
  return clipCoordinates
}

export const getMouseRay = (mouseState, context) => {
  const clipCoordinates = getMouseScreen(mouseState)
  const inverseView = mat4.invert([], context.view)
  const inverseProjection = mat4.invert([], context.projection)
  const cameraRayA = vec4.transformMat4([], clipCoordinates, inverseProjection)
  const cameraRay = [cameraRayA[0], cameraRayA[1], -1, 0]
  const rayWorldA = vec4.transformMat4([], cameraRay, inverseView)
  const rayWorld = vec3.normalize([], [rayWorldA[0], rayWorldA[1], rayWorldA[2]])
  return rayWorld
}

export const mousePostUpdate = () => {
  mouseState.justPressed = false
}
