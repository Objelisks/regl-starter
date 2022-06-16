#version 100
precision mediump float;

attribute vec2 position;

varying vec3 vPos;

uniform mat4 model;

void main() {
    vec4 transformed = model * vec4(position, 0.0, 1.0);
    vPos = transformed.xyz;
    gl_Position = transformed;
}