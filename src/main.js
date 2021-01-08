import regl from './libs/regl'

console.log('hello world', regl)

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1]
  })
})

/// example shader
// example file load
