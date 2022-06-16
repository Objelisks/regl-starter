#version 100
precision mediump float;

uniform sampler2D fontAtlas;
uniform float threshold;
uniform vec4 color;

varying vec2 uv;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main() {
  vec3 distMap = texture2D(fontAtlas, uv).rgb;
  float dist = median(distMap.r, distMap.g, distMap.b);
  if(dist < 0.25) {
    discard;
  }
  gl_FragColor = vec4(vec3(color), smoothstep(0.0, 1.0, dist));
}