import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Zap, TrendingUp, Award, ArrowRight } from "lucide-react";

interface PreApprovalResult {
  approved: boolean;
  maxAmount: number;
  interestRate: number;
  suggestions?: string[];
}

export function FinanceGateway() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<PreApprovalResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // WebGL额度星球动画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.7;

    const drawPlanet = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // 外发光
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.3);
      gradient.addColorStop(0, 'rgba(0, 214, 194, 0.2)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // 球体网格
      for (let lat = -90; lat <= 90; lat += 20) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 214, 194, 0.3)';
        ctx.lineWidth = 1;
        
        for (let lon = 0; lon <= 360; lon += 5) {
          const theta = (lon - rotation) * Math.PI / 180;
          const phi = lat * Math.PI / 180;
          const x = centerX + radius * Math.cos(phi) * Math.sin(theta);
          const y = centerY + radius * Math.sin(phi);
          if (lon === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 额度数字贴图模拟
      ctx.save();
      ctx.font = '14px monospace';
      ctx.fillStyle = 'rgba(0, 214, 194, 0.4)';
      for (let i = 0; i < 30; i++) {
        const angle = (i * 12 + rotation) * Math.PI / 180;
        const lat = (Math.random() - 0.5) * 120;
        const phi = lat * Math.PI / 180;
        const r = radius * Math.cos(phi);
        const x = centerX + r * Math.sin(angle);
        const y = centerY + radius * Math.sin(phi);
        ctx.fillText('¥', x, y);
      }
      ctx.restore();

      rotation += 0.3;
      if (!isAnimating) {
        animationId = requestAnimationFrame(drawPlanet);
      }
    };

    drawPlanet();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isAnimating]);

  const handleTestCredit = async () => {
    setIsAnimating(true);
    
    // 模拟Rust-WASM风控计算 200ms
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟预审结果
    const mockResult: PreApprovalResult = {
      approved: Math.random() > 0.3,
      maxAmount: Math.floor(Math.random() * 400000) + 100000,
      interestRate: 3.85 + Math.random() * 1.5,
      suggestions: Math.random() > 0.5 ? [
        "完善土地经营权证明可提高额度15%",
        "增加担保人可降低利率0.3%",
        "补充近6个月收入流水"
      ] : undefined
    };

    setResult(mockResult);
    setShowResult(true);
  };

  const handleApply = () => {
    // 跳转到申请流程
    console.log("跳转到申请流程");
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="planet"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 0,
              transition: { duration: 0.8 }
            }}
            className="max-w-2xl w-full text-center"
          >
            {/* WebGL星球 */}
            <motion.div
              animate={isAnimating ? {
                scale: [1, 0.8, 0],
                rotate: [0, 180, 360]
              } : {}}
              transition={{ duration: 0.8 }}
              className="relative w-full aspect-square max-w-md mx-auto mb-8"
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full"
              />
              
              {/* 中心测额按钮 */}
              {!isAnimating && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleTestCredit}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex flex-col items-center justify-center text-white cursor-pointer"
                  style={{
                    boxShadow: '0 0 40px rgba(0, 214, 194, 0.6)'
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.6, 1]
                    }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    <Zap className="w-12 h-12 mb-2" />
                  </motion.div>
                  <span className="text-sm">测额闪电</span>
                </motion.button>
              )}

              {/* 脉冲波纹 */}
              {!isAnimating && (
                <>
                  {[0, 0.4, 0.8].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-[#00D6C2]"
                      animate={{
                        scale: [1, 2.5],
                        opacity: [0.8, 0]
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        delay: delay,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
            >
              融资大厅
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/60"
            >
              点击测额闪电，0.2秒获取您的专属额度
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className="max-w-lg w-full"
          >
            {/* 星云爆炸后的预审卡片 */}
            <motion.div
              initial={{ rotateY: 180 }}
              animate={{ rotateY: result?.approved ? 0 : 180 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ perspective: 1000 }}
              className="glass-morphism rounded-2xl p-8 relative overflow-hidden"
            >
              {/* 粒子背景 */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-[#00D6C2]"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>

              {result?.approved ? (
                // 通过预审
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.5 }}
                      className="inline-block p-4 rounded-full bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 mb-4"
                    >
                      <Award className="w-12 h-12 text-[#18FF74]" />
                    </motion.div>
                    <h3 className="mb-2 text-[#18FF74]">恭喜！预审通过</h3>
                  </div>

                  {/* 额度数字翻牌 */}
                  <div className="mb-6 text-center">
                    <p className="text-sm text-white/60 mb-2">您的最高可贷额度</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl text-white/40">¥</span>
                      <div className="flex gap-1">
                        {result.maxAmount.toString().split('').map((digit, i) => (
                          <motion.div
                            key={i}
                            initial={{ rotateX: -90, opacity: 0 }}
                            animate={{ rotateX: 0, opacity: 1 }}
                            transition={{
                              delay: 0.6 + i * 0.05,
                              duration: 0.3,
                              ease: "easeOut"
                            }}
                            className="w-12 h-16 rounded-lg bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center text-3xl text-white font-mono"
                            style={{ perspective: 200 }}
                          >
                            {digit}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 利率曲线 */}
                  <div className="mb-6 p-4 rounded-lg bg-white/5">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-sm text-white/60">年化利率</span>
                      <span className="text-2xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#18FF74]">
                        {result.interestRate.toFixed(2)}%
                      </span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1, delay: 1 }}
                        className="h-full bg-gradient-to-r from-[#18FF74] to-[#FFD700]"
                      />
                    </div>
                  </div>

                  {/* 一键申请按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleApply}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white flex items-center justify-center gap-2 relative overflow-hidden"
                  >
                    {/* 呼吸光 */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(24, 255, 116, 0.4)',
                          '0 0 0 12px rgba(24, 255, 116, 0)',
                        ]
                      }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                    <span className="relative z-10">一键申请</span>
                    <ArrowRight className="w-5 h-5 relative z-10" />
                  </motion.button>
                </div>
              ) : (
                // 未通过预审 - 专家辅导模式
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 180 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <div className="text-center mb-6">
                    <div className="inline-block p-4 rounded-full bg-[#FF2566]/20 mb-4">
                      <TrendingUp className="w-12 h-12 text-[#FF2566]" />
                    </div>
                    <h3 className="mb-2">需要完善资料</h3>
                    <p className="text-sm text-white/60">按以下建议改进可快速通过预审</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {result?.suggestions?.map((suggestion, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#00D6C2]/20 flex items-center justify-center flex-shrink-0 text-[#00D6C2] text-sm">
                          {i + 1}
                        </div>
                        <p className="text-sm text-white/80">{suggestion}</p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 rounded-lg border border-[#00D6C2] text-[#00D6C2] flex items-center justify-center gap-2"
                  >
                    联系专家辅导
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* 重新测试 */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={() => {
                setShowResult(false);
                setIsAnimating(false);
                setResult(null);
              }}
              className="mt-6 w-full text-center text-white/60 hover:text-[#00D6C2] transition-colors text-sm"
            >
              ← 返回重新测试
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
