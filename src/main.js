/* global requestAnimationFrame */
import { regl } from './libs/regl'

import { FRAME_WIDTH, FRAME_HEIGHT, CLEAR_COLOR } from './constants.js'
import { activeFrame, resizeFrames } from './engine/render.js'

console.log('hello world')

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1]
  })
})

/// example shader
// example file load
window.addEventListener('resize', () => resizeFrames(FRAME_WIDTH, FRAME_HEIGHT))

const render = () => {
  regl.poll()

  const draw = () => {
    // camera
    regl.clear({
      color: CLEAR_COLOR,
      depth: 1
    })

    // render world

    // render objects

    // render ui
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

requestAnimationFrame(render)
