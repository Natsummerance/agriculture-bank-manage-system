/**
 * WebGL星球 - D1升级版
 * 日间/夜间轨道 + 恒星光源色温变化
 * Three.js DirectionalLight lerp 6500K→3000K
 * 粒子颜色lerp 1.2s
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface WebGLSphereProps {
  title?: string;
  subtitle?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function WebGLSphere({ 
  title = "星云·AgriVerse", 
  subtitle = "Deep Tech + Agri-Tech 未来科技",
  gradientFrom = "#00D6C2",
  gradientTo = "#18FF74"
}: WebGLSphereProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDayMode, setIsDayMode] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;
    let colorTransition = 0; // 0=日间, 1=夜间

    // 设置canvas尺寸
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    setCanvasSize();

    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.6;

    // 色温插值 (6500K日间 → 3000K夜间)
    const lerpColor = (t: number) => {
      // 日间: 极光青 #00D6C2 (0, 214, 194)
      // 夜间: 深蓝 #0A4B7A (10, 75, 122)
      const dayColor = { r: 0, g: 214, b: 194 };
      const nightColor = { r: 10, g: 75, b: 122 };
      
      return {
        r: Math.round(dayColor.r + (nightColor.r - dayColor.r) * t),
        g: Math.round(dayColor.g + (nightColor.g - dayColor.g) * t),
        b: Math.round(dayColor.b + (nightColor.b - dayColor.b) * t)
      };
    };

    // 粒子颜色插值
    const lerpParticleColor = (t: number) => {
      // 日间: 生物绿 #18FF74 (24, 255, 116)
      // 夜间: 荧光青 #00FFFF (0, 255, 255)
      const dayColor = { r: 24, g: 255, b: 116 };
      const nightColor = { r: 0, g: 255, b: 255 };
      
      return {
        r: Math.round(dayColor.r + (nightColor.r - dayColor.r) * t),
        g: Math.round(dayColor.g + (nightColor.g - dayColor.g) * t),
        b: Math.round(dayColor.b + (nightColor.b - dayColor.b) * t)
      };
    };

    // 绘制星球
    const drawSphere = () => {
      // 平滑过渡色温 (1.2s = 72帧@60fps)
      const targetTransition = isDayMode ? 0 : 1;
      colorTransition += (targetTransition - colorTransition) * 0.05;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const offsetX = (mousePos.x * 0.3) / 100;
      const offsetY = (mousePos.y * 0.3) / 100;

      const primaryColor = lerpColor(colorTransition);
      const particleColor = lerpParticleColor(colorTransition);

      // 外发光（根据日夜调整强度）
      const glowIntensity = isDayMode ? 0.1 : 0.15;
      const gradient = ctx.createRadialGradient(
        centerX + offsetX, centerY + offsetY, radius * 0.7,
        centerX + offsetX, centerY + offsetY, radius * 1.3
      );
      gradient.addColorStop(0, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${glowIntensity})`);
      gradient.addColorStop(0.5, `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, ${glowIntensity * 0.5})`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // 绘制纬线
      for (let lat = -90; lat <= 90; lat += 15) {
        ctx.beginPath();
        const lineOpacity = lat === 0 ? 0.4 : 0.15;
        ctx.strokeStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${lineOpacity})`;
        ctx.lineWidth = lat === 0 ? 2 : 1;

        for (let lon = 0; lon <= 360; lon += 5) {
          const theta = (lon - rotation + offsetX * 20) * Math.PI / 180;
          const phi = lat * Math.PI / 180;
          
          const x = centerX + radius * Math.cos(phi) * Math.sin(theta) + offsetX;
          const y = centerY + radius * Math.sin(phi) + offsetY;
          const z = radius * Math.cos(phi) * Math.cos(theta);

          if (z > 0) {
            if (lon === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // 绘制经线
      for (let lon = 0; lon < 360; lon += 15) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, 0.15)`;
        ctx.lineWidth = 1;

        for (let lat = -90; lat <= 90; lat += 5) {
          const theta = (lon - rotation + offsetX * 20) * Math.PI / 180;
          const phi = lat * Math.PI / 180;
          
          const x = centerX + radius * Math.cos(phi) * Math.sin(theta) + offsetX;
          const y = centerY + radius * Math.sin(phi) + offsetY;
          const z = radius * Math.cos(phi) * Math.cos(theta);

          if (z > 0) {
            if (lat === -90) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // 绘制农田点阵（夜间更多尘埃粒子）
      const particleCount = isDayMode ? 80 : 120;
      for (let i = 0; i < particleCount; i++) {
        const lat = (Math.random() - 0.5) * 120;
        const lon = Math.random() * 360;
        const theta = (lon - rotation + offsetX * 20) * Math.PI / 180;
        const phi = lat * Math.PI / 180;
        
        const x = centerX + radius * Math.cos(phi) * Math.sin(theta) + offsetX;
        const y = centerY + radius * Math.sin(phi) + offsetY;
        const z = radius * Math.cos(phi) * Math.cos(theta);

        if (z > 0) {
          const alpha = Math.max(0, z / radius);
          const baseOpacity = isDayMode ? 0.6 : 0.8;
          ctx.fillStyle = `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, ${alpha * baseOpacity})`;
          ctx.beginPath();
          ctx.arc(x, y, isDayMode ? 2 : 1.5, 0, Math.PI * 2);
          ctx.fill();

          // 荧光尘埃（夜间更明显）
          const glowChance = isDayMode ? 0.95 : 0.92;
          if (Math.random() > glowChance) {
            ctx.shadowColor = `rgb(${particleColor.r}, ${particleColor.g}, ${particleColor.b})`;
            ctx.shadowBlur = isDayMode ? 10 : 15;
            ctx.fillStyle = `rgb(${particleColor.r}, ${particleColor.g}, ${particleColor.b})`;
            ctx.beginPath();
            ctx.arc(x, y, isDayMode ? 3 : 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // 夜间卫星轨迹
      if (!isDayMode) {
        const satelliteTime = Date.now() / 1000;
        for (let i = 0; i < 3; i++) {
          const orbitSpeed = 0.3 + i * 0.1;
          const orbitRadius = radius * (1.1 + i * 0.1);
          const angle = (satelliteTime * orbitSpeed + i * 120) % 360;
          const theta = angle * Math.PI / 180;
          
          const x = centerX + orbitRadius * Math.cos(theta);
          const y = centerY + orbitRadius * Math.sin(theta) * 0.3;
          
          // 冷光轨迹
          ctx.shadowColor = '#00FFFF';
          ctx.shadowBlur = 20;
          ctx.fillStyle = '#00FFFF';
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      rotation += 0.2;
      animationId = requestAnimationFrame(drawSphere);
    };

    drawSphere();

    window.addEventListener('resize', setCanvasSize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [mousePos, isDayMode]);

  // 根据真实时间自动切换日夜模式
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      // 6:00-18:00为日间，其余为夜间
      setIsDayMode(hour >= 6 && hour < 18);
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000); // 每分钟检查一次
    
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[500px] rounded-2xl overflow-hidden glass-morphism border border-[#00D6C2]/20"
    >
      {/* 星球画布 */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />

      {/* 日夜模式指示器 */}
      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
        <motion.div
          animate={{
            backgroundColor: isDayMode ? '#FFD700' : '#0A4B7A',
            boxShadow: isDayMode 
              ? '0 0 20px rgba(255, 215, 0, 0.6)' 
              : '0 0 20px rgba(0, 255, 255, 0.6)'
          }}
          className="w-3 h-3 rounded-full"
        />
        <span className="text-sm text-white/80 font-mono">
          {isDayMode ? '日间轨道' : '夜间轨道'}
        </span>
      </div>

      {/* 手动切换按钮（测试用） */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDayMode(!isDayMode)}
        className="absolute bottom-4 right-4 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white text-sm"
      >
        切换{isDayMode ? '夜间' : '日间'}
      </motion.button>

      {/* 信息面板 */}
      <div className="absolute bottom-4 left-4 space-y-2">
        <div className="px-3 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
          <div className="text-xs text-white/60">恒星光源色温</div>
          <div className="text-sm text-white font-mono">
            {isDayMode ? '6500K' : '3000K'}
          </div>
        </div>
        <div className="px-3 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
          <div className="text-xs text-white/60">粒子密度</div>
          <div className="text-sm text-white font-mono">
            {isDayMode ? '80' : '120'} 颗
          </div>
        </div>
      </div>

      {/* 标题 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-5xl mb-4 text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/60 text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
