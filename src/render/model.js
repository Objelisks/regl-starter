/* globals fetch */
import { regl } from './regl.js'
import { mat4, quat } from 'gl-matrix'
import { parse } from '@loaders.gl/core'
import { GLTFLoader } from '@loaders.gl/gltf'

export const loadModel = (name) => {
  console.log(`loading ${name}`)
  return fetch(name)
    .then(data => parse(data, GLTFLoader))
    .then(gltfData => gltfData.scene)
}

export const transform = regl({
  context: {
    model: (context, props) => mat4.fromRotationTranslationScale([],
      props.rotation || quat.create(),
      props.position || [0, 0, 0],
      props.scale || [1, 1, 1])
  },
  uniforms: {
    model: (context) => context.model,
    invModel: (context) => mat4.invert([], context.model)
  }
})
