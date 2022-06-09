/* global requestAnimationFrame */

import { quat, vec3 } from 'gl-matrix'
import { World, Body, Plane, Box, Vec3, Ray, RAY_MODES, Quaternion, Sphere, RaycastResult, PointToPointConstraint } from 'cannon-es'
import { renderFrame } from './render/render.js'
import { drawPlane } from './render/primitives/plane.js'
import { camera } from './render/camera.js'
import { transform } from './render/transform.js'
import { drawCube } from './render/primitives/cube.js'
import { flatShader } from './render/shaders/shaders.js'
import { loadModel } from './render/primitives/model.js'
import { id, random } from './engine/util.js'
import { getMouseRay, mouseState, mousePostUpdate } from './input/mouse.js'
import { drawGltf } from './render/primitives/gltf.js'
import { createTextRenderer } from './render/primitives/text.js'
import { createParticlesBuffer, drawParticles } from './render/particles.js'
import { createGpgpuRenderer } from './render/gpgpu.js'
import { regl } from './render/regl.js'
import weirdFrag from './render/shaders/weird.frag'

const drawTorchText = createTextRenderer('torch')
const drawCubeText = createTextRenderer('cube')
const drawShroomyText = createTextRenderer('shroomy')

const mouse = loadModel('content/mouse/mouse1.gltf')
const chunk = loadModel('content/chunk/chunk.gltf')
const amanita = loadModel('content/amanita/amanita.gltf')
const torch = loadModel('content/torch/torch.gltf')

const evalProp = (x, t) => x instanceof Function ? x(t) : x

const evaluate = (thing, t) => ({
  position: evalProp(thing.position, t),
  rotation: evalProp(thing.rotation, t),
  scale: evalProp(thing.scale, t)
})

const particleSize = 64
const updateParticles = createGpgpuRenderer(weirdFrag)

const testBuffers = createParticlesBuffer(particleSize)
let bufferFlip = 0
const setFBO = regl({
  framebuffer: regl.prop('framebuffer')
})

const things = [
  {
    id: id(),
    position: [0, 0, 0],
    rotation: [0, 0, 0, 1],
    scale: [50, 50, 50],
    draw: (thing, context) => {
      transform(evaluate(thing, context.time), () => {
        flatShader({ color: [1, 0.5, 0.5] }, drawPlane)
      })
    },
    body: new Body({type: Body.STATIC, shape: new Plane(),
      quaternion: new Quaternion().setFromAxisAngle(new Vec3(1,0,0), -Math.PI/2)})
  },
  {
    id: id(),
    position: [0, 0, 0],
    rotation: [0, 0, 0, 1],
    draw: (thing, context) => {
      const offset = evaluate(thing, context.time)
      transform(offset, () => {
        flatShader({ color: [1, 0.5, 0.5] }, drawCube)
      })
      
      transform({
        position: [offset.position[0]-0.05, offset.position[1]+0.75, offset.position[2]]
      }, () => drawCubeText({
        color: [1, 1, 1, 1]
      }))
    },
    body: new Body({mass: 5, shape: new Box(new Vec3(0.5, 0.5, 0.5)),
      position: new Vec3(0, 1, -3)})
  },
  {
    id: id(),
    position: [1.5, 0, .5],
    scale: [.1, .1, .1],
    rotation: t => quat.setAxisAngle([], [0, 1, 0], t),
    draw: (thing, context) => {
      const offset = evaluate(thing, context.time)
      transform(offset, () => {
        drawGltf(amanita.model)
      })
      transform({
        position: [offset.position[0]-0.0, offset.position[1]+0.3, offset.position[2]]
      }, () => drawShroomyText({
        color: [1, 1, 1, 1]
      }))
    }
  },
  {
    id: id(),
    position: [-2.5, 0, -.5],
    rotation: t => quat.setAxisAngle([], [0, 1, 0], -t/6),
    scale: [.6, .6, .6],
    draw: (thing, context) => {
      const offset = evaluate(thing, context.time)
      transform(offset, () => {
        drawGltf(amanita.model)
      })
      transform({
        position: [offset.position[0]-0.35, offset.position[1]+2.0, offset.position[2]]
      }, () => drawShroomyText({
        color: [1, 1, 1, 1]
      }))
    }
  },
  {
    id: id(),
    position: [7.5, 1.0, 7.5],
    rotation: [],
    scale: [0.5, 0.5, 0.5],
    draw: (thing, context) => {
      const offset = evaluate(thing, context.time)
      transform(offset, () => {
        drawGltf(torch.model)
      })
      transform({position: [0,0.8,0]}, () => {
        bufferFlip = (bufferFlip+1)%2
        transform(evaluate(thing, context.time), (context) => {
          setFBO({framebuffer: testBuffers[bufferFlip]}, () => {
            updateParticles({data: testBuffers[(bufferFlip+1)%2]})
          })
          lightPos = vec3.transformMat4([], [0,0,0], context.model)
        })
      })
      drawParticles({data: testBuffers[bufferFlip], count: particleSize*particleSize})
      transform({
        position: [offset.position[0]-0.25, offset.position[1]+0.75, offset.position[2]]
      }, () => drawTorchText({
        color: [1, 1, 1, 1]
      }))
    },
    body: new Body({mass: 0.5, shape: new Box(new Vec3(0.1, 0.5, 0.1)),
      position: new Vec3(0, 2, 0)})
  },
]

