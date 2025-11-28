import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Target, TrendingUp, AlertCircle, Zap } from "lucide-react";

interface Demand {
  id: number;
  farmerName: string;
  amount: number;
  creditScore: number;
  urgency: number;
  distance: number;
  profit: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export function BankRadar() {
  const [scanning, setScanning] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [grabbedDemands, setGrabbedDemands] = useState<number[]>([]);
  const [charging, setCharging] = useState(false);

  // 模拟雷达扫描
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
      
      // 每2秒生成新需求
      if (rotation % 72 === 0 && demands.length < 12) {
        const newDemand: Demand = {
          id: Date.now(),
          farmerName: ['张农户', '李农场', '王合作社', '赵种植园'][Math.floor(Math.random() * 4)],
          amount: Math.floor(Math.random() * 500000) + 100000,
          creditScore: Math.floor(Math.random() * 100),
          urgency: Math.random(),
          distance: Math.random() * 80 + 20,
          profit: Math.floor(Math.random() * 50000) + 5000,
          riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any
        };
        setDemands(prev => [...prev, newDemand]);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [rotation, demands.length]);

  const handleGrab = async (demand: Demand) => {
    setCharging(true);
    
    // 充能动画
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setGrabbedDemands(prev => [...prev, demand.id]);
    setCharging(false);
    setSelectedDemand(null);
    
    // 飞入动画后移除
    setTimeout(() => {
      setDemands(prev => prev.filter(d => d.id !== demand.id));
    }, 800);
  };

  const getCreditColor = (score: number) => {
    if (score >= 80) return '#18FF74';
    if (score >= 60) return '#FFD700';
    return '#FF2566';
  };

  const getRiskColor = (level: string) => {
    if (level === 'low') return '#18FF74';
    if (level === 'medium') return '#FFD700';
    return '#FF2566';
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-[#000000]">
      <div className="max-w-7xl mx-auto">
        {/* HUD标题 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 border-b border-[#00D6C2]/30 pb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-[#18FF74] animate-pulse" />
              <h2 className="font-mono text-[#00D6C2]">BANK RADAR SYSTEM</h2>
              <span className="text-xs text-white/40 font-mono">v2.5.0</span>
            </div>
            <div className="flex items-center gap-6 text-sm font-mono">
              <div className="flex items-center gap-2">
                <span className="text-white/40">ACTIVE:</span>
                <span className="text-[#18FF74]">{demands.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40">GRABBED:</span>
                <span className="text-[#FFD700]">{grabbedDemands.length}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 雷达主体 */}
          <div className="lg:col-span-2">
            <div className="relative w-full aspect-square max-w-3xl mx-auto">
              {/* 雷达圈层 */}
              <svg className="absolute inset-0 w-full h-full">
                {/* 背景圆圈 */}
                {[20, 40, 60, 80, 100].map((r, i) => (
                  <circle
                    key={i}
                    cx="50%"
                    cy="50%"
                    r={`${r / 2}%`}
                    fill="none"
                    stroke={i === 4 ? 'rgba(0, 214, 194, 0.3)' : 'rgba(0, 214, 194, 0.1)'}
                    strokeWidth={i === 4 ? '2' : '1'}
                  />
                ))}

                {/* 扫描扇形 */}
                <motion.path
                  d={`M 50% 50% L 50% 0% A 50% 50% 0 0 1 ${
                    50 + 50 * Math.cos((rotation - 90) * Math.PI / 180)
                  }% ${
                    50 + 50 * Math.sin((rotation - 90) * Math.PI / 180)
                  }% Z`}
                  fill="url(#scanGradient)"
                  animate={{ rotate: rotation }}
                  transition={{ duration: 0.05, ease: "linear" }}
                  style={{ transformOrigin: "50% 50%" }}
                />

                <defs>
                  <radialGradient id="scanGradient">
                    <stop offset="0%" stopColor="rgba(0, 214, 194, 0.3)" />
                    <stop offset="100%" stopColor="rgba(0, 214, 194, 0)" />
                  </radialGradient>
                </defs>

                {/* 十字线 */}
                <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="rgba(0, 214, 194, 0.2)" strokeWidth="1" />
                <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(0, 214, 194, 0.2)" strokeWidth="1" />
              </svg>

              {/* 需求光点 */}
              <div className="absolute inset-0">
                <AnimatePresence>
                  {demands.map((demand) => {
                    const angle = (demand.id % 360) * Math.PI / 180;
                    const x = 50 + (demand.distance / 2) * Math.cos(angle);
                    const y = 50 + (demand.distance / 2) * Math.sin(angle);
                    const size = 8 + demand.urgency * 8;
                    const color = getCreditColor(demand.creditScore);
                    const isGrabbed = grabbedDemands.includes(demand.id);

                    return (
                      <motion.div
                        key={demand.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isGrabbed ? {
                          x: '200%',
                          y: '-100%',
                          scale: 0,
                          opacity: 0
                        } : {
                          scale: 1,
                          opacity: 1
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="absolute cursor-pointer group"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onClick={() => setSelectedDemand(demand)}
                      >
                        {/* 光点主体 */}
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            boxShadow: [
                              `0 0 10px ${color}`,
                              `0 0 20px ${color}`,
                              `0 0 10px ${color}`
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="rounded-full"
                          style={{
                            width: size,
                            height: size,
                            background: color
                          }}
                        />

                        {/* 脉冲波 */}
                        <motion.div
                          animate={{
                            scale: [1, 2],
                            opacity: [0.6, 0]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border-2"
                          style={{ borderColor: color }}
                        />

                        {/* Hover信息 */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded-lg bg-black/90 backdrop-blur-sm whitespace-nowrap text-xs border border-[#00D6C2]/30 z-10"
                        >
                          <div className="text-[#00D6C2]">{demand.farmerName}</div>
                          <div className="text-white/60">¥{(demand.amount / 10000).toFixed(0)}万</div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* 中心HUD */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <Target className="w-12 h-12 mx-auto mb-2 text-[#00D6C2]" />
                <div className="font-mono text-xs text-white/40">SCANNING...</div>
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="font-mono text-sm text-[#00D6C2] mt-1"
                >
                  {demands.length} TARGETS
                </motion.div>
              </div>
            </div>
          </div>

          {/* 战术面板 */}
          <div className="space-y-4">
            <div className="border border-[#00D6C2]/30 rounded-lg p-4 bg-black/50">
              <h4 className="font-mono text-[#00D6C2] mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#18FF74]" />
                TACTICAL PANEL
              </h4>

              {selectedDemand ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* 需求摘要 */}
                  <div className="p-3 rounded bg-white/5 border border-white/10">
                    <div className="text-sm text-white/40 mb-1">TARGET</div>
                    <div className="text-white mb-2">{selectedDemand.farmerName}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-white/60">信用评分:</span>
                      <span 
                        className="font-mono"
                        style={{ color: getCreditColor(selectedDemand.creditScore) }}
                      >
                        {selectedDemand.creditScore}
                      </span>
                    </div>
                  </div>

                  {/* 预估收益 */}
                  <div className="p-3 rounded bg-gradient-to-r from-[#FFD700]/10 to-[#FF8C00]/10 border border-[#FFD700]/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#FFD700]" />
                        <span className="text-sm text-white/60">预估收益</span>
                      </div>
                      <span className="font-mono text-[#FFD700]">
                        ¥{selectedDemand.profit.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00]"
                        style={{ width: `${(selectedDemand.profit / 50000) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* 风险星级 */}
                  <div className="p-3 rounded bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" style={{ color: getRiskColor(selectedDemand.riskLevel) }} />
                        <span className="text-sm text-white/60">风险等级</span>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-6 rounded-full"
                            style={{
                              background: i < (selectedDemand.riskLevel === 'high' ? 3 : selectedDemand.riskLevel === 'medium' ? 2 : 1)
                                ? getRiskColor(selectedDemand.riskLevel)
                                : 'rgba(255, 255, 255, 0.1)'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 抢单按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGrab(selectedDemand)}
                    disabled={charging}
                    className="relative w-full py-4 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white font-mono overflow-hidden"
                  >
                    {charging ? (
                      <>
                        {/* 充能进度条 */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 0.3 }}
                          className="absolute bottom-0 left-0 h-1 bg-white/50"
                        />
                        <span>CHARGING...</span>
                      </>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5" />
                        GRAB NOW
                      </span>
                    )}
                  </motion.button>
                </motion.div>
              ) : (
                <div className="text-center py-12 text-white/40 text-sm">
                  点击雷达上的光点<br/>查看需求详情
                </div>
              )}
            </div>

            {/* 我的订单侧边栏 */}
            <div className="border border-[#00D6C2]/30 rounded-lg p-4 bg-black/50">
              <h4 className="font-mono text-[#00D6C2] mb-4">MY ORDERS</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {grabbedDemands.slice(-5).reverse().map((id, i) => (
                  <motion.div
                    key={id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-2 rounded bg-[#18FF74]/10 border border-[#18FF74]/30 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Order #{id}</span>
                      <span className="text-[#18FF74]">✓</span>
                    </div>
                  </motion.div>
                ))}
                {grabbedDemands.length === 0 && (
                  <div className="text-center py-8 text-white/40 text-xs">
                    暂无订单
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
