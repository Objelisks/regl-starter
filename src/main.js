/* global requestAnimationFrame */

import { quat } from 'gl-matrix'
import { renderFrame } from './render/render.js'
import { drawPlane } from './render/primitives/plane.js'
import { camera } from './render/camera.js'
import { transform } from './render/transform.js'
import { drawCube } from './render/primitives/cube.js'
import { flatShader } from './render/shaders.js'
import { createModelDrawer } from './render/primitives/model.js'

const drawMouse = createModelDrawer('content/mouse1.gltf')

let tick = 0

const draw = () => {
  tick += 0.016
  camera(
    {
      eye: [2, 2, 2],
      target: [0, 0, 0]
    },
    (context) => {
      flatShader({ color: [1, 0.5, 0.5] }, () => {
        drawPlane()
        transform({
          position: [Math.cos(tick), 0, Math.sin(tick)],
          rotation: quat.setAxisAngle([], [1, 0, 0], tick)
        }, (context) => {
          drawCube()
        })
        transform({
          position: [Math.cos(-tick), -1, Math.sin(-tick)],
          rotation: quat.setAxisAngle([], [0, 1, 0], tick*3.0),
          scale: [0.1, 0.1, 0.1]
        }, (context) => {
          drawMouse()
        })
      })
    })
  requestAnimationFrame(() => renderFrame(draw))
}

draw()

console.log('hello world')
