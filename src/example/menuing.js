import { camera } from '../render/camera.js'
import { createTextRenderer, justification } from '../render/primitives/text.js'
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

const noDepth = regl({
  depth: {
    enable: false
  }
})

const button = ({label, action, width, height}) => {
  const drawLabel = createTextRenderer({text: label, size: 24})
  return (context) => {
    noDepth({}, () => {
      drawRect({width: width, height: height, roundedness: [2.0, 2.0, 0.0, 2.0], color: [0.6, 0.6, 0.8]})
      drawRect({width: width-10, height: height-10, roundedness: [2.0, 2.0, 0.0, 2.0], color: [0.0, 0.0, 0.5]})
      drawLabel({color: [1, 1, 1, 1]})
    })
    // if(context.mouseDown && inside(box, context.mouseState)) {
    //   action(context)
    // }
  }
}

const titleScreen = () => {
  const drawTitleText = createTextRenderer({text: 'Title Screen:\nnew line'})
  const newGameButton = button({
    label: 'New game', action: () => transition(screens.settings),
    width: 540, height: 150
  })
  const continueButton = button({
    label: 'Continue', action: () => transition(screens.settings),
    width: 470, height: 150
  })
  const settingsButton = button({
    label: 'Settings', action: () => transition(screens.settings),
    width: 420, height: 150
  })
  const creditsButton = button({
    label: 'Credits', action: () => transition(screens.credits),
    width: 420, height: 150
  })
  return () => {
    camera({
      eye: [0, 0, 1],
      target: [0, 0, 0]
    }, (context) => {
      transform({position: [0, 1, 0]}, () =>
        drawTitleText({color: [1, 1, 1, 1]})
      )
      transform({position: [0, -0.4, 0]}, () =>
        newGameButton(context)
      )
      transform({position: [0, -0.7, 0]}, () =>
        continueButton(context)
      )
      transform({position: [0, -1, 0]}, () =>
        settingsButton(context)
      )
      transform({position: [0, -1.3, 0]}, () =>
        creditsButton(context)
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
      transform({position: [-0.5, 0, 0]}, () =>
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