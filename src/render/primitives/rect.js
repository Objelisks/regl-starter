import { regl } from '../regl.js'

import rectFragment from '../shaders/rect.frag'
import rectVertex from '../shaders/rect.vert'

export const rectVertices = [
  [-0.5, -0.5], [+0.5, -0.5], [+0.5, +0.5], [-0.5, +0.5] // top face
]

export const rectElements = [
  [2, 1, 0], [2, 0, 3] // top face.
]

export const drawRect = regl({
  frag: rectFragment,
  vert: rectVertex,
  attributes: {
    position: rectVertices
  },
  uniforms: {
    color: (context, props) => props.color || [1.0, 0.5, 0.5],
    size: (context, props) => [props.width, props.height],
    roundedness: (context, props) => Array.isArray(props.roundedness) ? props.roundedness : [props.roundedness, props.roundedness, props.roundedness, props.roundedness],
    resolution: (context) => [context.viewportWidth, context.viewportHeight]
  },
  elements: rectElements,
  blend: {
    enable: true,
    func: {
      srcRGB: 'src alpha',
      srcAlpha: 1,
      dstRGB: 'one minus src alpha',
      dstAlpha: 1
    },
  }
})
