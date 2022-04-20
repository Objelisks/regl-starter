// helpers for rendering gltf files in regl
// https://raw.githubusercontent.com/KhronosGroup/glTF/main/specification/2.0/figures/gltfOverview-2.0.0b.png

import { regl } from '../regl'
import { transform } from '../model.js'
import { mat4 } from 'gl-matrix'

const renderingModes = {
  0: 'points',
  1: 'lines',
  2: 'line strip',
  3: 'line loop',
  4: 'triangles',
  5: 'triangle strip',
  6: 'triangle fan'
}

const setupPrimitive = (primitive) => {
  primitive.draw = regl({
    primitive: renderingModes[primitive.mode],
    elements: primitive.indices.value,
    attributes: {
      position: primitive.attributes.POSITION.value,
      normal: primitive.attributes.NORMAL.value,
      uv: primitive.attributes.TEXCOORD_0.value
    }
  })
}

const setupMesh = (mesh) => {
  mesh.primitives.forEach((primitive) => setupPrimitive(primitive))
}

const setupNode = (node) => {
  let draws = 0
  if (node.mesh) {
    setupMesh(node.mesh)
    draws += 1
  }
  if (node.children) {
    const drawablesCount = node.children.reduce((acc, childNode) => acc + setupNode(childNode), 0)
    node.drawable = drawablesCount > 0
    draws += drawablesCount
  }
  return draws
}

export const setupSceneForDrawing = (scene) => {
  scene.nodes.forEach((node, i) => setupNode(node))
  return scene
}

const drawMesh = (mesh) => {
  mesh.primitives.forEach((primitive) => primitive.draw())
}

const drawNode = (node) => {
  const localMatrix = mat4.fromRotationTranslationScale([],
    node.rotation || [0, 0, 0, 1],
    node.translation || [0, 0, 0],
    node.scale || [1, 1, 1]
  )
  transform(
    { matrix: localMatrix },
    () => {
      if (node.mesh) {
        drawMesh(node.mesh)
      }
      if (node.children && node.drawable) {
        node.children.forEach((childNode) => drawNode(childNode))
      }
    }
  )
}

export const drawScene = (scene) => {
  scene.nodes.forEach((node) => drawNode(node))
}