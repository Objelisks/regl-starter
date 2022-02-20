/* global requestAnimationFrame */

import { quat } from 'gl-matrix'
import { init as initLoaders } from './render/loaders.js'
import { renderFrame } from './render/render.js'
import { drawPlane } from './render/primitives/plane.js'
import { camera } from './render/camera.js'
import { loadModel, transform } from './render/model.js'
import { drawCube } from './render/primitives/cube.js'
import { flatShader } from './render/shaders.js'

// initLoaders()
loadModel('content/mouse1.gltf').then(model => console.log(model))

// const buildShader = regl
// const buildModel = regl

// const mouseShader = buildShader({
//   vert: vertexShader,
//   frag: fragmentShader
// })
// const mouseModel = buildModel({
//   attributes: {
//     position: [],
//     normals: [],
//     uvs: []
//   }
// })

// const miceProps = [
//   {
//     position: [0, 0, 0],
//     rotation: [0, 0, 0]
//   },
//   {
//     position: [1, 0, 0],
//     rotation: [0, 0, 0]
//   }
// ]
// const drawMice = (props) =>
//   mouseShader({}, () =>
//     mouseModel({}, () =>
//       regl(props)()
//     )
//   )

// camera({ eye: [10, 0, 10], target: [0, 0, 0] }, () => {
//   drawMice(miceProps)
// })

let tick = 0

const draw = () => {
  tick += 0.016
  camera(
    {
      eye: [2, 2, 2],
      target: [0, 0, 0]
    },
    (context) => {
      drawPlane()
      flatShader({ color: [1, 0.5, 0.5] }, () => {
        transform({
          position: [Math.cos(tick), 0, Math.sin(tick)],
          rotation: quat.setAxisAngle([], [1, 0, 0], tick)
        }, (context) => {
          drawCube()
        })
        transform({
          position: [Math.cos(-tick), 0, Math.sin(-tick)],
          rotation: quat.setAxisAngle([], [0, 1, 0], tick),
          scale: [0.5, 0.5, 0.5]
        }, (context) => {
          drawCube()
        })
      })
    })
  requestAnimationFrame(() => renderFrame(draw))
}

requestAnimationFrame(() => renderFrame(draw))

console.log('hello world')
