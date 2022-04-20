import { regl } from '../regl.js'
import { loadModel } from '../model.js'

let loaded = false
let sphereDrawer = null

loadModel('content/primitives/sphere.glb').then(scene => {
  loaded = true
  const data = scene.nodes[0].mesh.primitives[0]
  sphereDrawer = regl({
    attributes: {
      position: data.attributes.POSITION.value,
      normal: data.attributes.NORMAL.value,
      uv: data.attributes.TEXCOORD_0.value
    },
    elements: data.indices.value
  })
})

export const drawSphere = () => loaded ? sphereDrawer() : null
