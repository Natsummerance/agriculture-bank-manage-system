/**
 * 流星尾迹着色器
 * GPU粒子系统，头部白色，尾部青色
 */

export const meteorVertexShader = `
  attribute float aLifeTime;
  attribute vec3 aVelocity;
  
  uniform float uTime;
  uniform float uDuration;
  
  varying float vAlpha;
  varying vec3 vColor;
  
  void main() {
    // 计算粒子年龄
    float age = mod(uTime + aLifeTime, uDuration);
    float normalizedAge = age / uDuration;
    
    // 位置计算
    vec3 pos = position + aVelocity * age;
    
    // 透明度（出生时0，中间1，消失时0）
    vAlpha = sin(normalizedAge * 3.14159);
    
    // 颜色（头部白，尾部青）
    vColor = mix(vec3(0.0, 0.8, 0.76), vec3(1.0, 1.0, 1.0), normalizedAge);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // 点大小（根据距离和年龄）
    gl_PointSize = (3.0 / -mvPosition.z) * (1.0 - normalizedAge * 0.5);
  }
`;

export const meteorFragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  
  void main() {
    // 圆形点
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // 中心亮，边缘暗
    float intensity = 1.0 - smoothstep(0.0, 0.5, dist);
    
    gl_FragColor = vec4(vColor * intensity, vAlpha * intensity);
  }
`;
