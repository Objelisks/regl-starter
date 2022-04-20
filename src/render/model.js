/* globals fetch */
import { regl } from './regl.js'
import { mat4, quat } from 'gl-matrix'
import { parse } from '@loaders.gl/core'
import { GLTFLoader } from '@loaders.gl/gltf'

export const loadModel = (name) => {
  return fetch(name)
    .then(data => parse(data, GLTFLoader))
    .then(gltfData => gltfData.scene)
}

export const transform = regl({
  context: {
    model: (context, props) => {
      // take either the matrix prop or separated props
      let matrix = props.matrix ||
        mat4.fromRotationTranslationScale([],
          props.rotation || [0, 0, 0, 1],
          props.position || [0, 0, 0],
          props.scale || [1, 1, 1])
      if(context.model) {
        // handle nested transforms
        matrix = mat4.multiply([], matrix, context.model)
      }
      return matrix
    }
  },
  uniforms: {
    model: (context) => context.model,
    invModel: (context) => mat4.invert([], context.model)
  }
})
