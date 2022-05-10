/* global requestAnimationFrame */

import { quat, vec3 } from 'gl-matrix'
import createRay from 'ray-aabb'
import { renderFrame } from './render/render.js'
import { drawPlane } from './render/primitives/plane.js'
import { camera } from './render/camera.js'
import { transform } from './render/transform.js'
import { drawCube } from './render/primitives/cube.js'
import { flatShader } from './render/shaders.js'
import { createModelDrawer } from './render/primitives/model.js'
import { id } from './engine/util.js'
import { getMouseRay, mouseState, mousePostUpdate } from './input/mouse.js'

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
    id: id(),
    position: [0,0,0],
    rotation: [0,0,0,1],
    draw: drawPlane
  },
  {
    id: id(),
    position: t => [Math.cos(t), 0, Math.sin(t)],
    rotation: t => quat.setAxisAngle([], [1, 0, 0], t),
    draw: drawCube
  },
  {
    id: id(),
    position: t => [Math.cos(-t), -1, Math.sin(-t)],
    rotation: t => quat.setAxisAngle([], [0, 1, 0], t*3.0),
    scale: [0.1, 0.1, 0.1],
    draw: drawMouse
  }
]

const draw = () => {
  tick += 0.016

  camera({
    eye: [2, 2, 2],
    target: [0, 0, 0]
  },
  (context) => {
    const mouseDir = getMouseRay(mouseState, context)
    const mouseRay = createRay(context.eye, mouseDir)
    const normal = [0, 0, 0]
    const collisionDist = mouseRay.intersects([[-20, -1, -20], [20, 0, 20]], normal)

    if(collisionDist !== false) {
      const color = mouseState.buttons & 1 ? [0.5, 1, 0.5] : [1, 0.5, 0.5]
      const collision = vec3.create([])
      vec3.add(collision, vec3.scale(collision, mouseDir, collisionDist), context.eye)
      flatShader({ color: color }, () => {
        transform({
          position: collision,
          scale: [0.1, 0.1, 0.1]
        }, () => drawCube())
      })
    }

    flatShader({ color: [1, 0.5, 0.5] }, () => {

      things.forEach((thing) => transform(evaluate(thing, tick), (context) => {
        
        thing.draw()
      }))
    })
  })

  mousePostUpdate()
  requestAnimationFrame(() => renderFrame(draw))
}

requestAnimationFrame(() => renderFrame(draw))

console.log('hello world')
