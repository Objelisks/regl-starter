# Standard 3d game engine starter project

Uses regl, webpack, standard


basic framework for loading gltf files
- model
- material
- animation

placeholder stuff
- render pipeline
- unlit shader
- brdf shader
- some debug primitives
- helper functions for regl

framework stuff
- input (key/mouse/gamepad)
- camera, mesh
- some tests?

test scene
- draws an animated textured model
- mouse hit test drag to rotate
- stats debug info


## file structure
root/
content/ - models, textures, sounds in folders that make sense
src/
  libs/ - third party libraries
    regl.js
    glmatrix.js
  web/
    index.html
    styles.css
  render/ - primitives, shaders
    shaders/ - vertex and fragment source
    primitives/ - simple 3d objects for debug or composition
    ui/ - 2d screenspace stuff
    model.js
    animation.js
    reglhelpers.js
  engine/ - shared generic stuff
    input/ - 
      keyboard.js
      mouse.js
      gamepad.js
    audio.js
    camera.js
    raycast.js
    network.js
    math.js
  game/ - game specific stuff

  main.js
  constants.js


tests/


## reference

https://glmatrix.net/docs/index.html