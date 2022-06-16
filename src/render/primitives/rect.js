import { regl } from '../regl.js'

import screenFragment from '../shaders/screen.frag'
import screenVertex from '../shaders/screen.vert'

export const rectVertices = [
  [-0.5, -0.5], [+0.5, -0.5], [+0.5, +0.5], [-0.5, +0.5] // top face
]

export const rectElements = [
  [2, 1, 0], [2, 0, 3] // top face.
]

export const drawRect = regl({
  frag: screenFragment,
  vert: screenVertex,
  attributes: {
    position: rectVertices
  },
  uniforms: {
    color: [1, 0.5, 0.5]
  },
  elements: rectElements
})
