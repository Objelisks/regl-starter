/* global requestAnimationFrame */

import { renderFrame } from './render/render.js'
import { random } from './engine/util.js'
import { mousePostUpdate } from './input/mouse.js'

// import { physicsScreen } from './example/physics.js'
// const screen = physicsScreen()

import { stateMachineScreen } from './example/menuing.js'
const screen = stateMachineScreen()

const draw = () => {
  screen()
  mousePostUpdate()
  requestAnimationFrame(() => renderFrame(draw))
}

requestAnimationFrame(() => renderFrame(draw))

const nameIdeas = [
  'gift - Game engIne For Tims',
  'frog - Fresh Regl On Games'
]

console.log(random(nameIdeas))
