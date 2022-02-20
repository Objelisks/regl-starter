import createREGL from 'regl'

const canvas = document.body.querySelector('#render')

export const regl = createREGL({
  canvas: canvas,
  optionalExtensions: [
    'WEBGL_depth_texture'
  ]
})
