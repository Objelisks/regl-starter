import { camera } from '../render/camera.js'
import { createTextRenderer } from '../render/primitives/text.js'
import { drawRect } from '../render/primitives/rect.js'
import { regl } from '../render/regl'
import { transform } from '../render/transform.js'

const after = (time, func) => {
  setTimeout(func, time * 1000)
}

let currentScreen = null
const transition = (newScreen) => {
  const oldScreen = currentScreen
  currentScreen = newScreen()
}
const screens = {}

const button = ({label, action, x, y, w, h}) => {
  const drawLabel = createTextRenderer(label)
  return (context) => {
    transform({scale: [w, h, 1]}, () =>
      drawRect()
    )
    transform({position: [-0.38, 0.2, -0.1]}, () =>
      drawLabel({color: [1, 1, 1, 1]})
    )
    // if(context.mouseDown && inside(box, context.mouseState)) {
    //   action(context)
    // }
  }
}

const titleScreen = () => {
  const drawTitleText = createTextRenderer('Title_Screen')
  const settingsButton = button({
    label: 'settings', action: () => transition(screens.settings),
    w: 0.5, h: 0.25
  })
  return () => {
    camera({
      eye: [0, 0, 1],
      target: [0, 0, 0]
    }, (context) => {
      transform({position: [-0.5, 1, 0]}, () =>
        drawTitleText({color: [1, 1, 1, 1]})
      )
      
      transform({position: [-0.5, -0.5, 0]}, () =>
        settingsButton(context)
      )
    })
  }
}
screens.title = titleScreen


const settingsScreen = () => {
  const toggleFgsfds = button({label: 'toggle'})
  return () => {
    camera({
      eye: [0, 0, 1],
      target: [0, 0, 0]
    }, (context) => {
      transform({position: [-0.5, 1, 0]}, () =>
        toggleFgsfds({color: [1, 1, 1, 1]})
      )
      //transition(screens.settings)
    })
  }
}
screens.settings = settingsScreen




export const stateMachineScreen = () => {
  transition(titleScreen)
  return () => {
    currentScreen()
  }
}