import { setupSceneForDrawing, drawScene } from './gltf.js'
import { parse } from '@loaders.gl/core'
import { GLTFLoader } from '@loaders.gl/gltf'

// mesh, textures, animation

/**
 * loads a model over network
 * @param {string} name relative url of model
 * @returns gltf scene object
 */
export const loadModel = (name) => {
  return fetch(name)
    .then(data => parse(data, GLTFLoader))
    .then(gltfData => gltfData.scene)
}

const modelCacher = {}

/**
 * creates a function that will eventually draw a model
 * @param {string} name relative url of model
 * @returns (props) => void
 */
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
