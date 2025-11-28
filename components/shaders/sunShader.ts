/**
 * 太阳耀斑着色器
 * 实现：脉冲耀斑 + 日冕风暴 + 噪声扰动
 */

export const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const sunFragmentShader = `
  uniform float uTime;
  uniform vec3 uColorCore;
  uniform vec3 uColorEdge;
  uniform float uIntensity;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simplex 3D Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    // 距离中心的距离
    vec2 center = vec2(0.5, 0.5);
    float dist = length(vUv - center);
    
    // 耀斑强度（中心强，边缘弱）
    float flare = pow(1.0 - dist * 2.0, 3.0);
    flare = clamp(flare, 0.0, 1.0);
    
    // 噪声扰动（模拟日冕风暴）
    vec3 noiseCoord = vPosition * 0.5 + vec3(uTime * 0.1, uTime * 0.15, 0.0);
    float noise = snoise(noiseCoord) * 0.5 + 0.5;
    
    // 脉冲效果
    float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
    
    // 颜色混合（核心 → 边缘）
    vec3 color = mix(uColorCore, uColorEdge, dist * 2.0);
    
    // 添加噪声扰动
    color += vec3(noise * 0.3);
    
    // 最终强度
    float intensity = flare * pulse * uIntensity;
    
    gl_FragColor = vec4(color * intensity, 1.0);
  }
`;

// 日冕外圈着色器（更大、更透明、旋转）
export const coronaFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  
  varying vec2 vUv;

  float snoise(vec3 v) {
    // 简化版噪声
    return fract(sin(dot(v, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
  }

  void main() {
    // 旋转UV
    vec2 center = vec2(0.5);
    vec2 uv = vUv - center;
    float angle = uTime * 0.1;
    mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    uv = rotation * uv + center;
    
    // 距离
    float dist = length(uv - center);
    
    // 环形渐变
    float ring = smoothstep(0.2, 0.5, dist) * (1.0 - smoothstep(0.5, 0.8, dist));
    
    // 噪声
    float noise = snoise(vec3(uv * 3.0, uTime * 0.2));
    
    // 最终透明度
    float alpha = ring * (noise * 0.5 + 0.5) * uOpacity;
    
    gl_FragColor = vec4(uColor, alpha);
  }
`;
