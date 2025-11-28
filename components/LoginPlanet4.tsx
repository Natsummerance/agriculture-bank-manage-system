/**
 * 星云·AgriVerse 登录星球 4.0
 * 沉浸式太阳系宇宙场景 - WebGL 3D实现
 * 
 * 场景层级：
 * L1: 太阳（脉冲耀斑+日冕）
 * L2: 内环行星×3
 * L3: 主星球（Agri星）
 * L4: 外环行星×2 + 角色卫星×5
 * L5: 小行星带（InstancedMesh）
 * L6: 星云背景（Skybox）
 * L7: 流星尾迹（GPU粒子）
 */

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Sparkles, Hand, ZoomIn, Volume2, VolumeX } from "lucide-react";
import THREE from "../utils/three-singleton";
import { useCosmicPerformance } from "../utils/useCosmicPerformance";
import { sunVertexShader, sunFragmentShader, coronaFragmentShader } from "./shaders/sunShader";
import { atmosphereVertexShader, atmosphereFragmentShader } from "./shaders/atmosphereShader";
import { meteorVertexShader, meteorFragmentShader } from "./shaders/meteorShader";

type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin' | null;

interface Satellite {
  id: RoleType;
  name: string;
  nameEn: string;
  color: string;
  glowColor: string;
  angle: number;
  speed: number;
  description: string;
  icon: string;
}

const satellites: Satellite[] = [
  {
    id: 'farmer',
    name: '农户',
    nameEn: 'Farmer',
    color: '#18FF74',
    glowColor: 'rgba(24, 255, 116, 0.8)',
    angle: 0,
    speed: 0.025 * 0.1 * 1.00, // 再降低10倍
    description: '农业生产者 · 融资交易',
    icon: '🌾'
  },
  {
    id: 'buyer',
    name: '买家',
    nameEn: 'Buyer',
    color: '#00D6C2',
    glowColor: 'rgba(0, 214, 194, 0.8)',
    angle: 72,
    speed: 0.025 * 0.1 * 1.15, // 再降低10倍
    description: '商品采购者 · 订单管理',
    icon: '🛒'
  },
  {
    id: 'bank',
    name: '银行',
    nameEn: 'Bank',
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.8)',
    angle: 144,
    speed: 0.025 * 0.1 * 1.30, // 再降低10倍
    description: '金融机构 · 联合贷款',
    icon: '🏦'
  },
  {
    id: 'expert',
    name: '专家',
    nameEn: 'Expert',
    color: '#FF2566',
    glowColor: 'rgba(255, 37, 102, 0.8)',
    angle: 216,
    speed: 0.025 * 0.1 * 1.45, // 再降低10倍
    description: '农业顾问 · 知识服务',
    icon: '👨‍🔬'
  },
  {
    id: 'admin',
    name: '管理员',
    nameEn: 'Admin',
    color: '#9D4EDD',
    glowColor: 'rgba(157, 78, 221, 0.8)',
    angle: 288,
    speed: 0.025 * 0.1 * 1.60, // 再降低10倍
    description: '系统管理 · 运营控制',
    icon: '⚙️'
  }
];

interface LoginPlanet4Props {
  onRoleSelect: (role: RoleType) => void;
}

