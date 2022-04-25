/* global requestAnimationFrame */

import { quat } from 'gl-matrix'
import { renderFrame } from './render/render.js'
import { drawPlane } from './render/primitives/plane.js'
import { camera } from './render/camera.js'
import { transform } from './render/transform.js'
import { drawCube } from './render/primitives/cube.js'
import { flatShader } from './render/shaders.js'
import { createModelDrawer } from './render/primitives/model.js'
import { id } from './engine/util.js'

const drawMouse = createModelDrawer('content/mouse1.gltf')

let tick = 0

const evalProp = (x, t) => x instanceof Function ? x(t) : x

const evaluate = (thing, t) => ({
  position: evalProp(thing.position, t),
  rotation: evalProp(thing.rotation, t),
  scale: evalProp(thing.scale, t)
})

const things = [
  {
    position: [0,0,0],
    rotation: [0,0,0,1],
    draw: drawPlane
  },
  {
    position: t => [Math.cos(t), 0, Math.sin(t)],
    rotation: t => quat.setAxisAngle([], [1, 0, 0], t),
    draw: drawCube
  },
  {
    position: t => [Math.cos(-t), -1, Math.sin(-t)],
    rotation: t => quat.setAxisAngle([], [0, 1, 0], t*3.0),
    scale: [0.1, 0.1, 0.1],
    draw: drawMouse
  }
]

console.log(id())

const draw = () => {
  tick += 0.016



  camera({
      eye: [2, 2, 2],
      target: [0, 0, 0]
    },
    (context) => {
      flatShader({ color: [1, 0.5, 0.5] }, () => {
        things.forEach((thing) => transform(evaluate(thing, tick), thing.draw))
      })
    })
  requestAnimationFrame(() => renderFrame(draw))
}

requestAnimationFrame(() => renderFrame(draw))

console.log('hello world')
