#version 100
precision mediump float;

varying vec3 vPos;
varying vec3 modelPos;
varying vec3 vNormal;

uniform vec3 color;
uniform vec3 camPos;
uniform vec3 lightPos;

void main () {
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    // vec3 lightPos = vec3(-5.0, 10.0, 5.0);

    vec3 lightDir = normalize(lightPos - vPos);
    float lightDist = distance(lightPos, vPos);
    vec3 normal = normalize(vNormal);
    
    vec3 ambient = 0.3 * lightColor;

    float diffuseContribution = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = 0.7 * diffuseContribution * lightColor;
    
    vec3 viewDir = normalize(camPos - vPos);
    vec3 reflectDir = reflect(-lightDir, normal);

    float specularContribution = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = 0.2 * specularContribution * lightColor;

    vec3 result = color * (ambient + (diffuse + specular) * min(1.0, max(0.0, 5.0-lightDist*lightDist)));

    gl_FragColor = vec4(result, 1.0);
}