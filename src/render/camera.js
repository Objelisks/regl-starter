import { mat4 } from 'gl-matrix'
import { regl } from './regl.js'

// This scoped command sets up the camera parameters
export const camera = regl({
  context: {
    projection: (context) => {
      return mat4.perspective(
        [],
        Math.PI / 4,
        context.viewportWidth / context.viewportHeight,
        0.1,
        200.0
      )
    },

    view: (context, props) => {
      return mat4.lookAt([], props.eye, props.target, [0, 1, 0])
    },

    eye: regl.prop('eye'),
    target: regl.prop('target'),
    lightPos: (context) => {
      return [0, 5, 0]
    }
  },

  uniforms: {
    view: regl.context('view'),
    invView: (context) => mat4.invert([], context.view),
    model: () => mat4.create(),
    projection: regl.context('projection')
  }
})