const raycaster = new Ray()
const world = new World({ gravity: new Vec3(0, -9.8, 0)})
things.forEach(thing => thing.body ? world.addBody(thing.body) : null)

let mouseConstraint = null
const mouseBody = new Body({type: Body.KINEMATIC})
world.addBody(mouseBody)
const cameraSphere = new Body({type: Body.STATIC, shape: new Sphere(3), isTrigger: true})
world.addBody(cameraSphere)

let lightPos = [0.1, 0.1, 0.1]
const lights = regl({
  uniforms: {
    lightPos: regl.prop('lightPos')
  }
})

const draw = () => {
  camera({
    eye: [3, 1, 3],
    target: [0, 0, 0]
  },
  (context) => {
    cameraSphere.position.set(...context.eye)
    const mouseDir = getMouseRay(mouseState, context)
    const origin = new Vec3(...context.eye)
    const to = origin.clone().addScaledVector(20, new Vec3(...mouseDir))
    const mouseDown = mouseState.buttons & 1
    const color = mouseDown ? [0.5, 1, 0.5] : [1, 0.5, 0.5]
    
    if(raycaster.intersectWorld(world, {from: origin, to: to, mode: RAY_MODES.CLOSEST, skipBackfaces: true})) {
      if(!mouseDown) {
        const cameraShape = cameraSphere.shapes[0]
        cameraShape.radius = raycaster.result.distance
        cameraShape.updateBoundingSphereRadius()
        mouseBody.position.set(...raycaster.result?.hitPointWorld?.toArray())
      }
      if(mouseDown && !mouseConstraint) {
        const body = raycaster.result?.body
        mouseConstraint = new PointToPointConstraint(body, body.pointToLocalFrame(raycaster.result.hitPointWorld), mouseBody, new Vec3(0, 0, 0))
        world.addConstraint(mouseConstraint)
      }
    }
    
    if(mouseDown && mouseConstraint) {
        raycaster.from = origin
        raycaster.to = to
        raycaster.skipBackfaces = false
        const result = new RaycastResult()
        raycaster.intersectBody(cameraSphere, result)
        mouseBody.position.set(...raycaster.result?.hitPointWorld?.toArray())
    }
    
    if(!mouseDown && mouseConstraint) {
      world.removeConstraint(mouseConstraint)
      mouseConstraint = null
    }

    // drawing

    lights({lightPos}, (context) => {
      flatShader({ color: color }, () => {
        transform({
          position: mouseBody.position.toArray(),
          scale: [0.1, 0.1, 0.1]
        }, () => drawCube())
      })
      things.forEach((thing) => thing.draw(thing, context))
    })

    // updates

    things.forEach(thing => {
      if(thing.update) {
        thing.update(thing, context)
      }
  
      if(thing.body) {
        vec3.copy(thing.position, thing.body.position.toArray())
        quat.copy(thing.rotation, thing.body.quaternion.toArray())
      }
    })
  })

  world.fixedStep()

  mousePostUpdate()
  requestAnimationFrame(() => renderFrame(draw))
}

requestAnimationFrame(() => renderFrame(draw))

const nameIdeas = [
  'gift - Game engIne For Tim',
  'frog - Fresh Regl On Games'
]

console.log(random(nameIdeas))
