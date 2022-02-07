precision mediump float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 projection, model, view;
uniform mat3 normalMatrix;

varying vec3 worldPos;
varying vec3 modelPos;
varying vec3 vNormal;

void main() {
    worldPos = vec3(model * vec4(position, 1.0));
    modelPos = position;
    vNormal = normal;
    gl_Position = projection * view * model * vec4(position, 1.0);
}