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

const drawPrimitive = (primitive, shader) => {
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
  let args = { color: [1, 0.5, 0.5] } // todo: make this generated based on shader
  const material = primitive.material
  if(!material.textures && material.pbrMetallicRoughness) {
    const pbr = material.pbrMetallicRoughness
    const baseColorTexture = pbr.baseColorTexture !== undefined ?
      regl.texture(pbr.baseColorTexture.texture.source.image) :
      regl.texture([[pbr.baseColorFactor.map(data => data * 255)]])
    const metallicRoughnessTexture = pbr.metallicRoughnessTexture !== undefined ?
      regl.texture(pbr.metallicRoughnessTexture.texture.source.image) :
      regl.texture([[[1, pbr.roughnessFactor, pbr.metallicFactor, 1]]])
    const normalTexture = material.normalTexture !== undefined ?
      regl.texture(material.normalTexture.texture.source.image) :
      regl.texture([[[0,0,0,0]]])
    material.textures = {
      baseColorTexture,
      metallicRoughnessTexture,
      normalTexture
    }
  }
  if(material.textures) {
    args = {
      baseColorTexture: material.textures.baseColorTexture,
      metallicRoughnessTexture: material.textures.metallicRoughnessTexture,
      normalTexture: material.textures.normalTexture
    }
  }
  shader(args, () => primitive.draw())
}

const drawMesh = (mesh, shader) => {
  mesh.primitives.forEach(primitive => drawPrimitive(primitive, shader))
}

const drawNode = (node, shader) => {
  const draw = () => {
    if (node.mesh) {
      drawMesh(node.mesh, shader)
    }
    if (node.children) {
      node.children.forEach((childNode) => drawNode(childNode, shader))
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
export const drawGltf = (gltfData, shader=pbrShader) => {
  if(!gltfData) return
  gltfData.scene.nodes.forEach(node => drawNode(node, shader))
}