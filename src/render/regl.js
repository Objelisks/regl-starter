import createREGL from 'regl'

const canvas = document.body.querySelector('#render')

export const regl = createREGL({
  canvas: canvas,
  optionalExtensions: [
    'WEBGL_depth_texture',
    'oes_element_index_uint', // for gltf element indices,
    'ANGLE_instanced_arrays' // for particle system instanced arrays
  ]
})
