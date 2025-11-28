import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Clock, Award, FileText, Zap } from "lucide-react";

interface BankBid {
  id: number;
  bankName: string;
  rate: number;
  amount: number;
  level: 'gold' | 'silver';
  timestamp: number;
}

export function DemandDetail() {
  const [countdown, setCountdown] = useState(24 * 3600); // 24小时倒计时
  const [barrage, setBarrage] = useState<BankBid[]>([]);
  const [selectedBank, setSelectedBank] = useState<number | null>(null);
  const [contractRotation, setContractRotation] = useState({ x: 0, y: 0 });

  // 模拟银行抢单WebSocket
  useEffect(() => {
    const interval = setInterval(() => {
      const newBid: BankBid = {
        id: Date.now(),
        bankName: ['农业银行', '建设银行', '工商银行', '农商银行'][Math.floor(Math.random() * 4)],
        rate: 3.5 + Math.random() * 2,
        amount: Math.floor(Math.random() * 500000) + 100000,
        level: Math.random() > 0.5 ? 'gold' : 'silver',
        timestamp: Date.now()
      };
      
      setBarrage(prev => [...prev, newBid].slice(-10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(countdown / 3600);
  const minutes = Math.floor((countdown % 3600) / 60);
  const seconds = countdown % 60;
  const isUrgent = countdown <= 10;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -30;
    setContractRotation({ x, y });
  };

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
            融资需求详情
          </h2>
        </motion.div>

        {/* 抢单直播间 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-6 mb-8 relative overflow-hidden"
        >
          {/* 倒计时条 */}
          {!selectedBank && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mb-6 p-4 rounded-lg relative overflow-hidden ${
                isUrgent ? 'bg-[#FF2566]/20' : 'bg-white/5'
              }`}
            >
              {isUrgent && (
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-[#FF2566]/20"
                />
              )}
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className={`w-6 h-6 ${isUrgent ? 'text-[#FF2566]' : 'text-[#00D6C2]'}`} />
                  <div>
                    <h4 className="mb-1">自动匹配倒计时</h4>
                    <p className="text-sm text-white/60">
                      {isUrgent ? '即将自动选择最佳机构' : '请在倒计时结束前选择银行'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 font-mono text-3xl">
                  <span className={isUrgent ? 'text-[#FF2566]' : 'text-[#00D6C2]'}>
                    {hours.toString().padStart(2, '0')}
                  </span>
                  <span className="text-white/40">:</span>
                  <span className={isUrgent ? 'text-[#FF2566]' : 'text-[#00D6C2]'}>
                    {minutes.toString().padStart(2, '0')}
                  </span>
                  <span className="text-white/40">:</span>
                  <span className={isUrgent ? 'text-[#FF2566]' : 'text-[#00D6C2]'}>
                    {seconds.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* 进度条 */}
              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    isUrgent 
                      ? 'bg-gradient-to-r from-[#FF2566] to-[#FF8C00]' 
                      : 'bg-gradient-to-r from-[#00D6C2] to-[#18FF74]'
                  }`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${(countdown / (24 * 3600)) * 100}%` }}
                />
              </div>
            </motion.div>
          )}

          {/* 银行抢单弹幕 */}
          <div className="relative h-64 overflow-hidden rounded-lg bg-black/20">
            <div className="absolute inset-0">
              <AnimatePresence>
                {barrage.map((bid, index) => (
                  <motion.div
                    key={bid.id}
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: '-100%', opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 8,
                      ease: "linear"
                    }}
                    className="absolute whitespace-nowrap"
                    style={{
                      top: `${(index % 6) * 40 + 20}px`,
                      color: bid.level === 'gold' ? '#FFD700' : '#FFFFFF'
                    }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm">
                      {bid.level === 'gold' && <Award className="w-4 h-4" />}
                      <span className="text-sm">{bid.bankName}</span>
                      <span className="text-xs opacity-60">竞价</span>
                      <span className="font-mono">{bid.rate.toFixed(2)}%</span>
                      <span className="text-xs opacity-60">额度</span>
                      <span className="font-mono">¥{(bid.amount / 10000).toFixed(0)}万</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* 提示文字 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center"
              >
                <Zap className="w-12 h-12 mx-auto mb-2 text-[#00D6C2]" />
                <p className="text-white/60">实时银行竞价直播中...</p>
                <p className="text-sm text-white/40 mt-1">已有 {barrage.length} 家机构参与</p>
              </motion.div>
            </div>
          </div>

          {/* 当前最佳报价 */}
          {barrage.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-lg bg-gradient-to-r from-[#FFD700]/10 to-[#FF8C00]/10 border border-[#FFD700]/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-[#FFD700]" />
                  <div>
                    <h4 className="text-[#FFD700]">当前最优</h4>
                    <p className="text-sm text-white/60">{barrage[barrage.length - 1]?.bankName}</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedBank(barrage[barrage.length - 1]?.id)}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-white"
                >
                  立即选择
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* 3D合同封面 */}
        {selectedBank && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism rounded-2xl p-8"
          >
            <h3 className="mb-6 text-center text-[#00D6C2]">贷款合同预览</h3>
            
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setContractRotation({ x: 0, y: 0 })}
              className="relative h-96 flex items-center justify-center"
              style={{ perspective: 1000 }}
            >
              <motion.div
                animate={{
                  rotateX: contractRotation.y,
                  rotateY: contractRotation.x
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="w-72 h-96 rounded-lg bg-gradient-to-br from-white to-gray-100 shadow-2xl p-8 relative"
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 20px 60px rgba(0, 214, 194, 0.3)'
                }}
              >
                {/* 合同封面 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800">
                  <FileText className="w-16 h-16 mb-4 text-[#00D6C2]" />
                  <h4 className="mb-2">农业贷款合同</h4>
                  <p className="text-sm opacity-60">Contract No. 2025XXXX</p>
                  
                  <div className="mt-8 space-y-2 text-sm">
                    <div className="flex justify-between gap-8">
                      <span className="opacity-60">贷款金额:</span>
                      <span className="font-mono">¥200,000</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="opacity-60">年化利率:</span>
                      <span className="font-mono">3.85%</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="opacity-60">贷款期限:</span>
                      <span className="font-mono">12个月</span>
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 pt-4 border-t border-gray-300">
                    <p className="text-xs text-center opacity-40">拖拽旋转查看</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 w-full py-4 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white"
            >
              查看完整合同
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
