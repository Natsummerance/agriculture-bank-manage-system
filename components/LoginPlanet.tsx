/**
 * 星球登录 - Planet + 5 Satellites + 拖拽跃迁
 * 核心星球 + 五角色卫星轨道 + 虫洞跃迁 + 拖拽交互
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Sparkles, Hand } from "lucide-react";

type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin' | null;

interface Satellite {
  id: RoleType;
  name: string;
  nameEn: string;
  color: string;
  glowColor: string;
  angle: number;
  speed: number;
  orbitA: number; // 椭圆长半轴
  orbitB: number; // 椭圆短半轴
  description: string;
  icon: string;
}

const satellites: Satellite[] = [
  {
    id: 'farmer',
    name: '农户',
    nameEn: 'Farmer',
    color: '#18FF74',
    glowColor: 'rgba(24, 255, 116, 0.6)',
    angle: 0,
    speed: 0.15,
    orbitA: 280,
    orbitB: 200,
    description: '农业生产者 · 融资交易',
    icon: '🌾'
  },
  {
    id: 'buyer',
    name: '买家',
    nameEn: 'Buyer',
    color: '#00D6C2',
    glowColor: 'rgba(0, 214, 194, 0.6)',
    angle: 72,
    speed: 0.175,
    orbitA: 320,
    orbitB: 220,
    description: '商品采购者 · 订单管理',
    icon: '🛒'
  },
  {
    id: 'bank',
    name: '银行',
    nameEn: 'Bank',
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    angle: 144,
    speed: 0.125,
    orbitA: 300,
    orbitB: 210,
    description: '金融机构 · 联合贷款',
    icon: '🏦'
  },
  {
    id: 'expert',
    name: '专家',
    nameEn: 'Expert',
    color: '#FF2566',
    glowColor: 'rgba(255, 37, 102, 0.6)',
    angle: 216,
    speed: 0.2,
    orbitA: 340,
    orbitB: 230,
    description: '农业顾问 · 知识服务',
    icon: '👨‍🔬'
  },
  {
    id: 'admin',
    name: '管理员',
    nameEn: 'Admin',
    color: '#9D4EDD',
    glowColor: 'rgba(157, 78, 221, 0.6)',
    angle: 288,
    speed: 0.1,
    orbitA: 260,
    orbitB: 190,
    description: '系统管理 · 运营控制',
    icon: '⚙️'
  }
];

export function LoginPlanet({ onRoleSelect }: { onRoleSelect: (role: RoleType) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSatellite, setHoveredSatellite] = useState<RoleType>(null);
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [draggedSatellite, setDraggedSatellite] = useState<RoleType>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [debugMode, setDebugMode] = useState(false); // 调试模式
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 统一中心点计算（确保渲染和交互使用相同坐标）
    const getCenter = () => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: rect.width / 2,
        y: rect.height / 2
      };
    };

    const setCanvasSize = () => {
      // 使用CSS尺寸而非物理像素，避免坐标系混淆
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    setCanvasSize();

    // 绘制星空背景
    const drawStarfield = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // 固定星星（减少闪烁）
      for (let i = 0; i < 200; i++) {
        const x = (i * 137.508) % window.innerWidth;
        const y = (i * 271.214) % window.innerHeight;
        const size = (i % 3) * 0.5 + 0.5;
        const alpha = 0.3 + (i % 5) * 0.15;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // 绘制核心星球
    const drawCorePlanet = () => {
      const { x: centerX, y: centerY } = getCenter();
      const planetRadius = 80;

      // 调试模式：绘制中心十字准星
      if (debugMode) {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 20, centerY);
        ctx.lineTo(centerX + 20, centerY);
        ctx.moveTo(centerX, centerY - 20);
        ctx.lineTo(centerX, centerY + 20);
        ctx.stroke();

        // 绘制交互范围圆
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 130, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // 拖拽时的接收区域高亮
      if (isDragging && dragPosition) {
        const distance = Math.sqrt((dragPosition.x - centerX) ** 2 + (dragPosition.y - centerY) ** 2);
        if (distance < planetRadius + 50) {
          // 接收高亮
          const highlightGradient = ctx.createRadialGradient(
            centerX, centerY, planetRadius,
            centerX, centerY, planetRadius * 2.5
          );
          const draggedSat = satellites.find(s => s.id === draggedSatellite);
          if (draggedSat) {
            highlightGradient.addColorStop(0, draggedSat.glowColor);
            highlightGradient.addColorStop(0.5, draggedSat.glowColor.replace('0.6', '0.3'));
            highlightGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = highlightGradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, planetRadius * 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 星球发光
      const gradient = ctx.createRadialGradient(
        centerX, centerY, planetRadius * 0.5,
        centerX, centerY, planetRadius * 2
      );
      gradient.addColorStop(0, 'rgba(0, 214, 194, 0.3)');
      gradient.addColorStop(0.5, 'rgba(24, 255, 116, 0.15)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, planetRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // 星球主体
      const planetGradient = ctx.createRadialGradient(
        centerX - 20, centerY - 20, 0,
        centerX, centerY, planetRadius
      );
      planetGradient.addColorStop(0, '#00FFD6');
      planetGradient.addColorStop(0.5, '#00D6C2');
      planetGradient.addColorStop(1, '#0A4B7A');
      ctx.fillStyle = planetGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, planetRadius, 0, Math.PI * 2);
      ctx.fill();

      // 星球网格
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI;
        const radiusX = Math.abs(planetRadius * Math.cos(angle));
        const radiusY = planetRadius;
        if (radiusX > 0) {
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, radiusX, radiusY, angle, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 中央文字（优化尺寸 + 精确居中）
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      
      // 测量标题文字
      const titleMetrics = ctx.measureText('AgriVerse');
      const titleHeight = titleMetrics.actualBoundingBoxAscent + titleMetrics.actualBoundingBoxDescent;
      const titleOffsetY = titleMetrics.actualBoundingBoxAscent - titleHeight / 2;
      ctx.fillText('AgriVerse', centerX, centerY + titleOffsetY - 8);
      
      // 测量副标题文字
      ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      const subtitleMetrics = ctx.measureText('星云农业宇宙');
      const subtitleHeight = subtitleMetrics.actualBoundingBoxAscent + subtitleMetrics.actualBoundingBoxDescent;
      const subtitleOffsetY = subtitleMetrics.actualBoundingBoxAscent - subtitleHeight / 2;
      ctx.fillText('星云农业宇宙', centerX, centerY + subtitleOffsetY + 10);
    };

    // 绘制卫星轨道
    const drawOrbits = () => {
      const { x: centerX, y: centerY } = getCenter();
      
      satellites.forEach(satellite => {
        ctx.strokeStyle = satellite.glowColor.replace('0.6', '0.15');
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, satellite.orbitA, satellite.orbitB, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    };

    // 绘制卫星
    const drawSatellites = (time: number) => {
      const { x: centerX, y: centerY } = getCenter();
      
      satellites.forEach(satellite => {
        // 跳过正在被拖拽的卫星（在HTML层渲染）
        if (isDragging && draggedSatellite === satellite.id) return;

        const angle = (satellite.angle + time * satellite.speed) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * satellite.orbitA;
        const y = centerY + Math.sin(angle) * satellite.orbitB;

        const isHovered = hoveredSatellite === satellite.id;
        // 呼吸脉冲效果
        const breatheScale = 1 + Math.sin(time * 1.5 + satellite.angle) * 0.08;
        const satelliteRadius = isHovered ? 40 * breatheScale : 32 * breatheScale;

        // 调试模式：绘制交互检测圆
        if (debugMode) {
          ctx.strokeStyle = '#FFFF00';
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.arc(x, y, 60, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // 卫星发光
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, satelliteRadius * 2.5);
        glowGradient.addColorStop(0, satellite.glowColor);
        glowGradient.addColorStop(0.5, satellite.glowColor.replace('0.6', '0.3'));
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, satelliteRadius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 牵引光束（悬停时）
        if (isHovered && !isDragging) {
          ctx.strokeStyle = satellite.glowColor.replace('0.6', '0.4');
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.stroke();

          // 光束粒子
          for (let i = 0; i < 5; i++) {
            const t = ((time * 2 + i * 20) % 100) / 100;
            const px = centerX + (x - centerX) * t;
            const py = centerY + (y - centerY) * t;
            ctx.fillStyle = satellite.color;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 卫星主体
        ctx.fillStyle = satellite.color;
        ctx.beginPath();
        ctx.arc(x, y, satelliteRadius, 0, Math.PI * 2);
        ctx.fill();

        // 卫星边框
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 卫星图标（人为缩小4倍 + 精确居中）
        const iconSize = satelliteRadius * 0.4;
        ctx.font = `${iconSize}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        
        // 精确测量文字边界
        const metrics = ctx.measureText(satellite.icon);
        const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const offsetY = metrics.actualBoundingBoxAscent - actualHeight / 2;
        
        ctx.fillText(satellite.icon, x, y + offsetY);

        // 粒子尾迹
        for (let i = 0; i < 3; i++) {
          const trailAngle = angle - (i * 0.1);
          const trailX = centerX + Math.cos(trailAngle) * satellite.orbitA;
          const trailY = centerY + Math.sin(trailAngle) * satellite.orbitB;
          const alpha = 0.3 - i * 0.1;
          ctx.fillStyle = satellite.glowColor.replace('0.6', alpha.toString());
          ctx.beginPath();
          ctx.arc(trailX, trailY, 4 - i, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    // 主渲染循环
    const render = () => {
      if (isTransitioning) return;

      drawStarfield();
      drawOrbits();
      drawCorePlanet();
      drawSatellites(timeRef.current);

      timeRef.current += 1;
      animationRef.current = requestAnimationFrame(render);
    };

    render();
    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hoveredSatellite, isTransitioning, isDragging, draggedSatellite, dragPosition]);

  // 获取统一的中心点（与Canvas渲染完全一致）
  const getCenter = () => {
    if (!canvasRef.current) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: rect.width / 2,
      y: rect.height / 2
    };
  };

  // 计算卫星位置用于鼠标检测（使用统一中心点）
  const getSatellitePosition = (satellite: Satellite) => {
    const center = getCenter();
    const angle = (satellite.angle + timeRef.current * satellite.speed) * Math.PI / 180;
    return {
      x: center.x + Math.cos(angle) * satellite.orbitA,
      y: center.y + Math.sin(angle) * satellite.orbitB
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTransitioning) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 更新拖拽位置
    if (isDragging) {
      setDragPosition({ x: mouseX, y: mouseY });
      return;
    }

    let foundHover = false;
    for (const satellite of satellites) {
      const pos = getSatellitePosition(satellite);
      const distance = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
      if (distance < 60) {
        setHoveredSatellite(satellite.id);
        foundHover = true;
        break;
      }
    }

    if (!foundHover) {
      setHoveredSatellite(null);
    }
  };

  // 鼠标按下开始拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isTransitioning) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (const satellite of satellites) {
      const pos = getSatellitePosition(satellite);
      const distance = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
      if (distance < 60) {
        setDraggedSatellite(satellite.id);
        setIsDragging(true);
        setDragPosition({ x: mouseX, y: mouseY });
        break;
      }
    }
  };

  // 鼠标释放结束拖拽
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !draggedSatellite) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // 使用统一的中心点计算
    const center = getCenter();
    const distance = Math.sqrt((mouseX - center.x) ** 2 + (mouseY - center.y) ** 2);

    // 检查是否拖到主星球上（距离小于130px = 星球半径80 + 缓冲50）
    if (distance < 130) {
      setSelectedRole(draggedSatellite);
      setIsTransitioning(true);
      
      setTimeout(() => {
        onRoleSelect(draggedSatellite);
      }, 1800);
    }

    // 重置拖拽状态
    setIsDragging(false);
    setDraggedSatellite(null);
    setDragPosition(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isTransitioning || !hoveredSatellite || isDragging) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (const satellite of satellites) {
      const pos = getSatellitePosition(satellite);
      const distance = Math.sqrt((mouseX - pos.x) ** 2 + (mouseY - pos.y) ** 2);
      if (distance < 60) {
        setSelectedRole(satellite.id);
        setIsTransitioning(true);
        
        setTimeout(() => {
          onRoleSelect(satellite.id);
        }, 1800);
        break;
      }
    }
  };

  const hoveredSat = satellites.find(s => s.id === hoveredSatellite);
  const draggedSat = satellites.find(s => s.id === draggedSatellite);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Canvas背景 */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 transition-all ${
          isDragging ? 'cursor-grabbing' : hoveredSatellite ? 'cursor-grab' : 'cursor-default'
        }`}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
      />

      {/* 拖拽中的卫星（HTML层） */}
      <AnimatePresence>
        {isDragging && draggedSat && dragPosition && (
          <motion.div
            className="fixed pointer-events-none z-50"
            style={{
              left: dragPosition.x,
              top: dragPosition.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 1 }}
            animate={{ 
              scale: 1.2,
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              rotate: {
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
              style={{
                backgroundColor: draggedSat.color,
                boxShadow: `0 0 60px ${draggedSat.glowColor}, 0 0 100px ${draggedSat.glowColor}`
              }}
            >
              {draggedSat.icon}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 顶部Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none"
      >
        <h1 className="text-5xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74] drop-shadow-[0_0_30px_rgba(0,214,194,0.5)]">
          星云·AgriVerse
        </h1>
        <p className="text-white/70 text-base">选择您的身份进入系统</p>
      </motion.div>

      {/* 调试按钮（按 D 键切换） */}
      <div
        className="fixed top-4 right-4 z-50 pointer-events-auto"
        onKeyDown={(e) => {
          if (e.key === 'd' || e.key === 'D') {
            setDebugMode(!debugMode);
          }
        }}
        tabIndex={0}
      >
        <button
          onClick={() => setDebugMode(!debugMode)}
          className={`px-3 py-1.5 rounded text-xs transition-all ${
            debugMode 
              ? 'bg-red-500/80 text-white' 
              : 'bg-white/10 text-white/40 hover:bg-white/20'
          }`}
        >
          {debugMode ? '🎯 调试模式开启' : '调试'}
        </button>
      </div>

      {/* 悬停信息卡 */}
      <AnimatePresence>
        {hoveredSat && !isTransitioning && !isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="fixed right-12 top-1/2 -translate-y-1/2 w-80 glass-morphism p-6 rounded-2xl border-2 z-10 shadow-2xl"
            style={{
              borderColor: hoveredSat.color,
              boxShadow: `0 0 40px ${hoveredSat.glowColor}, 0 20px 60px rgba(0,0,0,0.5)`
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: hoveredSat.glowColor.replace('0.6', '0.2'),
                  boxShadow: `0 0 30px ${hoveredSat.glowColor}`,
                  fontSize: '20px',
                  lineHeight: '1'
                }}
              >
                <span 
                  className="block" 
                  style={{ 
                    lineHeight: '1',
                    transform: 'translateY(-1px)'
                  }}
                >
                  {hoveredSat.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white mb-1 text-lg">{hoveredSat.name}</h3>
                <p className="text-white/60 text-sm">{hoveredSat.nameEn}</p>
              </div>
            </div>

            <p className="text-white/80 text-sm mb-4">{hoveredSat.description}</p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-white transition-all"
              style={{
                background: `linear-gradient(135deg, ${hoveredSat.color}90, ${hoveredSat.color})`
              }}
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-center">进入{hoveredSat.name}空间站</span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </motion.button>

            {/* 拖拽提示 */}
            <div className="mt-3 flex items-center justify-center gap-2 text-white/40 text-xs">
              <Hand className="w-3 h-3" />
              <span>或拖拽卫星到主星球</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 拖拽提示覆盖层 */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-white/80 text-xl">拖到这里进入空间站</p>
              </motion.div>
            </div>
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

      {/* 底部提示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none"
      >
        <motion.p 
          className="text-white/60 text-base mb-3"
          animate={{
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {isDragging 
            ? '释放到主星球跃迁 · 或释放回轨道' 
            : '点击或拖拽卫星进入空间站'
          }
        </motion.p>
        <div className="flex items-center justify-center gap-6 text-sm text-white/40">
          <span className="flex items-center gap-1.5">
            <span 
              className="inline-flex items-center justify-center" 
              style={{ 
                fontSize: '12px', 
                lineHeight: '1',
                width: '14px',
                height: '14px',
                transform: 'translateY(0.5px)'
              }}
            >🌾</span>
            <span>农户</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span 
              className="inline-flex items-center justify-center" 
              style={{ 
                fontSize: '12px', 
                lineHeight: '1',
                width: '14px',
                height: '14px',
                transform: 'translateY(0.5px)'
              }}
            >🛒</span>
            <span>买家</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span 
              className="inline-flex items-center justify-center" 
              style={{ 
                fontSize: '12px', 
                lineHeight: '1',
                width: '14px',
                height: '14px',
                transform: 'translateY(0.5px)'
              }}
            >🏦</span>
            <span>银行</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span 
              className="inline-flex items-center justify-center" 
              style={{ 
                fontSize: '12px', 
                lineHeight: '1',
                width: '14px',
                height: '14px',
                transform: 'translateY(0.5px)'
              }}
            >👨‍🔬</span>
            <span>专家</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span 
              className="inline-flex items-center justify-center" 
              style={{ 
                fontSize: '12px', 
                lineHeight: '1',
                width: '14px',
                height: '14px',
                transform: 'translateY(0.5px)'
              }}
            >⚙️</span>
            <span>管理员</span>
          </span>
        </div>
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
      {/* 星际拉丝效果 */}
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

      {/* 粒子爆发 */}
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
            x: [0, (Math.cos(i * 18 * Math.PI / 180) * 500)],
            y: [0, (Math.sin(i * 18 * Math.PI / 180) * 500)],
            opacity: [1, 0],
            scale: [1, 0]
          }}
          transition={{
            duration: 1.5,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* 中央文字 */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center z-10"
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity
          }}
        >
          {satellite.icon}
        </motion.div>
        <h2
          className="text-3xl mb-2"
          style={{ color: satellite.color }}
        >
          正在跃迁至{satellite.name}空间站
        </h2>
        <p className="text-white/60">Warping to {satellite.nameEn} Station...</p>
      </motion.div>
    </motion.div>
  );
}
