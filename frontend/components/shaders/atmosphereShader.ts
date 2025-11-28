/**
 * 大气辉光着色器（Fresnel效果）
 * 用于主星球和行星的大气层
 */

export const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFragmentShader = `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    // 视线方向
    vec3 viewDir = normalize(-vPosition);
    
    // Fresnel效果（边缘发光）
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), uPower);
    
    // 最终颜色和透明度
    vec3 color = uColor * fresnel * uIntensity;
    float alpha = fresnel * 0.7;
    
    gl_FragColor = vec4(color, alpha);
  }
`;