export function LoginPlanet4({ onRoleSelect }: LoginPlanet4Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [hoveredSatellite, setHoveredSatellite] = useState<RoleType>(null);
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSatellite, setDraggedSatellite] = useState<RoleType>(null);
  const [dragPosition3D, setDragPosition3D] = useState<THREE.Vector3 | null>(null);
  const isDraggingRef = useRef(false);
  const draggedSatelliteRef = useRef<RoleType>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [cameraZoom, setCameraZoom] = useState(0);
  const [showDragHint, setShowDragHint] = useState(false);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  
  // 速度控制
  const [speedMultiplier, setSpeedMultiplier] = useState({
    satellite: 1,      // 卫星公转速度
    planet: 1,         // 主星球自转速度
    asteroid: 1,       // 小行星带旋转速度
    stars: 1,          // 星空旋转速度
    orbit: 1           // 内环行星公转速度（改名避免和satellite重复）
  });
  
  const performanceConfig = useCosmicPerformance();
  const satelliteMeshesRef = useRef<Map<RoleType, THREE.Mesh>>(new Map());
  const satelliteGroupsRef = useRef<Map<RoleType, THREE.Group>>(new Map());
  const mainPlanetRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const dragPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const dragOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const dragTrailRef = useRef<THREE.Points | null>(null);
  const trailPositionsRef = useRef<Float32Array>(new Float32Array(100 * 3));
  const speedMultiplierRef = useRef({
    satellite: 1,
    planet: 1,
    asteroid: 1,
    stars: 1,
    orbit: 1
  });

  // 音效系统（Web Audio API）
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  // 同步速度控制到ref
  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier;
  }, [speedMultiplier]);

  // 初始化场景
  useEffect(() => {
    if (!containerRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.set(0, 0, 25);
    cameraRef.current = camera;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ 
      antialias: performanceConfig.tier !== 'low',
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(performanceConfig.pixelRatio);
    renderer.setClearColor(0x000000, 1);
    if (performanceConfig.enableShadows) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 初始化音频
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // L6: 星云背景（程序化生成）
    const starGeometry = new THREE.BufferGeometry();
    const starCount = performanceConfig.starCount;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // 球形分布
      const radius = 800 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // 星云颜色（极光青 → 生物绿渐变）
      const colorMix = Math.random();
      const color = new THREE.Color().lerpColors(
        new THREE.Color(0x00D6C2),
        new THREE.Color(0x18FF74),
        colorMix
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // L1: 太阳（着色器实现）
    const sunGeometry = new THREE.SphereGeometry(3, 64, 64);
    const sunMaterial = new THREE.ShaderMaterial({
      vertexShader: sunVertexShader,
      fragmentShader: sunFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColorCore: { value: new THREE.Vector3(1.0, 0.6, 0.2) },
        uColorEdge: { value: new THREE.Vector3(1.0, 0.4, 0.0) },
        uIntensity: { value: 1.5 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(-20, 5, -50);
    scene.add(sun);

    // 日冕外圈
    const coronaGeometry = new THREE.SphereGeometry(5, 32, 32);
    const coronaMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: coronaFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Vector3(1.0, 0.5, 0.0) },
        uOpacity: { value: 0.3 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    corona.position.copy(sun.position);
    scene.add(corona);

    // L2: 内环行星×3（简化为球体，速度降至1/10 + 微小随机偏移防止重合）
    const innerPlanets = [
      { radius: 0.3, distance: 8, speed: 0.003 + Math.random() * 0.002, color: 0x8B7355 },
      { radius: 0.4, distance: 12, speed: 0.002 + Math.random() * 0.002, color: 0xFFA500 },
      { radius: 0.35, distance: 16, speed: 0.001 + Math.random() * 0.002, color: 0xCD853F }
    ];

    innerPlanets.forEach((config, index) => {
      const geometry = new THREE.SphereGeometry(config.radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: config.color,
        roughness: 0.9,
        metalness: 0.1
      });
      const planet = new THREE.Mesh(geometry, material);
      planet.userData = { 
        orbitRadius: config.distance, 
        orbitSpeed: config.speed,
        angle: (index / innerPlanets.length) * Math.PI * 2
      };
      scene.add(planet);
      planet.castShadow = performanceConfig.enableShadows;
      planet.receiveShadow = performanceConfig.enableShadows;
    });

    // L3: 主星球（Agri星 - 农田绿色）
    const mainPlanetGroup = new THREE.Group();
    mainPlanetRef.current = mainPlanetGroup;

    const mainGeometry = new THREE.SphereGeometry(2, 64, 64);
    const mainMaterial = new THREE.MeshStandardMaterial({
      color: 0x18FF74,
      roughness: 0.7,
      metalness: 0.2,
      emissive: 0x0a3d2a,
      emissiveIntensity: 0.3
    });
    const mainPlanet = new THREE.Mesh(mainGeometry, mainMaterial);
    mainPlanet.castShadow = performanceConfig.enableShadows;
    mainPlanet.receiveShadow = performanceConfig.enableShadows;
    mainPlanetGroup.add(mainPlanet);

    // 主星球大气层
    const atmosphereGeometry = new THREE.SphereGeometry(2.3, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Vector3(0.0, 0.84, 0.76) },
        uIntensity: { value: 1.0 },
        uPower: { value: 3.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    mainPlanetGroup.add(atmosphere);

    mainPlanetGroup.position.set(0, 0, 0);
    scene.add(mainPlanetGroup);

    // 拖拽目标区域提示圈（半透明）
    const dropZoneGeometry = new THREE.RingGeometry(2.8, 3, 64);
    const dropZoneMaterial = new THREE.MeshBasicMaterial({
      color: 0x18FF74,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const dropZone = new THREE.Mesh(dropZoneGeometry, dropZoneMaterial);
    dropZone.rotation.x = Math.PI / 2;
    dropZone.userData.isDropZone = true;
    mainPlanetGroup.add(dropZone);

    // L4: 角色卫星×5（外环）
    const satelliteOrbitRadius = 6;
    satellites.forEach((sat) => {
      const satGroup = new THREE.Group();
      
      // 卫星球体
      const satGeometry = new THREE.SphereGeometry(0.4, 32, 32);
      const satMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(sat.color),
        emissive: new THREE.Color(sat.color),
        emissiveIntensity: 0.5,
        roughness: 0.5,
        metalness: 0.7
      });
      const satMesh = new THREE.Mesh(satGeometry, satMaterial);
      satMesh.userData = { roleId: sat.id };
      satGroup.add(satMesh);

      // 发光环
      const ringGeometry = new THREE.RingGeometry(0.5, 0.6, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(sat.color),
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      satGroup.add(ring);

      // 计算初始位置
      const angle = (sat.angle * Math.PI) / 180;
      satGroup.position.set(
        Math.cos(angle) * satelliteOrbitRadius,
        Math.sin(angle) * satelliteOrbitRadius * 0.3,
        Math.sin(angle) * satelliteOrbitRadius
      );

      satGroup.userData = {
        orbitRadius: satelliteOrbitRadius,
        orbitSpeed: sat.speed,
        angle: sat.angle,
        roleId: sat.id
      };

      scene.add(satGroup);
      satelliteMeshesRef.current.set(sat.id, satMesh);
      satelliteGroupsRef.current.set(sat.id, satGroup);
    });

    // L5: 小行星带（InstancedMesh）
    const asteroidCount = performanceConfig.asteroidCount;
    const asteroidGeometry = new THREE.OctahedronGeometry(0.05, 0);
    const asteroidMaterial = new THREE.MeshStandardMaterial({
      color: 0x6B7280,
      roughness: 0.9,
      metalness: 0.1
    });
    const asteroidField = new THREE.InstancedMesh(
      asteroidGeometry,
      asteroidMaterial,
      asteroidCount
    );

    const dummy = new THREE.Object3D();
    for (let i = 0; i < asteroidCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 18 + Math.random() * 4;
      const height = (Math.random() - 0.5) * 2;

      dummy.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dummy.scale.setScalar(0.5 + Math.random() * 1.5);
      dummy.updateMatrix();
      asteroidField.setMatrixAt(i, dummy.matrix);
    }
    scene.add(asteroidField);

    // L7: 流星尾迹（GPU粒子）
    const meteorCount = 30;
    const meteorGeometry = new THREE.BufferGeometry();
    const meteorPositions = new Float32Array(meteorCount * 3);
    const meteorLifeTimes = new Float32Array(meteorCount);
    const meteorVelocities = new Float32Array(meteorCount * 3);

    for (let i = 0; i < meteorCount; i++) {
      // 随机起点（屏幕边缘）
      const angle = Math.random() * Math.PI * 2;
      const radius = 50;
      meteorPositions[i * 3] = Math.cos(angle) * radius;
      meteorPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      meteorPositions[i * 3 + 2] = Math.sin(angle) * radius;

      meteorLifeTimes[i] = Math.random() * 2;

      // 速度（飞向对侧）
      const targetAngle = angle + Math.PI;
      meteorVelocities[i * 3] = Math.cos(targetAngle) * 20;
      meteorVelocities[i * 3 + 1] = (Math.random() - 0.5) * 5;
      meteorVelocities[i * 3 + 2] = Math.sin(targetAngle) * 20;
    }

    meteorGeometry.setAttribute('position', new THREE.BufferAttribute(meteorPositions, 3));
    meteorGeometry.setAttribute('aLifeTime', new THREE.BufferAttribute(meteorLifeTimes, 1));
    meteorGeometry.setAttribute('aVelocity', new THREE.BufferAttribute(meteorVelocities, 3));

    const meteorMaterial = new THREE.ShaderMaterial({
      vertexShader: meteorVertexShader,
      fragmentShader: meteorFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uDuration: { value: 2.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const meteors = new THREE.Points(meteorGeometry, meteorMaterial);
    scene.add(meteors);

    // 拖拽轨迹粒子系统
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositionsRef.current, 3));
    const trailMaterial = new THREE.PointsMaterial({
      color: 0x18FF74,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const dragTrail = new THREE.Points(trailGeometry, trailMaterial);
    dragTrail.visible = false;
    scene.add(dragTrail);
    dragTrailRef.current = dragTrail;

    // 光照系统
    // Sun Key Light
    const sunKeyLight = new THREE.DirectionalLight(0xFFEEBA, 1.5);
    sunKeyLight.position.copy(sun.position);
    if (performanceConfig.enableShadows) {
      sunKeyLight.castShadow = true;
      sunKeyLight.shadow.mapSize.width = 2048;
      sunKeyLight.shadow.mapSize.height = 2048;
    }
    scene.add(sunKeyLight);

    // Sun Rim Light
    const sunRimLight = new THREE.PointLight(0xFF8A00, 0.8, 100);
    sunRimLight.position.copy(sun.position);
    scene.add(sunRimLight);

    // Ambient Light
    const ambientLight = new THREE.HemisphereLight(0x18FF74, 0x0A0A0D, 0.3);
    scene.add(ambientLight);

    // Fill Light
    const fillLight = new THREE.SpotLight(0x00D6C2, 0.2, 100, Math.PI / 4, 0.5, 2);
    fillLight.position.set(10, 10, 10);
    scene.add(fillLight);

    // 动画循环
    let time = 0;
    const animate = () => {
      if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

      time += 0.016;

      // 更新着色器时间
      (sunMaterial.uniforms.uTime as any).value = time;
      (coronaMaterial.uniforms.uTime as any).value = time;
      (meteorMaterial.uniforms.uTime as any).value = time;

      // 更新内环行星轨道
      scene.children.forEach((obj: THREE.Object3D) => {
        if (obj.userData.orbitRadius && obj.userData.orbitSpeed) {
          obj.userData.angle += obj.userData.orbitSpeed * speedMultiplierRef.current.orbit;
          obj.position.x = Math.cos(obj.userData.angle) * obj.userData.orbitRadius;
          obj.position.z = Math.sin(obj.userData.angle) * obj.userData.orbitRadius;
        }
      });

      // 更新拖拽轨迹
      if (dragTrailRef.current) {
        if (isDraggingRef.current && draggedSatelliteRef.current) {
          const satGroup = satelliteGroupsRef.current.get(draggedSatelliteRef.current);
          if (satGroup) {
            // 显示轨迹
            dragTrailRef.current.visible = true;
            
            // 更新轨迹点（循环缓冲）
            const positions = trailPositionsRef.current;
            for (let i = positions.length - 3; i >= 3; i -= 3) {
              positions[i] = positions[i - 3];
              positions[i + 1] = positions[i - 2];
              positions[i + 2] = positions[i - 1];
            }
            positions[0] = satGroup.position.x;
            positions[1] = satGroup.position.y;
            positions[2] = satGroup.position.z;
            
            dragTrailRef.current.geometry.attributes.position.needsUpdate = true;
          }
        } else {
          // 隐藏轨迹
          dragTrailRef.current.visible = false;
        }
      }

      // 更新卫星轨道（不包括正在拖拽的卫星）
      satelliteMeshesRef.current.forEach((mesh, roleId) => {
        const group = mesh.parent as THREE.Group;
        if (group && group.userData.orbitRadius) {
          // 跳过正在拖拽的卫星
          if (isDraggingRef.current && draggedSatelliteRef.current === roleId) {
            // 自转继续（降低到1/10）
            mesh.rotation.y += 0.001;
            
            // 增强发光效果
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
              mesh.material.emissiveIntensity = 0.8;
            }
            return;
          }

          group.userData.angle += group.userData.orbitSpeed * 0.001 * speedMultiplierRef.current.satellite;
          const angle = (group.userData.angle * Math.PI) / 180;
          
          // 计算目标位置
          const targetX = Math.cos(angle) * group.userData.orbitRadius;
          const targetY = Math.sin(angle) * group.userData.orbitRadius * 0.3;
          const targetZ = Math.sin(angle) * group.userData.orbitRadius;
          
          // 平滑插值（用于回弹动画）
          group.position.x = THREE.MathUtils.lerp(group.position.x, targetX, 0.1);
          group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, 0.1);
          group.position.z = THREE.MathUtils.lerp(group.position.z, targetZ, 0.1);
          
          // 自转（降低到1/10）
          mesh.rotation.y += 0.001 * speedMultiplierRef.current.satellite;
          
          // 恢复正常发光
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.emissiveIntensity = THREE.MathUtils.lerp(
              mesh.material.emissiveIntensity,
              0.5,
              0.1
            );
          }
        }
      });

      // 主星球自转（降低到1/10）
      if (mainPlanetRef.current) {
        mainPlanetRef.current.rotation.y += 0.0002 * speedMultiplierRef.current.planet;
        
        // 拖拽目标区域闪烁
        const dropZone = mainPlanetRef.current.children.find(
          (child: any) => child.userData.isDropZone
        ) as THREE.Mesh | undefined;
        
        if (dropZone && dropZone.material instanceof THREE.MeshBasicMaterial) {
          if (isDraggingRef.current) {
            // 拖拽时显示并闪烁
            dropZone.material.opacity = Math.sin(time * 3) * 0.2 + 0.3;
            dropZone.rotation.z += 0.02;
          } else {
            // 非拖拽时隐藏
            dropZone.material.opacity = THREE.MathUtils.lerp(
              dropZone.material.opacity,
              0,
              0.1
            );
          }
        }
      }

      // 小行星带旋转（降低到1/10）
      asteroidField.rotation.y += 0.00005 * speedMultiplierRef.current.asteroid;

      // 星空微旋转（降低到1/10）
      stars.rotation.y += 0.00001 * speedMultiplierRef.current.stars;

      // 相机缩放动画
      if (cameraZoom > 0) {
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 10, 0.05);
      } else {
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 25, 0.05);
      }

      rendererRef.current.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // 窗口调整
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [performanceConfig]);

  // 更新鼠标坐标（归一化设备坐标）
  const updateMousePosition = (event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  // 鼠标按下
  const handleMouseDown = (event: React.MouseEvent) => {
    if (!cameraRef.current || !sceneRef.current || isTransitioning) return;

    updateMousePosition(event);
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    const intersects = raycasterRef.current.intersectObjects(
      Array.from(satelliteMeshesRef.current.values())
    );

    if (intersects.length > 0) {
      const roleId = intersects[0].object.userData.roleId as RoleType;
      const satGroup = satelliteGroupsRef.current.get(roleId);
      
      if (satGroup) {
        setIsDragging(true);
        setDraggedSatellite(roleId);
        isDraggingRef.current = true;
        draggedSatelliteRef.current = roleId;
        
        // 计算拖拽平面的法向量（相机方向）
        const cameraDirection = new THREE.Vector3();
        cameraRef.current.getWorldDirection(cameraDirection);
        dragPlaneRef.current.setFromNormalAndCoplanarPoint(
          cameraDirection,
          satGroup.position
        );
        
        // 计算鼠标射线与平面的交点
        const planeIntersectPoint = new THREE.Vector3();
        raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, planeIntersectPoint);
        
        // 保存偏移量
        dragOffsetRef.current.subVectors(satGroup.position, planeIntersectPoint);
        
        playSound(440, 0.1, 'sine');
        setShowDragHint(true);
      }
    }
  };

  // 鼠标移动
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!cameraRef.current || !sceneRef.current || isTransitioning) return;

    updateMousePosition(event);

    // 拖拽中
    if (isDragging && draggedSatellite) {
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      
      const planeIntersectPoint = new THREE.Vector3();
      raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, planeIntersectPoint);
      
      // 更新3D位置
      const newPosition = new THREE.Vector3().addVectors(
        planeIntersectPoint,
        dragOffsetRef.current
      );
      setDragPosition3D(newPosition);
      
      const satGroup = satelliteGroupsRef.current.get(draggedSatellite);
      if (satGroup) {
        satGroup.position.copy(newPosition);
      }
      
      return;
    }

    // 非拖拽时的悬停检测
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    const intersects = raycasterRef.current.intersectObjects(
      Array.from(satelliteMeshesRef.current.values())
    );

    if (intersects.length > 0) {
      const roleId = intersects[0].object.userData.roleId;
      if (roleId !== hoveredSatellite) {
        setHoveredSatellite(roleId);
        playSound(440, 0.1, 'sine');
      }
    } else if (hoveredSatellite !== null) {
      setHoveredSatellite(null);
    }
  };

  // 鼠标释放
  const handleMouseUp = () => {
    if (!isDragging || !draggedSatellite) return;

    const satGroup = satelliteGroupsRef.current.get(draggedSatellite);
    const mainPlanet = mainPlanetRef.current;
    
    if (satGroup && mainPlanet) {
      // 计算与主星球的距离
      const distance = satGroup.position.distanceTo(mainPlanet.position);
      
      // 如果距离小于3（主星球半径2 + 缓冲1）
      if (distance < 3) {
        setSelectedRole(draggedSatellite);
        setIsTransitioning(true);
        playSound(880, 0.5, 'sine');
        
        setTimeout(() => {
          onRoleSelect(draggedSatellite);
        }, 1800);
      } else {
        // 没有拖到主星球，弹回原位
        playSound(300, 0.2, 'sine');
      }
    }

    // 重置拖拽状态
    setIsDragging(false);
    setDraggedSatellite(null);
    setDragPosition3D(null);
    setShowDragHint(false);
    isDraggingRef.current = false;
    draggedSatelliteRef.current = null;
  };

  // 点击（非拖拽时）
  const handleClick = () => {
    if (hoveredSatellite && !isTransitioning && !isDragging) {
      setSelectedRole(hoveredSatellite);
      setIsTransitioning(true);
      playSound(880, 0.3, 'sine');
      
      setTimeout(() => {
        onRoleSelect(hoveredSatellite);
      }, 1800);
    }
  };

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    setCameraZoom(prev => Math.max(0, Math.min(1, prev + delta)));
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled && audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const hoveredSat = satellites.find(s => s.id === hoveredSatellite);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* WebGL 容器 */}
      <div 
        ref={containerRef} 
        className={`absolute inset-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
      />

      {/* 顶部Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none"
      >
        <h1 className="text-5xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74] drop-shadow-[0_0_30px_rgba(0,214,194,0.5)]">
          星云·AgriVerse
        </h1>
        <p className="text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          沉浸式太阳系 · 选择您的身份
        </p>
      </motion.div>

      {/* 控制按钮 */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setShowSpeedControl(!showSpeedControl)}
          className={`p-2 rounded-lg transition-all ${
            showSpeedControl
              ? 'bg-[#18FF74]/80 text-black' 
              : 'bg-white/10 text-white/40 hover:bg-white/20'
          }`}
          title="速度控制"
        >
          <Sparkles className="w-5 h-5" />
        </button>
        <button
          onClick={toggleAudio}
          className={`p-2 rounded-lg transition-all ${
            audioEnabled 
              ? 'bg-[#00D6C2]/80 text-white' 
              : 'bg-white/10 text-white/40 hover:bg-white/20'
          }`}
          title="音效开关"
        >
          {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* 性能指示器 */}
      <div className="fixed bottom-4 left-4 z-50 text-xs text-white/40">
        <p>性能档位: {performanceConfig.tier.toUpperCase()}</p>
        <p>粒子数: {performanceConfig.particleCount.toLocaleString()}</p>
      </div>

      {/* 速度控制面板 */}
      <AnimatePresence>
        {showSpeedControl && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-72 glass-morphism p-6 rounded-2xl border border-[#18FF74]/30 shadow-2xl"
          >
            <h3 className="mb-4 flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-[#18FF74]" />
              宇宙速度控制
            </h3>

            {/* 卫星公转速度 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label style={{ color: 'var(--text-secondary)' }} className="text-sm">🛸 卫星公转</label>
                <span className="text-[#00D6C2] text-sm">{speedMultiplier.satellite.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={speedMultiplier.satellite}
                onChange={(e) => setSpeedMultiplier(prev => ({ ...prev, satellite: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb-cyan"
              />
            </div>

            {/* 主星球自转 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label style={{ color: 'var(--text-secondary)' }} className="text-sm">🌍 主星球自转</label>
                <span className="text-[#18FF74] text-sm">{speedMultiplier.planet.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={speedMultiplier.planet}
                onChange={(e) => setSpeedMultiplier(prev => ({ ...prev, planet: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb-green"
              />
            </div>

            {/* 内环行星 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label style={{ color: 'var(--text-secondary)' }} className="text-sm">🪐 内环行星公转</label>
                <span className="text-[#FFA500] text-sm">{speedMultiplier.orbit.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={speedMultiplier.orbit}
                onChange={(e) => setSpeedMultiplier(prev => ({ ...prev, orbit: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb-orange"
              />
            </div>

            {/* 小行星带 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label style={{ color: 'var(--text-secondary)' }} className="text-sm">☄️ 小行星带</label>
                <span className="text-[#9D4EDD] text-sm">{speedMultiplier.asteroid.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={speedMultiplier.asteroid}
                onChange={(e) => setSpeedMultiplier(prev => ({ ...prev, asteroid: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb-purple"
              />
            </div>

            {/* 星空旋转 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label style={{ color: 'var(--text-secondary)' }} className="text-sm">⭐ 星空背景</label>
                <span style={{ color: 'var(--text-tertiary)' }} className="text-sm">{speedMultiplier.stars.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={speedMultiplier.stars}
                onChange={(e) => setSpeedMultiplier(prev => ({ ...prev, stars: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb-white"
              />
            </div>

            {/* 快捷按钮 */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setSpeedMultiplier({
                  satellite: 0,
                  planet: 0,
                  asteroid: 0,
                  stars: 0,
                  orbit: 0
                })}
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-white/10 text-white/60 hover:bg-white/20 transition-all"
              >
                ⏸️ 暂停全部
              </button>
              <button
                onClick={() => setSpeedMultiplier({
                  satellite: 1,
                  planet: 1,
                  asteroid: 1,
                  stars: 1,
                  orbit: 1
                })}
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-[#18FF74]/20 text-[#18FF74] hover:bg-[#18FF74]/30 transition-all"
              >
                ↺ 重置默认
              </button>
              <button
                onClick={() => setSpeedMultiplier({
                  satellite: 3,
                  planet: 3,
                  asteroid: 3,
                  stars: 3,
                  orbit: 3
                })}
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-[#FF2566]/20 text-[#FF2566] hover:bg-[#FF2566]/30 transition-all"
              >
                ⚡ 极速模式
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 悬停信息卡 */}
      <AnimatePresence>
        {hoveredSat && !isTransitioning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="fixed right-12 top-1/2 -translate-y-1/2 w-80 glass-morphism p-6 rounded-2xl border-2 z-10 shadow-2xl"
            style={{
              borderColor: hoveredSat.color,
              boxShadow: `0 0 40px ${hoveredSat.glowColor}, 0 20px 60px rgba(0,0,0,0.5)`
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-2xl"
                style={{
                  backgroundColor: hoveredSat.glowColor.replace('0.8', '0.2'),
                  boxShadow: `0 0 30px ${hoveredSat.glowColor}`
                }}
              >
                {hoveredSat.icon}
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-lg text-white">
                  {hoveredSat.name}
                </h3>
                <p className="text-sm text-white/60">
                  {hoveredSat.nameEn}
                </p>
              </div>
            </div>

            <p className="text-sm mb-4 text-white/80">
              {hoveredSat.description}
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${hoveredSat.color}90, ${hoveredSat.color})`,
                color: '#FFFFFF'
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>进入{hoveredSat.name}空间站</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 虫洞跃迁动画 */}
      <AnimatePresence>
        {isTransitioning && selectedRole && (
          <WormholeTransition
            satellite={satellites.find(s => s.id === selectedRole)!}
          />
        )}
      </AnimatePresence>

      {/* 拖拽提示（动态显示） */}
      <AnimatePresence>
        {showDragHint && draggedSatellite && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
          >
            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                {satellites.find(s => s.id === draggedSatellite)?.icon}
              </motion.div>
              <motion.div
                className="px-6 py-3 rounded-full glass-morphism border-2"
                style={{
                  borderColor: satellites.find(s => s.id === draggedSatellite)?.color,
                  boxShadow: `0 0 30px ${satellites.find(s => s.id === draggedSatellite)?.glowColor}`
                }}
              >
                <Hand className="w-5 h-5 inline-block mr-2 text-white" />
                <span className="text-white">拖拽到中心绿色星球触发跃迁</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部提示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none"
      >
        <motion.p 
          className="text-base mb-3 flex items-center gap-2 justify-center text-white/60"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Hand className="w-4 h-4" />
          拖拽或点击卫星 · 滚轮缩放视角
        </motion.p>
      </motion.div>
    </div>
  );
}

// 虫洞跃迁组件
function WormholeTransition({ satellite }: { satellite: Satellite }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: '#000' }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, ${satellite.color}20 50%, ${satellite.color}40 100%)`
        }}
        animate={{
          scale: [1, 2, 3],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 1.8,
          ease: [0.85, 0, 0.15, 1]
        }}
      />

      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: satellite.color,
            left: '50%',
            top: '50%'
          }}
          animate={{
            x: [0, Math.cos(i * 18 * Math.PI / 180) * 500],
            y: [0, Math.sin(i * 18 * Math.PI / 180) * 500],
            opacity: [1, 0],
            scale: [1, 0]
          }}
          transition={{
            duration: 1.5,
            ease: 'easeOut'
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center z-10"
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {satellite.icon}
        </motion.div>
        <h2 className="text-3xl mb-2" style={{ color: satellite.color }}>
          正在跃迁至{satellite.name}空间站
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Warping to {satellite.nameEn} Station...</p>
      </motion.div>
    </motion.div>
  );
}
