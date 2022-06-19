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

export const justification = {
  'start': 0,
  'center': 1,
  'end': 2
}

export const createTextRenderer = ({
  text,
  justify: [justificationRow, justificationColumn] = [justification.center, justification.center],
  size=40
}) => {
  const codePoints = [...text]
  const glyphs = codePoints.map(char =>
    glyphData.glyphs.find((glyph) => glyph.unicode === char.codePointAt(0)))
  const length = glyphs.reduce((acc, glyph) => {
    return acc + glyph.advance*2.0
  }, 0)
  
  const height = glyphs.reduce((acc, glyph) => {
    return Math.max(acc, glyph.planeBounds.top-glyph.planeBounds.bottom)
  }, 0)

  let cursor = [0,0]
  switch(justificationRow) {
    case justification.start:
      break;
    case justification.center:
      cursor[0] += -length/2.0
      break;
    case justification.end:
      cursor[0] += -length;
      break;
  }
  switch(justificationColumn) {
    case justification.start:
      break;
    case justification.center:
      cursor[1] += -height/2.0
      break;
    case justification.end:
      cursor[1] += -height;
      break;
  }

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
      glyphSize: size,
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