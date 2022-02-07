import { regl } from '../libs/regl.js'
import { FRAME_WIDTH, FRAME_HEIGHT } from '../constants.js'
import { times } from './util.js'

const makeFramebuffer = (width, height) => {
  const color = regl.texture({ width, height })
  const depth = regl.texture({ width, height, format: 'depth', type: 'uint32' })
  return {
    fbo: regl.framebuffer({
      width,
      height,
      color,
      depth,
      depthTexture: true
    }),
    color,
    depth
  }
}
const frameCount = 2
let frames = [0, 1]
const resizeFrames = (width, height) => {
  frames = []
  times(frameCount, () => frames.push(makeFramebuffer(width, height)))
}
resizeFrames(FRAME_WIDTH, FRAME_HEIGHT)
const frameIndex = 0
const activeFrame = () => frames[frameIndex]

export {
  activeFrame,
  resizeFrames
}
