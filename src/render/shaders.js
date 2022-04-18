import { regl } from './regl.js'

import flatFragment from './shaders/flat.frag'
import flatVertex from './shaders/flat.vert'

export const flatShader = regl({
  frag: flatFragment,
  vert: flatVertex,
  uniforms: {
    color: regl.prop('color'),
    camPos: regl.context('eye')
  }
})