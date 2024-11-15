varying vec3 vColor;

void main() {
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - .5);
    float alpha = .05 / distanceToCenter - .1;

    gl_FragColor = vec4(vColor, alpha);

}