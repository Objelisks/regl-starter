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

const NEW_LINE = 10

const isWhitespace = (codePoint) => [10, 32].includes(codePoint)

const extraChars = [
  {
    unicode: '\n'.codePointAt(0),
    advance: 0
  }
]

// okay, so
export const createTextRenderer = ({
  text,
  justify: [justificationRow, justificationColumn] = [justification.center, justification.center],
  lineHeight = 1.2,
  size = 40
}) => {
  // code points vs string characters keeps emoji joined together
  const codePoints = [...text]
  // graph the glyph data out of the font json or extra non-rendered data
  const glyphs = codePoints.map(char =>
    glyphData.glyphs.find((glyph) => glyph.unicode === char.codePointAt(0)) ||
    extraChars.find(glyph => glyph.unicode === char.codePointAt(0)))

  let nextCursor = [0, 0]
  const lineWidths = []

  // convert to renderable data
  const characters = glyphs.flatMap((glyph) => {
    const thisCursor = [...nextCursor]
    if(glyph.unicode === NEW_LINE) {
      lineWidths.push(nextCursor[0])
      nextCursor[0] = 0
      nextCursor[1] += -lineHeight*2.0
    } else {
      nextCursor[0] += glyph.advance*2.0
    }

    // don't render whitespace (cursor already moved)
    if(isWhitespace(glyph.unicode)) {
      return []
    }

    return [{
      // cursor points to where the character should be drawn
      cursor: thisCursor,
      // plane is the bounds of the character when rendered
      plane: [
        glyph.planeBounds.right+glyph.planeBounds.left,
        glyph.planeBounds.top+glyph.planeBounds.bottom,
        (glyph.planeBounds.right-glyph.planeBounds.left),
        (glyph.planeBounds.top-glyph.planeBounds.bottom)
      ],
      // character is the bounds of the character in the atlas
      character: [
        glyph.atlasBounds.left,
        (glyphData.atlas.height-glyph.atlasBounds.top),
        (glyph.atlasBounds.right-glyph.atlasBounds.left),
        (glyph.atlasBounds.top-glyph.atlasBounds.bottom)
      ]
    }]
  })

  // flush the last width
  lineWidths.push(nextCursor[0])

  // heights go negative (add a lineheight=1.0 height to the end to account for the first line)
  const height = Math.abs(nextCursor[1] - 2.0)

  // start off -1 to trigger new line logic on first line
  let currentLine = -1
  let currentLineHeight = null

  // justify text
  characters.forEach(character => {
    if(character.cursor[1] !== currentLineHeight) {
      currentLine += 1
      currentLineHeight = character.cursor[1]
    }
    
    switch(justificationRow) {
      case justification.start:
        break;
      case justification.center:
        character.cursor[0] += -lineWidths[currentLine]/2.0
        break;
      case justification.end:
        character.cursor[0] += -lineWidths[currentLine]
        break;
    }
    switch(justificationColumn) {
      case justification.start:
        break;
      case justification.center:
        character.cursor[1] += -height/2.0
        break;
      case justification.end:
        character.cursor[1] += -height
        break;
    }
  })

  return regl({
    frag: textFrag,
    vert: textVert,
    attributes: {
      position: planeVertices,
      cursor: {
        buffer: characters.map(char => char.cursor),
        divisor: 1
      },
      plane: {
        buffer: characters.map(char => char.plane),
        divisor: 1
      },
      character: {
        buffer: characters.map(char => char.character),
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
    instances: characters.length
  })
}