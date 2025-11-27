import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

export function QuantumMatch() {
  const [progress, setProgress] = useState(0);
  const [matched, setMatched] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{x: number, y: number, vx: number, vy: number, life: number}> = [];
    
    // 创建粒子
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2 + 1,
        life: Math.random()
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 13, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        // 后退效果
        p.y += p.vy * (matched ? -3 : 3);
        p.x += p.vx;

        if (p.y > canvas.height) {
          p.y = 0;
          p.x = Math.random() * canvas.width;
        } else if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 3);
        gradient.addColorStop(0, matched ? 'rgba(24, 255, 116, 0.8)' : 'rgba(0, 214, 194, 0.8)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      frame++;
      if (!matched) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    // 进度模拟
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setMatched(true), 500);
          return 100;
        }
        return prev + Math.random() * 5 + 2;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [matched]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050816]">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {!matched ? (
          <>
            {/* 双方头像 */}
            <div className="flex items-center gap-32 mb-12">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#18FF74]/20 to-[#00D6C2]/20 flex items-center justify-center text-6xl border-4 border-[#18FF74]">
                  🌾
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#18FF74]/20 backdrop-blur-sm text-sm text-[#18FF74] whitespace-nowrap">
                  张农户
                </div>
              </motion.div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16"
              >
                <Sparkles className="w-full h-full text-[#00D6C2]" />
              </motion.div>

              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 0, 5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00D6C2]/20 to-[#FFD700]/20 flex items-center justify-center text-6xl border-4 border-[#00D6C2]">
                  🏦
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#00D6C2]/20 backdrop-blur-sm text-sm text-[#00D6C2] whitespace-nowrap">
                  农业银行
                </div>
              </motion.div>
            </div>

            {/* 缘分值进度 */}
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
                  量子匹配中...
                </h3>
                <span className="font-mono text-2xl text-[#00D6C2]">
                  {Math.floor(progress)}%
                </span>
              </div>

              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00D6C2] via-[#18FF74] to-[#FFD700] relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* 流动光效 */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    style={{ width: '50%' }}
                  />
                </motion.div>
              </div>

              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-4 text-center text-sm text-white/60"
              >
                AI正在分析{Math.floor(progress * 1.5 + 100)}项数据点...
              </motion.p>
            </div>
          </>
        ) : (
          // 匹配成功星云爆发
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            {/* 星云爆发效果 */}
            <div className="relative mb-8">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 2, 1.5],
                    opacity: [0, 1, 0],
                    x: Math.cos((i * 30 * Math.PI) / 180) * 150,
                    y: Math.sin((i * 30 * Math.PI) / 180) * 150,
                  }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                  className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full"
                  style={{
                    background: i % 2 === 0 ? '#00D6C2' : '#18FF74',
                    boxShadow: `0 0 20px ${i % 2 === 0 ? '#00D6C2' : '#18FF74'}`
                  }}
                />
              ))}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center"
                style={{
                  boxShadow: '0 0 60px rgba(0, 214, 194, 0.8), 0 0 120px rgba(24, 255, 116, 0.6)'
                }}
              >
                <Sparkles className="w-20 h-20 text-white" />
              </motion.div>
            </div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
            >
              匹配成功！
            </motion.h2>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="mb-8"
            >
              <div className="text-6xl font-mono text-[#18FF74] mb-2">98%</div>
              <p className="text-white/60">缘分值</p>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white"
              onClick={() => {/* 跳转到合同页 */}}
            >
              查看贷款合同
            </motion.button>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.05 }}
              className="mt-4 block mx-auto text-white/60 hover:text-[#00D6C2] transition-colors text-sm"
              onClick={() => {
                setMatched(false);
                setProgress(0);
              }}
            >
              重新匹配 →
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
