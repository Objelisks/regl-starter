import textFrag from '../shaders/text.frag'
import textVert from '../shaders/text.vert'
import { loadImage, loadFile } from '../../engine/net.js'
import { regl } from '../regl.js'

const glyphImage = await loadImage('./content/fonts/noto-sans.png')
const glyphData = await loadFile('./content/fonts/noto-sans.json')

export const planeVertices = [
  [-1, -1], [+1, -1], [+1, +1], [-1, +1] // top face
]

export const planeElements = [
  [2, 1, 0], [2, 0, 3] // top face.
]

export const createTextRenderer = (text) => {
  let cursor = [0, 0]
  const codePoints = [...text]
  const glyphs = codePoints.map(char =>
    glyphData.glyphs.find((glyph) => glyph.unicode === char.codePointAt(0)))
  return regl({
    frag: textFrag,
    vert: textVert,
    attributes: {
      position: planeVertices,
      cursor: {
        buffer: glyphs.map((glyph) => {
          const current = [...cursor]
          cursor[0] += glyph.advance*2.0
          return current
        }),
        divisor: 1
      },
      plane: {
        buffer: glyphs.flatMap(glyph => {
          return [
            glyph.planeBounds.right+glyph.planeBounds.left,
            glyph.planeBounds.top+glyph.planeBounds.bottom,
            (glyph.planeBounds.right-glyph.planeBounds.left),
            (glyph.planeBounds.top-glyph.planeBounds.bottom)
          ]
        }),
        divisor: 1
      },
      character: {
        buffer: glyphs.flatMap(glyph => {
          return [
            glyph.atlasBounds.left,
            (glyphData.atlas.height-glyph.atlasBounds.top),
            (glyph.atlasBounds.right-glyph.atlasBounds.left),
            (glyph.atlasBounds.top-glyph.atlasBounds.bottom)
          ]
        }),
        divisor: 1
      }
    },
    uniforms: {
      fontAtlas: regl.texture({
        data: glyphImage,
        format: 'rgba',
        width: glyphData.atlas.width,
        height: glyphData.atlas.height,
        mag: 'linear',
        min: 'linear'
      }),
      size: [
        glyphData.atlas.width,
        glyphData.atlas.height,
      ],
      glyphSize: glyphData.atlas.size,
      color: regl.prop('color'),
      resolution: (context) => [context.viewportWidth, context.viewportHeight],
      time: regl.context('time')
    },
    elements: planeElements,
    blend: {
      enable: true,
      func: {
        srcRGB: 'src alpha',
        srcAlpha: 1,
        dstRGB: 'one minus src alpha',
        dstAlpha: 1
      },
    },
    instances: glyphs.length
  })
}