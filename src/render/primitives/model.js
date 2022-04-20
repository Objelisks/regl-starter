import { setupSceneForDrawing, drawScene } from './gltf.js'
import { loadModel } from '../model.js'

// mesh, textures, animation

const cacher = {}

export const createModelDrawer = (name) => {
  if (!cacher[name]) {
    cacher[name] = () => {}
    loadModel(name).then(scene => {
      setupSceneForDrawing(scene)
      cacher[name] = () => drawScene(scene)
    })
  }
  return (...args) => cacher[name](...args)
}
