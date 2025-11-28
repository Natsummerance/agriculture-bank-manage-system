/**
 * 额度星球·全国热力贴图 - D2
 * 星球表面实时置换=全国农户可贷额度热力图，5分钟更新
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, MapPin, DollarSign, Activity, RefreshCw } from "lucide-react";

// 模拟全国省份热力数据
interface HeatmapData {
  province: string;
  lat: number;
  lon: number;
  creditAmount: number; // 可贷额度（万元）
  activeUsers: number;   // 活跃用户数
  growthRate: number;    // 增长率
}

const provinceData: HeatmapData[] = [
  { province: '黑龙江', lat: 47.5, lon: 128, creditAmount: 125000, activeUsers: 8500, growthRate: 12.5 },
  { province: '吉林', lat: 44, lon: 126, creditAmount: 98000, activeUsers: 6200, growthRate: 8.3 },
  { province: '辽宁', lat: 41.5, lon: 122, creditAmount: 115000, activeUsers: 7800, growthRate: 10.2 },
  { province: '内蒙古', lat: 43, lon: 112, creditAmount: 88000, activeUsers: 5100, growthRate: 6.7 },
  { province: '河北', lat: 38.5, lon: 115.5, creditAmount: 156000, activeUsers: 11200, growthRate: 15.8 },
  { province: '山东', lat: 36.5, lon: 118, creditAmount: 189000, activeUsers: 14500, growthRate: 18.9 },
  { province: '河南', lat: 34.5, lon: 113.5, creditAmount: 176000, activeUsers: 13800, growthRate: 17.2 },
  { province: '安徽', lat: 31.5, lon: 117.5, creditAmount: 132000, activeUsers: 9600, growthRate: 13.4 },
  { province: '江苏', lat: 32.5, lon: 119.5, creditAmount: 198000, activeUsers: 16200, growthRate: 21.3 },
  { province: '浙江', lat: 29.5, lon: 120.5, creditAmount: 145000, activeUsers: 10800, growthRate: 14.6 },
  { province: '湖北', lat: 31, lon: 112.5, creditAmount: 142000, activeUsers: 10200, growthRate: 13.8 },
  { province: '湖南', lat: 28, lon: 112, creditAmount: 138000, activeUsers: 9900, growthRate: 12.9 },
  { province: '江西', lat: 27.5, lon: 115.5, creditAmount: 108000, activeUsers: 7200, growthRate: 9.8 },
  { province: '四川', lat: 30.5, lon: 103, creditAmount: 165000, activeUsers: 12300, growthRate: 16.5 },
  { province: '重庆', lat: 29.5, lon: 106.5, creditAmount: 92000, activeUsers: 6500, growthRate: 8.9 },
  { province: '云南', lat: 25, lon: 101.5, creditAmount: 87000, activeUsers: 5800, growthRate: 7.1 },
  { province: '贵州', lat: 26.5, lon: 106.5, creditAmount: 76000, activeUsers: 4900, growthRate: 6.2 },
  { province: '广东', lat: 23.5, lon: 113.5, creditAmount: 212000, activeUsers: 17800, growthRate: 23.5 },
  { province: '广西', lat: 23.5, lon: 108.5, creditAmount: 95000, activeUsers: 6800, growthRate: 8.5 },
  { province: '福建', lat: 26, lon: 118.5, creditAmount: 118000, activeUsers: 8200, growthRate: 11.3 },
];

interface HeatmapSphereProps {
  autoRotate?: boolean;
  showLegend?: boolean;
}

export function HeatmapSphere({ autoRotate = true, showLegend = true }: HeatmapSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredProvince, setHoveredProvince] = useState<HeatmapData | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const animationRef = useRef<number>();

  // 模拟数据更新（每5分钟）
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        setLastUpdate(new Date());
        setIsUpdating(false);
        // 模拟数据微调
        provinceData.forEach(p => {
          p.creditAmount += Math.floor((Math.random() - 0.5) * 5000);
          p.activeUsers += Math.floor((Math.random() - 0.5) * 200);
          p.growthRate = ((Math.random() - 0.3) * 20).toFixed(1) as any;
        });
      }, 2000);
    }, 5 * 60 * 1000); // 5分钟

    return () => clearInterval(updateInterval);
  }, []);

  // 热力图渲染
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    setCanvasSize();

    let rotation = 0;
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.7;

    // 获取热力颜色
    const getHeatColor = (value: number, max: number) => {
      const ratio = value / max;
      if (ratio < 0.3) return { r: 24, g: 255, b: 116, a: 0.4 }; // 生物绿
      if (ratio < 0.6) return { r: 255, g: 215, b: 0, a: 0.6 };  // 金色
      if (ratio < 0.8) return { r: 255, g: 140, b: 0, a: 0.7 };  // 橙色
      return { r: 255, g: 37, b: 102, a: 0.9 }; // 红色（高额度区域）
    };

    const maxCredit = Math.max(...provinceData.map(p => p.creditAmount));

    const drawHeatmapSphere = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const offsetX = (mousePos.x * 0.3) / 100;
      const offsetY = (mousePos.y * 0.3) / 100;

      // 背景发光
      const bgGradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.5,
        centerX, centerY, radius * 1.5
      );
      bgGradient.addColorStop(0, 'rgba(0, 214, 194, 0.15)');
      bgGradient.addColorStop(0.5, 'rgba(24, 255, 116, 0.08)');
      bgGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // 绘制地球网格
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;

      // 纬线
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx.beginPath();
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

      // 经线
      for (let lon = 0; lon < 360; lon += 20) {
        ctx.beginPath();
        for (let lat = -80; lat <= 80; lat += 5) {
          const theta = (lon - rotation + offsetX * 20) * Math.PI / 180;
          const phi = lat * Math.PI / 180;
          
          const x = centerX + radius * Math.cos(phi) * Math.sin(theta) + offsetX;
          const y = centerY + radius * Math.sin(phi) + offsetY;
          const z = radius * Math.cos(phi) * Math.cos(theta);

          if (z > 0) {
            if (lat === -80) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // 绘制热力点（省份数据）
      provinceData.forEach((province) => {
        // 将经纬度转换为球面坐标（中国位于东经100-135，北纬18-53）
        const normalizedLon = ((province.lon - 100) / 35) * 60 + 160; // 映射到球面中心偏右
        const normalizedLat = ((province.lat - 18) / 35) * 50 + 20;    // 映射到北半球

        const theta = (normalizedLon - rotation + offsetX * 20) * Math.PI / 180;
        const phi = normalizedLat * Math.PI / 180;
        
        const x = centerX + radius * Math.cos(phi) * Math.sin(theta) + offsetX;
        const y = centerY + radius * Math.sin(phi) + offsetY;
        const z = radius * Math.cos(phi) * Math.cos(theta);

        if (z > 0) {
          const color = getHeatColor(province.creditAmount, maxCredit);
          const depth = z / radius;
          const size = 8 + (province.creditAmount / maxCredit) * 12;

          // 热力圈扩散效果
          for (let i = 3; i > 0; i--) {
            const expansionSize = size + i * 8;
            const expansionAlpha = color.a * (i / 3) * 0.3 * depth;
            
            ctx.beginPath();
            ctx.arc(x, y, expansionSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${expansionAlpha})`;
            ctx.fill();
          }

          // 核心热力点
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
          gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * depth})`);
          gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * 0.3 * depth})`);
          ctx.fillStyle = gradient;
          ctx.fill();

          // 高亮边框
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 * depth})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // 脉冲动画（高额度区域）
          if (province.creditAmount > maxCredit * 0.7) {
            const pulsePhase = (Date.now() % 2000) / 2000;
            const pulseSize = size + pulsePhase * 15;
            const pulseAlpha = (1 - pulsePhase) * 0.4 * depth;
            
            ctx.beginPath();
            ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${pulseAlpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // 检测鼠标悬停
          const distance = Math.sqrt((x - (mousePos.x + centerX)) ** 2 + (y - (mousePos.y + centerY)) ** 2);
          if (distance < size + 10) {
            setHoveredProvince(province);
          }
        }
      });

      if (autoRotate) {
        rotation += 0.15;
      }

      animationRef.current = requestAnimationFrame(drawHeatmapSphere);
    };

    drawHeatmapSphere();

    window.addEventListener('resize', setCanvasSize);
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos, autoRotate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  return (
    <div className="relative w-full h-full">
      {/* Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setMousePos({ x: 0, y: 0 });
          setHoveredProvince(null);
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.8), black)' }}
        />
      </motion.div>

      {/* 标题 */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 mb-1"
        >
          <Activity className="w-5 h-5 text-[#00D6C2]" />
          全国额度热力图
        </motion.h3>
        <p className="text-sm text-white/60">
          实时数据 · 5分钟更新
        </p>
      </div>

      {/* 更新状态 */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <motion.div
          animate={{ rotate: isUpdating ? 360 : 0 }}
          transition={{ duration: 1, repeat: isUpdating ? Infinity : 0, ease: "linear" }}
        >
          <RefreshCw className={`w-4 h-4 ${isUpdating ? 'text-[#18FF74]' : 'text-white/40'}`} />
        </motion.div>
        <span className="text-xs text-white/60 font-mono">
          {lastUpdate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* 图例 */}
      {showLegend && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-6 left-6 glass-morphism p-4 rounded-xl border border-white/10"
        >
          <h4 className="text-sm text-white/80 mb-3">额度范围（万元）</h4>
          <div className="space-y-2">
            {[
              { label: '< 10万', color: 'rgba(24, 255, 116, 0.6)' },
              { label: '10-15万', color: 'rgba(255, 215, 0, 0.6)' },
              { label: '15-18万', color: 'rgba(255, 140, 0, 0.7)' },
              { label: '> 18万', color: 'rgba(255, 37, 102, 0.8)' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-white/70">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 统计面板 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-6 right-6 glass-morphism p-4 rounded-xl border border-white/10 min-w-[200px]"
      >
        <div className="space-y-3">
          <div>
            <div className="text-xs text-white/60 mb-1">总额度池</div>
            <div className="text-xl text-[#00D6C2]">
              ¥{(provinceData.reduce((sum, p) => sum + p.creditAmount, 0) / 10000).toFixed(0)}万
            </div>
          </div>
          <div>
            <div className="text-xs text-white/60 mb-1">活跃用户</div>
            <div className="text-xl text-[#18FF74]">
              {provinceData.reduce((sum, p) => sum + p.activeUsers, 0).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-white/60 mb-1">平均增长</div>
            <div className="flex items-center gap-1 text-lg text-white">
              <TrendingUp className="w-4 h-4 text-[#FFD700]" />
              {(provinceData.reduce((sum, p) => sum + Number(p.growthRate), 0) / provinceData.length).toFixed(1)}%
            </div>
          </div>
        </div>
      </motion.div>

      {/* 悬停详情卡片 */}
      <AnimatePresence>
        {hoveredProvince && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 glass-morphism p-4 rounded-xl border-2 border-[#00D6C2] min-w-[250px] pointer-events-none z-10"
          >
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-[#00D6C2]" />
              <h4>{hoveredProvince.province}</h4>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-white/60">可贷额度</span>
                <span className="text-[#00D6C2]">
                  ¥{(hoveredProvince.creditAmount / 10000).toFixed(0)}万
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">活跃用户</span>
                <span className="text-white">{hoveredProvince.activeUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">增长率</span>
                <span className="text-[#18FF74] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {hoveredProvince.growthRate}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
