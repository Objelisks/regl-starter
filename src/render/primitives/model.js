import { parse } from '@loaders.gl/core'
import { GLTFLoader } from '@loaders.gl/gltf'

// mesh, textures, animation

/**
 * loads a model over network
 * @param {string} name relative url of model
 * @returns gltf scene object
 */
export const fetchModel = (name) => {
  const url = `${window.location.origin}/${window.location.pathname}/${name}`
  return fetch(url)
    .then(data => parse(data, GLTFLoader, {gltf: {loadImages: true}}))
}

const modelCache = {}

/**
 * creates a function that will eventually draw a model
 * @param {string} name relative url of model
 * @returns (props) => void
 */
 export const loadModel = (name) => {
  if (!modelCache[name]) {
    modelCache[name] = {
      loading: null,
      model: null
    }
    modelCache[name].loading = new Promise(resolve => {
      fetchModel(name).then(gltf => {
        modelCache[name].model = gltf
        resolve(gltf)
      })
    })
  }

  // return (...args) => modelCache[name](...args)
  return modelCache[name]
}
