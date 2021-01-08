import createREGL from 'regl'

const regl = createREGL({
  canvas: document.body.querySelector('#render'),
  extensions: [
  ]
})

export default regl
