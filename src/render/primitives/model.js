import { parse } from '@loaders.gl/core'
import { GLTFLoader } from '@loaders.gl/gltf'

// mesh, textures, animation

/**
 * loads a model over network
 * @param {string} name relative url of model
 * @returns gltf scene object
 */
export const fetchModel = (name) => {
  return fetch(name)
    .then(data => parse(data, GLTFLoader, {gltf: {loadImages: true}}))
}

const modelCacher = {}

/**
 * creates a function that will eventually draw a model
 * @param {string} name relative url of model
 * @returns (props) => void
 */
 export const loadModel = (name) => {
  if (!modelCacher[name]) {
    modelCacher[name] = () => null
    fetchModel(name).then(gltf => {
      console.log(gltf)
      modelCacher[name] = () => gltf
    })
  }
  return (...args) => modelCacher[name](...args)
}

