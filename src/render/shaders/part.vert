#version 100
precision mediump float;
#pragma glslify: transpose = require(glsl-transpose)

attribute vec3 position;
attribute vec3 normal;
attribute vec3 offset;

varying vec3 vPos;
varying vec3 vNormal;

uniform mat4 projection, model, view;
uniform mat3 normalMatrix;
uniform mat4 invModel;

void main() {
  vPos = vec3(model * vec4(position, 1.0)) + offset;
  vNormal = normalize(position);
  gl_Position = projection * view * model * vec4(position + offset, 1.0);
}