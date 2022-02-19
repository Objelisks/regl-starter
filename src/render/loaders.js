import { registerLoaders } from '@loaders.gl/core'
import { GLTFLoader } from '@loaders.gl/gltf'

export const init = () => {
  registerLoaders(GLTFLoader)
}
