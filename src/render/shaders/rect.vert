#version 100
precision mediump float;

attribute vec2 position;

varying vec2 vPos;

uniform mat4 model;
uniform vec2 size;
uniform vec2 resolution;

void main() {
    vec2 scaledPos = position*size/resolution;
    vec4 worldPos = model * vec4(0.0, 0.0, 0.0, 1.0);
    vec4 transformed = vec4(scaledPos, 0.0, 1.0);
    vPos = position*size/resolution;
    vec4 result = transformed + worldPos;
    result /= result.w;
    gl_Position = result;
}