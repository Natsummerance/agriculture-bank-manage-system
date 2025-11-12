import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface StarLoaderProps {
  onComplete: () => void;
}

export function StarLoader({ onComplete }: StarLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#0A0A0D] to-[#121726]"
    >
      {/* 粒子背景 */}
      <div className="absolute inset-0 particle-grid opacity-30" />
      
      {/* 中心星云爆发 */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: [0, 1.5, 1], rotate: 360 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-32 h-32 relative"
        >
          {/* 外圈粒子 */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0.8],
                opacity: [0, 1, 0.6],
                x: Math.cos((i * 30 * Math.PI) / 180) * 60,
                y: Math.sin((i * 30 * Math.PI) / 180) * 60,
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.05,
                repeat: Infinity,
                repeatDelay: 0.5 
              }}
              className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
              style={{
                background: i % 2 === 0 ? '#00D6C2' : '#18FF74',
                boxShadow: i % 2 === 0 ? '0 0 12px #00D6C2' : '0 0 12px #18FF74'
              }}
            />
          ))}
          
          {/* 中心核心 */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74]"
            style={{
              boxShadow: '0 0 40px rgba(0, 214, 194, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.3)'
            }}
          />
        </motion.div>

        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
            AgriVerse
          </h1>
          <p className="mt-2 text-white/60">数字经济·农业未来</p>
        </motion.div>

        {/* 进度条 */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 w-64 mx-auto"
        >
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
            />
          </div>
          <p className="mt-2 text-center text-sm text-white/40 font-mono">
            {progress}%
          </p>
        </motion.div>

        {/* 跳过按钮 */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          transition={{ delay: 1.5 }}
          onClick={onComplete}
          className="mt-6 mx-auto block px-6 py-2 text-sm text-white/60 hover:text-[#00D6C2] transition-colors"
        >
          跳过 →
        </motion.button>
      </div>
    </motion.div>
  );
}
