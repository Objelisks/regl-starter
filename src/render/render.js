import { regl } from './regl.js'
import { FRAME_WIDTH, FRAME_HEIGHT, CLEAR_COLOR } from '../constants.js'
import { times } from '../engine/util.js'

const FRAME_COUNT = 2

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

let frames = []
const frameIndex = 0

const resizeFrames = (width, height) => {
  frames = []
  times(FRAME_COUNT, () => frames.push(makeFramebuffer(width, height)))
}
resizeFrames(FRAME_WIDTH, FRAME_HEIGHT)
window.addEventListener('resize', () => resizeFrames(FRAME_WIDTH, FRAME_HEIGHT))

const activeFrame = () => frames[frameIndex]

const renderFrame = (drawWorld) => {
  regl.poll()

  const draw = () => {
    // camera
    regl.clear({
      color: CLEAR_COLOR,
      depth: 1
    })

    drawWorld()
  }

  const passes = [
    () => draw()
  ]

  passes.forEach((pass, i) => {
    if (i === passes.length - 1) {
      pass()
    } else {
      activeFrame().fbo.use(pass)
    }
  })
}

export {
  activeFrame,
  renderFrame
}
