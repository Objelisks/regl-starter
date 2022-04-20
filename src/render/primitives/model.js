import { setupSceneForDrawing, drawScene } from './gltf.js'
import { parse } from '@loaders.gl/core'
import { GLTFLoader } from '@loaders.gl/gltf'

// mesh, textures, animation

export const loadModel = (name) => {
  return fetch(name)
    .then(data => parse(data, GLTFLoader))
    .then(gltfData => gltfData.scene)
}

const modelCacher = {}

export const createModelDrawer = (name) => {
  if (!modelCacher[name]) {
    modelCacher[name] = () => {}
    loadModel(name).then(scene => {
      setupSceneForDrawing(scene)
      modelCacher[name] = () => drawScene(scene)
    })
  }
  return (...args) => modelCacher[name](...args)
}
