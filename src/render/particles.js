import { regl } from './regl.js'
import { fetchModel } from './primitives/model.js'
import particlesFragment from './shaders/part.frag'
import particlesVertex from './shaders/part.vert'

let loaded = false
let particlesDrawer = null

const N = 500

fetchModel('content/primitives/sphere.glb').then(scene => {
  loaded = true
  const data = scene.nodes[0].mesh.primitives[0]
  particlesDrawer = regl({
    frag: particlesFragment,
    vert: particlesVertex,
    attributes: {
      position: data.attributes.POSITION.value,
      normal: data.attributes.NORMAL.value,
      uv: data.attributes.TEXCOORD_0.value,
      offset: {
        buffer: regl.buffer(
          Array(N * N).fill().map((_, i) => {
            var x = -(Math.floor(i / N) / N) * 1000
            var z = -((i % N) / N) * 1000
            return [x, 0.0, z]
          })),
        divisor: 1
      },
    },
    uniforms: {
      color: [1, 0.5, 0.5],
      camPos: (context) => context.eye,
      time: regl.context('time')
    },
    elements: data.indices.value,
    instances: N*N
  })
})

export const drawParticles = (instances) => loaded ? particlesDrawer(instances) : null
