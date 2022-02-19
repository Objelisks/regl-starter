/* globals fetch */
import { parse } from '@loaders.gl/core'
import { GLTFLoader } from '@loaders.gl/gltf'

export const loadModel = (name) => {
  return fetch(name)
    .then(data => parse(data, GLTFLoader))
}

export const model = () => {

}
