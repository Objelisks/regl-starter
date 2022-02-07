import createREGL from 'regl'

export const regl = createREGL({
  canvas: document.body.querySelector('#render'),
  extensions: [
    'WEBGL_depth_texture'
  ]
})
