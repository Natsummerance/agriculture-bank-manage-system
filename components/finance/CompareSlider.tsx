import { motion, useMotionValue, useTransform, PanInfo } from "motion/react";
import { useState } from "react";
import { ShoppingBasket, X, TrendingUp, Clock, Shield } from "lucide-react";

interface LoanPlan {
  id: number;
  bankName: string;
  logo: string;
  rate: number;
  amount: number;
  period: number;
  fee: number;
  features: string[];
}

const plans: LoanPlan[] = [
  {
    id: 1,
    bankName: "农业银行",
    logo: "🏦",
    rate: 3.85,
    amount: 500000,
    period: 12,
    fee: 0,
    features: ["零手续费", "快速审批", "灵活还款"]
  },
  {
    id: 2,
    bankName: "建设银行",
    logo: "🏛️",
    rate: 4.15,
    amount: 400000,
    period: 24,
    fee: 500,
    features: ["专项支持", "利率优惠", "担保减免"]
  },
  {
    id: 3,
    bankName: "工商银行",
    logo: "🏢",
    rate: 4.50,
    amount: 600000,
    period: 36,
    fee: 1000,
    features: ["高额度", "长期限", "企业优先"]
  },
  {
    id: 4,
    bankName: "农商银行",
    logo: "🌾",
    rate: 3.65,
    amount: 300000,
    period: 12,
    fee: 0,
    features: ["本地优势", "超低利率", "秒批秒贷"]
  },
];

export function CompareSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [basket, setBasket] = useState<LoanPlan[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-200, 0, 200], [25, 0, -25]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(velocity) > 500 || Math.abs(offset) > 100) {
      if (offset > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (offset < 0 && currentIndex < plans.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const addToBasket = (plan: LoanPlan) => {
    if (basket.length < 3 && !basket.find(p => p.id === plan.id)) {
      setBasket([...basket, plan]);
    }
  };

  const removeFromBasket = (planId: number) => {
    setBasket(basket.filter(p => p.id !== planId));
  };

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
            方案对比滑轨
          </h2>
          <p className="text-white/60">左右滑动查看不同方案，上滑加入对比</p>
        </motion.div>

        {/* 3D卡片滑轨 */}
        <div className="relative h-[600px] mb-12" style={{ perspective: 1500 }}>
          <div className="absolute inset-0 flex items-center justify-center">
            {plans.map((plan, index) => {
              const offset = index - currentIndex;
              const absOffset = Math.abs(offset);
              
              return (
                <motion.div
                  key={plan.id}
                  drag={index === currentIndex ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  animate={{
                    x: offset * 60 + '%',
                    scale: index === currentIndex ? 1 : 0.8,
                    rotateY: offset * -25,
                    zIndex: plans.length - absOffset,
                    opacity: absOffset > 1 ? 0 : 1
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  className="absolute w-96 cursor-grab active:cursor-grabbing"
                  style={{
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <motion.div
                    whileHover={{ y: index === currentIndex ? -10 : 0 }}
                    className="glass-morphism rounded-2xl p-8 relative overflow-hidden"
                    style={{
                      boxShadow: index === currentIndex 
                        ? '0 20px 60px rgba(0, 214, 194, 0.4)' 
                        : '0 10px 30px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {/* 背景装饰 */}
                    <div className="absolute top-0 right-0 text-9xl opacity-5">
                      {plan.logo}
                    </div>

                    {/* 银行Logo */}
                    <div className="text-6xl mb-4 text-center">{plan.logo}</div>
                    
                    <h3 className="text-center mb-6">{plan.bankName}</h3>

                    {/* 利率 */}
                    <div className="text-center mb-6">
                      <div className="text-5xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74] mb-2">
                        {plan.rate}%
                      </div>
                      <p className="text-sm text-white/60">年化利率</p>
                    </div>

                    {/* 详情 */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                        <span className="text-white/60">额度</span>
                        <span className="font-mono text-[#00D6C2]">
                          ¥{(plan.amount / 10000).toFixed(0)}万
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                        <span className="text-white/60">期限</span>
                        <span className="font-mono text-[#18FF74]">{plan.period}个月</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                        <span className="text-white/60">手续费</span>
                        <span className={`font-mono ${plan.fee === 0 ? 'text-[#18FF74]' : 'text-white'}`}>
                          {plan.fee === 0 ? '免费' : `¥${plan.fee}`}
                        </span>
                      </div>
                    </div>

                    {/* 特色 */}
                    <div className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00D6C2]" />
                          <span className="text-white/80">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* 操作按钮 */}
                    {index === currentIndex && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToBasket(plan)}
                          disabled={basket.length >= 3 || basket.find(p => p.id === plan.id) !== undefined}
                          className="flex-1 py-3 rounded-lg border border-[#00D6C2] text-[#00D6C2] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          加入对比
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white"
                        >
                          立即申请
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* 指示器 */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2">
            {plans.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-8 bg-gradient-to-r from-[#00D6C2] to-[#18FF74]' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 对比篮 */}
        {basket.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowComparison(!showComparison)}
              className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center text-white shadow-2xl"
              style={{
                boxShadow: '0 0 30px rgba(0, 214, 194, 0.6)'
              }}
            >
              <ShoppingBasket className="w-8 h-8" />
              
              {/* 数字气泡 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#FF2566] flex items-center justify-center text-sm font-mono"
              >
                {basket.length}
              </motion.div>
            </motion.button>
          </motion.div>
        )}

        {/* 3D对比桌 */}
        {showComparison && basket.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-lg flex items-center justify-center p-8"
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-6xl w-full glass-morphism rounded-2xl p-8"
              style={{ perspective: 1000 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[#00D6C2]">方案对比</h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowComparison(false)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-white/60">项目</th>
                      {basket.map(plan => (
                        <th key={plan.id} className="py-4 px-4">
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-4xl">{plan.logo}</div>
                            <div className="text-sm">{plan.bankName}</div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromBasket(plan.id)}
                              className="text-xs text-[#FF2566] hover:underline"
                            >
                              移除
                            </motion.button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'rate', label: '年化利率', suffix: '%', highlight: true },
                      { key: 'amount', label: '贷款额度', prefix: '¥', format: (v: number) => (v / 10000).toFixed(0) + '万' },
                      { key: 'period', label: '贷款期限', suffix: '个月' },
                      { key: 'fee', label: '手续费', prefix: '¥', highlight: true, format: (v: number) => v === 0 ? '免费' : v }
                    ].map(row => {
                      const values = basket.map(p => p[row.key as keyof LoanPlan] as number);
                      const minValue = Math.min(...values);
                      const maxValue = Math.max(...values);
                      
                      return (
                        <tr key={row.key} className="border-b border-white/5">
                          <td className="py-4 px-4 text-white/60">{row.label}</td>
                          {basket.map(plan => {
                            const value = plan[row.key as keyof LoanPlan] as number;
                            const isBest = row.highlight && (
                              (row.key === 'rate' && value === minValue) ||
                              (row.key === 'fee' && value === minValue) ||
                              (row.key === 'amount' && value === maxValue)
                            );
                            
                            return (
                              <td key={plan.id} className="py-4 px-4 text-center">
                                <span className={`font-mono ${isBest ? 'text-[#18FF74]' : 'text-white'}`}>
                                  {row.prefix || ''}
                                  {row.format ? row.format(value) : value}
                                  {row.suffix || ''}
                                </span>
                                {isBest && <span className="ml-2 text-xs text-[#18FF74]">✓ 最优</span>}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
