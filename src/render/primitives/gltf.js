// helpers for rendering gltf files in regl

import { regl } from '../regl'
import { transform } from '../model.js'

const renderingModes = {
  0: 'points',
  1: 'lines',
  2: 'line strip',
  3: 'line loop',
  4: 'triangles',
  5: 'triangle strip',
  6: 'triangle fan'
}

const drawPrimitive = (primitive) => {
  return regl({
    primitive: renderingModes[primitive.mode],
    elements: primitive.indices.value,
    attributes: {
      position: primitive.attributes.POSITION.value,
      normal: primitive.attributes.NORMAL.value,
      uv: primitive.attributes.TEXCOORD_0.value
    }
  })
}

const drawMesh = (mesh) => {
  mesh.primitives.forEach((primitive) => drawPrimitive(primitive))
}

const drawNode = (node) => {
  return transform(
    { }, // position: node.translation, rotation: node.rotation, scale: node.scale },
    () => {
      if (node.mesh) {
        drawMesh(node.mesh)
      }
      if (node.children) {
        node.children.forEach((childNode) => drawNode(childNode))
      }
    }
  )
}

// regl({transform}, () => draw calls)
export const createDrawScene = (scene) => {
  console.log('create draw', scene)
  scene.nodes.map((node) => drawNode(node))
}
