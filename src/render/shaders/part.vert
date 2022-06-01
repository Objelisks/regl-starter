#version 100
precision highp float;

attribute vec3 position;
attribute vec2 id;

varying vec3 vPos;
varying vec3 vNormal;
varying float life;

uniform mat4 projection, model, view;
uniform mat3 normalMatrix;
uniform mat4 invModel;
uniform float time;
uniform sampler2D data;

void main() {
  vec4 data = texture2D(data, id);
  vec3 dataPos = data.xyz*10.0;
  life = data.w;
  float size = max(0.0, life/2.0);
  vec3 pos = position * size;
  vPos = vec3(model * vec4(pos, 1.0)) + dataPos;
  vNormal = normalize(position);
  gl_Position = projection * view * model * vec4(pos + dataPos, 1.0);
}