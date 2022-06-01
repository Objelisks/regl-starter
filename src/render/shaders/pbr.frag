#version 100
precision mediump float;

float PI = 3.1415;

varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vUv;
varying mat3 vTBN;

uniform vec3 camPos;
uniform vec3 lightPos;

uniform float time;

uniform sampler2D baseColorTexture;
uniform sampler2D metallicRoughnessTexture;
uniform sampler2D normalTexture;

float distribution_ggx(float a, vec3 N, vec3 H) {
    float ndh = max(dot(N, H), 0.0);
    float denom = ndh*ndh*(a*a-1.0)+1.0;
    return a*a / (PI*denom*denom);
}

float geometry_schlick(float a, vec3 N, vec3 V) {
    float r = a + 1.0;
    float k = r*r/8.0;
    float ndv = max(dot(N, V), 0.0);
    return ndv / (ndv * (1.0-k) + k);
}

float geometry_smith(float a, vec3 N, vec3 V, vec3 L) {
    return geometry_schlick(a, N, L) * geometry_schlick(a, N, V);
}

vec3 fresnel_schlick(vec3 f0, vec3 H, vec3 V) {
    return f0 + (1.0 - f0) * pow(1.0 - max(dot(H, V), 0.0), 5.0);
}

void main () {
    float gamma = 2.2;

    // lights
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    // vec3 lightPos = vec3(cos(time)*2.0, 2.0, sin(time)*2.0);

    // textures
    // convert color from sRGB to linear
    vec4 baseColor = pow(texture2D(baseColorTexture, vUv), vec4(gamma));
    float roughness = texture2D(metallicRoughnessTexture, vUv).g;
    float metallic = texture2D(metallicRoughnessTexture, vUv).b;
    vec3 normal = texture2D(normalTexture, vUv).rgb;
    normal = normalize(2.0*normal - 1.0);
    normal = normal * vec3(1.0, -1.0, 1.0); // idk why, maybe the way painter exports normals?

    // world space normal
    vec3 N = normalize(vTBN * normal);

    // lighting vectors
    vec3 L = normalize(lightPos - vPos);
    vec3 V = normalize(camPos - vPos);
    vec3 H = normalize(L + V);

    // albedo
    vec3 f0 = mix(vec3(0.04), baseColor.rgb, metallic);

    // lighting visibility / occlusion
    float d = distribution_ggx(roughness, N, H);
    float g = geometry_smith(roughness, N, V, L);
    vec3 f = fresnel_schlick(f0, H, V);

    // specular and diffuse
    vec3 specular = d * g * f / (4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.0001);
    vec3 diffuse = mix(baseColor.rgb - f, vec3(0.0), metallic);

    // result color
    vec3 result = (diffuse + specular) * lightColor * max(dot(N, L), 0.0);

    // ambient lighting
    result += vec3(0.03) * baseColor.rgb;

    // gamma correction
    result = pow(result, vec3(1.0/gamma));

    gl_FragColor = vec4(vec3(result), 1.0);
}