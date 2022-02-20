#version 100
precision mediump float;

varying vec3 vPos;
varying vec3 modelPos;
varying vec3 vNormal;

uniform vec3 color;
uniform vec3 camPos;

void main () {
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 lightPos = vec3(100.0, 100.0, 100.0);

    vec3 lightDir = normalize(lightPos - vPos);
    vec3 normal = normalize(vNormal);
    
    vec3 ambient = 0.3 * lightColor;

    float diffuseContribution = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = 0.7 * diffuseContribution * lightColor;
    
    vec3 viewDir = normalize(camPos - vPos);
    vec3 reflectDir = reflect(-lightDir, normal);

    float specularContribution = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = 0.2 * specularContribution * lightColor;

    vec3 result = color * (ambient + diffuse + specular);

    gl_FragColor = vec4(result, 1.0);
}