import { regl } from '../regl.js'
import flatFragment from '../shaders/flat.frag'
import flatVertex from '../shaders/flat.vert'

export const planeVertices = [
  [-0.5, 0, -0.5], [+0.5, 0, -0.5], [+0.5, 0, +0.5], [-0.5, 0, +0.5] // top face
]

export const planeNormals = [
  [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0] // top face
]

export const planeElements = [
  [2, 1, 0], [2, 0, 3] // top face.
]

export const drawPlane = regl({
  frag: flatFragment,
  vert: flatVertex,
  attributes: {
    position: planeVertices,
    normal: planeNormals
  },
  uniforms: {
    color: [1, 0.5, 0.5],
    camPos: (context) => context.eye
  },
  elements: planeElements
})
