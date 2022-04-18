import { regl } from '../regl.js'
import { createDrawScene } from './gltf.js'
import { loadModel } from '../model.js'

// mesh, textures, animation

const cacher = {}
const drawNothing = regl.draw

export const createModelDrawer = (name) => {
  if (!cacher[name]) {
    cacher[name] = drawNothing
    loadModel(name).then(scene => {
      cacher[name] = createDrawScene(scene)
    })
  }
  return (...args) => cacher[name](...args)
}
