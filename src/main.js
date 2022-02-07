/* global requestAnimationFrame */

import { renderFrame } from './render/render.js'
import { drawPlane } from './render/primitives/plane.js'
import { camera } from './render/camera.js'

console.log('hello world')

const draw = () => {
  camera(
    {
      eye: [2, 2, 2],
      target: [0, 0, 0]
    },
    (context) => {
      drawPlane()
    })
}

requestAnimationFrame(() => renderFrame(draw))
