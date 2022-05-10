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
import { World, Body, Plane, Sphere, Vec3 } from 'cannon-es'

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
    scale: [5, 5, 5],
    draw: drawPlane,
    body: new Body({type: Body.STATIC, shape: new Plane()})
  },
  {
    id: id(),
    position: [0, 0, 0],
    rotation: [0, 0, 0, 1],
    // position: t => [Math.cos(t), 0, Math.sin(t)],
    // rotation: t => quat.setAxisAngle([], [1, 0, 0], t),
    draw: drawCube,
    body: new Body({mass: 1, shape: new Sphere(0.5)})
  },
  {
    id: id(),
    position: t => [Math.cos(-t), -1, Math.sin(-t)],
    rotation: t => quat.setAxisAngle([], [0, 1, 0], t*3.0),
    scale: [0.1, 0.1, 0.1],
    draw: drawMouse
  }
]

things[1].body.position.set(0, 4, 0)
things[0].body.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up


const world = new World({ gravity: new Vec3(0, -9.8, 0)})
things.forEach(thing => thing.body ? world.addBody(thing.body) : null)

const delta = 0.016

const draw = () => {
  tick += delta

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

  things.forEach(thing => {
    if(thing.body) {
      vec3.copy(thing.position, thing.body.position.toArray())
      quat.copy(thing.rotation, thing.body.quaternion.toArray())
    }
  })
  world.fixedStep()
  mousePostUpdate()
  requestAnimationFrame(() => renderFrame(draw))
}

requestAnimationFrame(() => renderFrame(draw))

console.log('hello world')
