// helpers for rendering gltf files in regl
// https://raw.githubusercontent.com/KhronosGroup/glTF/main/specification/2.0/figures/gltfOverview-2.0.0b.png

import { regl } from '../regl'
import { transform } from '../transform.js'
import { mat4 } from 'gl-matrix'
import { pbrShader } from '../shaders/shaders.js'

const renderingModes = {
  0: 'points',
  1: 'lines',
  2: 'line strip',
  3: 'line loop',
  4: 'triangles',
  5: 'triangle strip',
  6: 'triangle fan'
}

const drawPrimitive = primitive => {
  if(!primitive.draw) {
    primitive.draw = regl({
      primitive: renderingModes[primitive.mode || 4],
      elements: primitive.indices.value,
      attributes: {
        position: primitive.attributes.POSITION.value,
        normal: primitive.attributes.NORMAL.value,
        uv: primitive.attributes.TEXCOORD_0.value,
        tangent: primitive.attributes.TANGENT.value
      }
    })
  }
  const material = primitive.material
  if(!material.use) {
    const baseColorTexture = regl.texture(material.pbrMetallicRoughness.baseColorTexture.texture.source.image)
    const metallicRoughnessTexture = regl.texture(material.pbrMetallicRoughness.metallicRoughnessTexture.texture.source.image)
    const normalTexture = regl.texture(material.normalTexture.texture.source.image)
    material.use = regl({
      context: {
        baseColorTexture,
        metallicRoughnessTexture,
        normalTexture
      }
    })
  }
  material.use({}, () => pbrShader({}, () => primitive.draw()))
}

const drawMesh = mesh => {
  mesh.primitives.forEach(primitive => drawPrimitive(primitive))
}

const drawNode = node => {
  const draw = () => {
    if (node.mesh) {
      drawMesh(node.mesh)
    }
    if (node.children && node.drawable) {
      node.children.forEach((childNode) => drawNode(childNode))
    }
  }

  if(!(node.rotation || node.translation || node.scale)) {
    draw()
  }

  const localMatrix = mat4.fromRotationTranslationScale([],
    node.rotation || [0, 0, 0, 1],
    node.translation || [0, 0, 0],
    node.scale || [1, 1, 1]
  )
  transform({ matrix: localMatrix }, draw)
}

// lazy instantiate regl primitives and cache in gltf scene
export const drawGltf = (gltfData) => {
  if(!gltfData) return
  gltfData.scene.nodes.forEach(node => drawNode(node))
}