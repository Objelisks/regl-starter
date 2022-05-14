#version 100
precision mediump float;
#pragma glslify: transpose = require(glsl-transpose)

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 tangent;

varying vec3 vPos;
varying vec3 modelPos;
varying vec2 vUv;
varying mat3 vTBN;

uniform mat4 projection, model, view;

void main() {
    vPos = vec3(model * vec4(position, 1.0));
    modelPos = position;
    vUv = uv;

    vec3 T = normalize(vec3(model * vec4(tangent, 0.0)));
    vec3 N = normalize(vec3(model * vec4(normal, 0.0)));
    T = normalize(T - dot(T, N) * N);
    vec3 B = cross(N, T);

    vTBN = mat3(T, B, N);

    gl_Position = projection * view * model * vec4(position, 1.0);
}