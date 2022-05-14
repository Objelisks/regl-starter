import { regl } from '../regl.js'

import flatFragment from './flat.frag'
import flatVertex from './flat.vert'

export const flatShader = regl({
  frag: flatFragment,
  vert: flatVertex,
  uniforms: {
    color: regl.prop('color'),
    camPos: regl.context('eye')
  }
})


import pbrFragment from './pbr.frag'
import pbrVertex from './pbr.vert'

export const pbrShader = regl({
  frag: pbrFragment,
  vert: pbrVertex,
  uniforms: {
    baseColorTexture: regl.context('baseColorTexture'),
    metallicRoughnessTexture: regl.context('metallicRoughnessTexture'),
    normalTexture: regl.context('normalTexture'),
    camPos: regl.context('eye'),
    time: regl.context('time')
  }
})
