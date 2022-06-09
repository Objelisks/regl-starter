import { regl } from './regl.js'
import { fetchModel } from './primitives/model.js'
import particlesFragment from './shaders/part.frag'
import particlesVertex from './shaders/part.vert'
import { vertexIds } from './gpgpu.js'

let loaded = false
let particlesDrawer = null

fetchModel('content/primitives/sphere.glb').then(scene => {
  loaded = true
  const data = scene.nodes[0].mesh.primitives[0]
  particlesDrawer = regl({
    frag: particlesFragment,
    vert: particlesVertex,
    attributes: {
      position: data.attributes.POSITION.value,
      id: {
        buffer: vertexIds(64),
        divisor: 1
      }
    },
    uniforms: {
      data: regl.prop('data'),
      color: [1, 0.5, 0.5],
      camPos: regl.context('eye'),
      time: regl.context('time'),
    },
    elements: data.indices.value,
    instances: regl.prop('count')
  })
})

export const drawParticles = (props) => loaded ? particlesDrawer(props) : null

export const createParticlesBuffer = (size) => {
  const data = new Float32Array(new Array(size*size).fill(0).flatMap(x => [100,100,100,Math.random()]))
  const testBuffers = [
    regl.framebuffer({
      color: regl.texture({
        radius: size,
        data: data,
        type: 'float'
      }),
      depthStencil: false
    }),
    regl.framebuffer({
      color: regl.texture({
        radius: size,
        data: data,
        type: 'float'
      }),
      depthStencil: false
    })
  ]
  return testBuffers
}