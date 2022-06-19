#version 100
precision mediump float;

varying vec2 vPos;

uniform vec3 color;
uniform vec2 size;
uniform vec2 resolution;
uniform vec4 roundedness;

float sdRoundBox( in vec2 p, in vec2 b, in vec4 r ) 
{
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}

void main () {
    float dist = sdRoundBox(vPos*2.0, size/resolution, roundedness/20.0);
    if(dist > 0.05) {
        discard;
    }
    gl_FragColor = vec4(vec3(color), 1.0-(dist*100.0));
}