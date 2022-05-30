#version 100
precision highp float;

varying vec3 vPos;
varying vec3 vNormal;
varying float life;

uniform vec3 color;
uniform vec3 camPos;
uniform float time;

void main () {
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 lightPos = vec3(cos(time)*2.0, 2.0, sin(time)*2.0)*10.0;

    vec3 lightDir = normalize(lightPos - vPos);
    vec3 normal = normalize(vNormal);
    
    vec3 ambient = 1. * lightColor;

    float diffuseContribution = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = 0.7 * diffuseContribution * lightColor;
    
    vec3 viewDir = normalize(camPos - vPos);
    vec3 reflectDir = reflect(-lightDir, normal);

    float specularContribution = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = 0.2 * specularContribution * lightColor;

    float amt = life;
    vec3 col = mix(vec3(0.99, 0.69, 0.59), vec3(0.92, 0.46, 0.30), smoothstep(0.0, 0.15, amt));
    col = mix(col, vec3(0.53, 0.28, 0.20), smoothstep(0.15, 0.25, amt));
    col = mix(col, vec3(0.23, 0.15, 0.12), smoothstep(0.25, 0.5, amt));
    col = mix(col, vec3(0.20, 0.19, 0.18), smoothstep(0.5, 1.0, amt));

    vec3 result = col * (ambient);

    gl_FragColor = vec4(result, 1.0);
}