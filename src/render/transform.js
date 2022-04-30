/* globals fetch */
import { regl } from './regl.js'
import { mat4 } from 'gl-matrix'

/**
 * transform({position: vec3, rotation: quat, scale: vec3, matrix: mat4}, () => draw something)
 * 
 * matrix is used first if it exists over pos/rot/scale
 * these calls can be nested
 * generates model and invModel uniforms
 */
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
  // TODO: move this into a later call so that we don't invert matrices every transform call, but just at the end
  uniforms: {
    model: (context) => context.model,
    invModel: (context) => mat4.invert([], context.model)
  }
})
