attribute vec2 position; // -1 to 1

// instanced
attribute vec4 character; // atlasBounds
attribute vec4 plane; // planeBounds
attribute vec2 cursor; // advance

uniform vec2 size; // atlas texture size
uniform float glyphSize; // pixels / em
uniform vec2 resolution; // canvas size
uniform mat4 model, view, projection;
uniform float time;

varying vec2 uv;

void main() {
  float aspectRatio = resolution.x / resolution.y;
  vec2 em = vec2(glyphSize*2.0) / resolution.x;
  vec2 imageCoords = (position.xy * vec2(1.0, -1.0) + 1.0) / 2.0;
  uv = (imageCoords * character.zw + character.xy)/size;
  vec2 characterBoxSize = plane.zw;
  // this makes it a billboard (only transforming the world space position)
  vec4 worldPos = model * vec4(0.0, 0.0, 0.0, 1.0);
  vec4 result = vec4(
    (characterBoxSize * position.xy + // character shape
    plane.xy + // offset by character adjustment
    cursor) * em, // offset by cursor
    0.0, 1.0) + worldPos;
  result /= result.w;
  gl_Position = result;
}