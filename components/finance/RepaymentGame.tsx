import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Coins, TrendingDown, Award, Zap } from "lucide-react";

interface Payment {
  month: number;
  amount: number;
  paid: boolean;
  interest: number;
}

export function RepaymentGame() {
  const [payments, setPayments] = useState<Payment[]>(
    Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      amount: 18000,
      paid: i < 3,
      interest: 650
    }))
  );
  const [totalSaved, setTotalSaved] = useState(1950);
  const [coins, setCoins] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const handlePayment = (month: number) => {
    // 更新支付状态
    setPayments(prev => prev.map(p => 
      p.month === month ? { ...p, paid: true } : p
    ));

    // 金币爆炸
    const newCoins = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100
    }));
    setCoins(newCoins);

    // 更新省息
    const extraSaved = Math.random() > 0.5 ? 650 * 2 : 650;
    setTotalSaved(prev => prev + extraSaved);

    // 清除金币
    setTimeout(() => setCoins([]), 1000);

    // 检查是否完成所有还款
    if (payments.filter(p => !p.paid).length === 1) {
      setTimeout(() => setShowCelebration(true), 500);
    }
  };

  const paidCount = payments.filter(p => p.paid).length;
  const progress = (paidCount / 12) * 100;

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
            还款闯关
          </h2>
          <p className="text-white/60">每还一期就像打怪升级，赚取专属勋章</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 主游戏区 */}
          <div className="lg:col-span-2">
            {/* 进度轨道 */}
            <div className="glass-morphism rounded-2xl p-8 mb-6">
              <div className="relative">
                {/* 进度条 */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* 关卡点 */}
                <div className="relative pt-12 grid grid-cols-6 gap-4">
                  {payments.map((payment, i) => (
                    <motion.div
                      key={payment.month}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col items-center"
                    >
                      {/* 关卡图标 */}
                      <motion.div
                        whileHover={!payment.paid ? { scale: 1.1 } : {}}
                        className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer mb-2 ${
                          payment.paid
                            ? 'bg-gradient-to-br from-[#00D6C2] to-[#18FF74]'
                            : 'bg-white/10 border-2 border-white/30'
                        }`}
                        onClick={() => !payment.paid && handlePayment(payment.month)}
                      >
                        {payment.paid ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-2xl"
                          >
                            ⭐
                          </motion.div>
                        ) : (
                          <Coins className="w-6 h-6 text-white/60" />
                        )}

                        {/* 金币爆炸 */}
                        <AnimatePresence>
                          {payment.paid && payment.month === paidCount && coins.length > 0 && (
                            <>
                              {coins.map(coin => (
                                <motion.div
                                  key={coin.id}
                                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                                  animate={{
                                    x: coin.x,
                                    y: coin.y,
                                    scale: 1,
                                    opacity: 0
                                  }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className="absolute w-4 h-4 rounded-full bg-[#FFD700]"
                                  style={{
                                    boxShadow: '0 0 10px #FFD700'
                                  }}
                                />
                              ))}
                            </>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* 期数 */}
                      <div className="text-xs text-white/60 mb-1">第{payment.month}期</div>
                      
                      {/* 金额 */}
                      <div className={`text-sm font-mono ${
                        payment.paid ? 'text-[#18FF74]' : 'text-white/40'
                      }`}>
                        ¥{payment.amount.toLocaleString()}
                      </div>

                      {/* 立即还款按钮 */}
                      {!payment.paid && payment.month === paidCount + 1 && (
                        <motion.button
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePayment(payment.month)}
                          className="mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white text-xs"
                        >
                          立即还款
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* 还款历史 */}
            <div className="glass-morphism rounded-2xl p-6">
              <h4 className="mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FFD700]" />
                还款记录
              </h4>

              <div className="space-y-2">
                {payments.filter(p => p.paid).reverse().slice(0, 5).map((payment, i) => (
                  <motion.div
                    key={payment.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center text-sm">
                        ✓
                      </div>
                      <div>
                        <div className="text-sm text-white">第 {payment.month} 期</div>
                        <div className="text-xs text-white/40">
                          {new Date(2025, payment.month - 1, 5).toLocaleDateString('zh-CN')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[#18FF74]">-¥{payment.amount.toLocaleString()}</div>
                      <div className="text-xs text-white/60">省息 ¥{payment.interest}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* 省息飞榜 */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-morphism rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-[#18FF74]" />
                <h4>已省利息</h4>
              </div>

              <motion.div
                key={totalSaved}
                initial={{ scale: 1.2, color: '#FFD700' }}
                animate={{ scale: 1, color: '#18FF74' }}
                transition={{ duration: 0.3 }}
                className="text-5xl font-mono mb-2"
              >
                ¥{totalSaved.toLocaleString()}
              </motion.div>

              <div className="flex items-center gap-2 text-sm text-white/60">
                <Zap className="w-4 h-4 text-[#FFD700]" />
                <span>提前还款，利息减半</span>
              </div>

              {/* 暴击标签 */}
              <AnimatePresence>
                {totalSaved > 2000 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-[#FFD700]/20 to-[#FF8C00]/20 border border-[#FFD700]/30 text-center"
                  >
                    <div className="text-2xl mb-1">💥</div>
                    <div className="text-[#FFD700]">暴击！双倍省息</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 勋章系统 */}
            <div className="glass-morphism rounded-2xl p-6">
              <h4 className="mb-4">成就勋章</h4>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: '首付', unlocked: paidCount >= 1, icon: '🎯' },
                  { title: '连续3期', unlocked: paidCount >= 3, icon: '🔥' },
                  { title: '半程', unlocked: paidCount >= 6, icon: '⚡' },
                  { title: '全额还清', unlocked: paidCount >= 12, icon: '👑' },
                ].map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-3 rounded-lg text-center ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-[#FFD700]/20 to-[#FF8C00]/20 border border-[#FFD700]/30'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <div className={`text-3xl mb-1 ${!badge.unlocked && 'grayscale opacity-30'}`}>
                      {badge.icon}
                    </div>
                    <div className={`text-xs ${badge.unlocked ? 'text-[#FFD700]' : 'text-white/40'}`}>
                      {badge.title}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 全部还清礼花庆祝 */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={() => setShowCelebration(false)}
            >
              {/* 礼花粒子 */}
              {[...Array(300)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: '50vw',
                    y: '50vh',
                    scale: 0,
                    opacity: 1
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 100}vw`,
                    y: `${50 + (Math.random() - 0.5) * 100}vh`,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 1 + Math.random(),
                    delay: Math.random() * 0.3,
                    ease: "easeOut"
                  }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: ['#FFD700', '#FF2566', '#00D6C2', '#18FF74', '#FF8C00'][i % 5],
                    boxShadow: '0 0 10px currentColor'
                  }}
                />
              ))}

              {/* 毕业证书 */}
              <motion.div
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ type: "spring", delay: 0.5 }}
                className="relative z-10 glass-morphism rounded-2xl p-12 text-center max-w-md"
              >
                <div className="text-8xl mb-6">🎓</div>
                <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF8C00]">
                  融资毕业！
                </h2>
                <p className="text-white/80 mb-6">
                  恭喜您完成全部还款<br/>
                  累计节省利息 ¥{totalSaved.toLocaleString()}
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white"
                  >
                    分享到微信
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 rounded-lg border border-[#00D6C2] text-[#00D6C2]"
                  >
                    下载NFT勋章
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
