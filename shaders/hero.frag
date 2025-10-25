precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uNoiseTexture;
uniform float uTime;
uniform float uMouseStrength;
uniform float uScrollStrength;
uniform float uIntensity;
uniform float uOpacity;

vec3 toneMap(vec3 color) {
  return 1.0 - exp(-1.2 * color);
}

void main() {
  vec2 uv = vUv;
  
  float primaryNoise = texture2D(uNoiseTexture, uv * 1.8 + vec2(uTime * 0.05, uTime * -0.04)).r;
  float detailNoise = texture2D(uNoiseTexture, uv * 3.2 + uScrollStrength * 0.3).r;
  
  float displacement = ((primaryNoise * 0.7) + (detailNoise * 0.3));
  displacement = (displacement - 0.5) * 2.0;
  displacement *= uIntensity;
  displacement += uMouseStrength * 0.2;
  displacement += (uScrollStrength - 0.5) * 0.3;

  vec2 distortedUv = uv + vec2(displacement * 0.045, displacement * -0.045);
  vec4 baseColor = texture2D(uTexture, distortedUv);
  
  vec3 gradient = mix(vec3(0.05, 0.06, 0.15), vec3(0.02, 0.02, 0.08), uv.y);
  vec3 color = mix(gradient, baseColor.rgb, 0.9);

  float vignette = smoothstep(0.85, 0.2, distance(uv, vec2(0.5)));
  color *= mix(1.0, 0.6, 1.0 - vignette);

  float grain = texture2D(uNoiseTexture, uv * 6.0 + uTime * 0.1).r;
  color += (grain - 0.5) * 0.02;

  color = toneMap(color);
  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, uOpacity);
}
