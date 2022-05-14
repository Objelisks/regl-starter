/* global requestAnimationFrame */

import { quat, vec3 } from 'gl-matrix'
import { World, Body, Plane, Box, Vec3, Ray, RAY_MODES } from 'cannon-es'
import { renderFrame } from './render/render.js'
import { drawPlane } from './render/primitives/plane.js'
import { camera } from './render/camera.js'
import { transform } from './render/transform.js'
import { drawCube } from './render/primitives/cube.js'
import { flatShader, pbrShader } from './render/shaders/shaders.js'
import { loadModel, createModelDrawer } from './render/primitives/model.js'
import { id } from './engine/util.js'
import { getMouseRay, mouseState, mousePostUpdate } from './input/mouse.js'
import { drawGltf } from './render/primitives/gltf2.js'

const drawMouse = createModelDrawer('content/mouse/mouse1.gltf')
const chunk = loadModel('content/chunk/chunk.gltf')
const amanita = loadModel('content/amanita/amanita.gltf')

const evalProp = (x, t) => x instanceof Function ? x(t) : x

const evaluate = (thing, t) => ({
  position: evalProp(thing.position, t),
  rotation: evalProp(thing.rotation, t),
  scale: evalProp(thing.scale, t)
})

const things = [
  // {
  //   id: id(),
  //   position: [0,0,0],
  //   rotation: [0,0,0,1],
  //   scale: [5, 5, 5],
  //   draw: () => flatShader({ color: [1, 0.5, 0.5] }, drawPlane),
  //   body: new Body({type: Body.STATIC, shape: new Plane()})
  // },
  // {
  //   id: id(),
  //   position: [0, 0, 0],
  //   rotation: [0, 0, 0, 1],
  //   draw: () => flatShader({ color: [1, 0.5, 0.5] }, drawCube),
  //   body: new Body({mass: 1, shape: new Box(new Vec3(0.5, 0.5, 0.5))})
  // },
  {
    id: id(),
    position: t => [Math.cos(t)*2.0, 0.0, Math.sin(t)*2.0],
    rotation: t => quat.setAxisAngle([], [0, 1, 0], t*3.0),
    scale: [0.1, 0.1, 0.1],
    draw: () => flatShader({ color: [1, 0.5, 0.5] }, drawMouse)
  },
  {
    id: id(),
    position: [0.5, -0.5, 0.5],
    scale: [0.75, 0.75, 0.75],
    draw: () => drawGltf(chunk())
  },
  {
    id: id(),
    position: [1.5, -0.0, 0.5],
    rotation: t => quat.setAxisAngle([], vec3.normalize([], [0, 0, 1]), t*3.0),
    scale: [0.15, 0.35, 0.15],
    draw: () => drawGltf(amanita())
  },
  {
    id: id(),
    position: [0.5, -0.0, 1.5],
    rotation: t => quat.setAxisAngle([], vec3.normalize([], [1, 0, 0]), t*3.0),
    scale: [0.35, 0.25, 0.35],
    draw: () => drawGltf(amanita())
  },
  {
    id: id(),
    position: [1.5, -0.0, 1.5],
    rotation: t => quat.setAxisAngle([], vec3.normalize([], [0, 1, 0]), t*4.0),
    scale: [0.25, 0.25, 0.25],
    draw: () => drawGltf(amanita())
  }
]

// things[1].body.position.set(0, 4, 0)
// things[0].body.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up


const raycaster = new Ray()
const world = new World({ gravity: new Vec3(0, -9.8, 0)})
things.forEach(thing => thing.body ? world.addBody(thing.body) : null)

const draw = () => {
  camera({
    eye: [3, 1, 3],
    target: [0, 0, 0]
  },
  (context) => {
    const mouseDir = getMouseRay(mouseState, context)
    const origin = new Vec3(...context.eye)
    const to = origin.clone().addScaledVector(20, new Vec3(...mouseDir))
    
    if(raycaster.intersectWorld(world, {from: origin, to: to, mode: RAY_MODES.CLOSEST})) {
      const color = mouseState.buttons & 1 ? [0.5, 1, 0.5] : [1, 0.5, 0.5]
      flatShader({ color: color }, () => {
        transform({
          position: raycaster.result?.hitPointWorld?.toArray(),
          scale: [0.1, 0.1, 0.1]
        }, () => drawCube())
      })
    }

    things.forEach((thing) => transform(evaluate(thing, 0), (context) => {
      thing.draw()
    }))
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
