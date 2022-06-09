import { regl } from "./regl"

const gpgpuVertex = `#version 100
precision highp float;
attribute vec2 position;
varying vec2 id;
void main() {
  id = 0.5 * (position + 1.0);
  gl_Position = vec4(position, 0, 1);
}
`

export const planeVertices = [
  [-1, -1], [+1, -1], [+1, +1], [-1, +1] // top face
]

export const planeElements = [
  [2, 1, 0], [2, 0, 3] // top face.
]

export const createGpgpuRenderer = (frag) => regl({
  frag,
  vert: gpgpuVertex,
  attributes: {
    position: planeVertices
  },
  uniforms: {
    data: regl.prop('data'),
    time: regl.context('time'),
    delta: 0.016
  },
  elements: planeElements
})

export const vertexIds = (size) => {
  const ids = new Float32Array(2*size*size)
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      const ptr = size * i + j
      ids[2 * ptr] = i / size
      ids[2 * ptr + 1] = j / size
    }
  }
  return ids
}