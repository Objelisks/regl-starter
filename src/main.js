/* global requestAnimationFrame */

import { quat } from 'gl-matrix'
import { init as initLoaders } from './render/loaders.js'
import { renderFrame } from './render/render.js'
import { drawPlane } from './render/primitives/plane.js'
import { camera } from './render/camera.js'
import { loadModel, transform } from './render/model.js'
import { drawCube } from './render/primitives/cube.js'
import { drawSphere } from './render/primitives/sphere.js'
import { flatShader } from './render/shaders.js'
import { createModelDrawer } from './render/primitives/model.js'

// initLoaders()
// loadModel('content/mouse1.gltf').then(model => console.log(model))
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
      drawPlane()
      flatShader({ color: [1, 0.5, 0.5] }, () => {
        transform({
          position: [Math.cos(tick), 0, Math.sin(tick)],
          rotation: quat.setAxisAngle([], [1, 0, 0], tick)
        }, (context) => {
          drawCube()
        })
        transform({
          position: [Math.cos(-tick), 0, Math.sin(-tick)],
          rotation: quat.setAxisAngle([], [0, 1, 0], tick),
          scale: [0.5, 0.5, 0.5]
        }, (context) => {
          drawMouse()
        })
      })
    })
  requestAnimationFrame(() => renderFrame(draw))
}

requestAnimationFrame(() => renderFrame(draw))

console.log('hello world')
