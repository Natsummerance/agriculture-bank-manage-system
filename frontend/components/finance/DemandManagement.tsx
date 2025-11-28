import { motion } from "motion/react";
import { useState } from "react";
import { Clock, DollarSign, TrendingUp, MoreHorizontal, RefreshCw, Share2 } from "lucide-react";

interface Demand {
  id: number;
  title: string;
  amount: number;
  progress: number;
  status: 'pending' | 'approved' | 'disbursed' | 'repaying' | 'completed';
  monthsPaid: number;
  totalMonths: number;
  dueDate: string;
}

const demands: Demand[] = [
  { 
    id: 1, 
    title: "农业设备采购贷", 
    amount: 200000, 
    progress: 100, 
    status: 'disbursed',
    monthsPaid: 3,
    totalMonths: 12,
    dueDate: '2025-12-01'
  },
  { 
    id: 2, 
    title: "种植扩建资金", 
    amount: 350000, 
    progress: 65, 
    status: 'repaying',
    monthsPaid: 8,
    totalMonths: 24,
    dueDate: '2026-11-15'
  },
  { 
    id: 3, 
    title: "季节性周转贷", 
    amount: 150000, 
    progress: 100, 
    status: 'completed',
    monthsPaid: 12,
    totalMonths: 12,
    dueDate: '2025-10-01'
  },
  { 
    id: 4, 
    title: "温室大棚建设", 
    amount: 500000, 
    progress: 30, 
    status: 'pending',
    monthsPaid: 0,
    totalMonths: 36,
    dueDate: '2028-10-31'
  },
];

const statusConfig = {
  pending: { label: '待审批', color: '#FFD700' },
  approved: { label: '已批准', color: '#00D6C2' },
  disbursed: { label: '已放款', color: '#18FF74' },
  repaying: { label: '还款中', color: '#00D6C2' },
  completed: { label: '已完成', color: '#18FF74' },
};

export function DemandManagement() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
  const [swipedItem, setSwipedItem] = useState<number | null>(null);

  const filteredDemands = demands.filter(d => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'pending') return d.status === 'pending';
    if (selectedTab === 'active') return ['approved', 'disbursed', 'repaying'].includes(d.status);
    if (selectedTab === 'completed') return d.status === 'completed';
    return true;
  });

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
            需求宇宙
          </h2>
          <p className="text-white/60">可视化管理您的所有融资需求</p>
        </motion.div>

        {/* 筛选Tab */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-8"
        >
          {[
            { key: 'all', label: '全部' },
            { key: 'pending', label: '待审批' },
            { key: 'active', label: '进行中' },
            { key: 'completed', label: '已完成' }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-lg transition-all ${
                selectedTab === tab.key
                  ? 'bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white'
                  : 'glass-morphism text-white/60'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* 需求列表 - 圆环卡片 */}
        <div className="space-y-4">
          {filteredDemands.map((demand, index) => (
            <motion.div
              key={demand.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: swipedItem === demand.id ? -80 : 0 
              }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* 主卡片 */}
              <motion.div
                drag="x"
                dragConstraints={{ left: -80, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -40) {
                    setSwipedItem(demand.id);
                  } else {
                    setSwipedItem(null);
                  }
                }}
                whileHover={{ y: -2 }}
                className="glass-morphism rounded-2xl p-6 cursor-pointer relative z-10"
              >
                <div className="flex items-start gap-6">
                  {/* 圆环进度 */}
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* 背景圆环 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="8"
                      />
                      
                      {/* 进度圆环 */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ 
                          strokeDashoffset: 283 - (283 * demand.progress) / 100 
                        }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        style={{
                          strokeDasharray: 283
                        }}
                      />
                      
                      {/* 闭合粒子动画 */}
                      {demand.progress === 100 && (
                        <motion.circle
                          cx="50"
                          cy="5"
                          r="3"
                          fill="#18FF74"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.5, 0] }}
                          transition={{ duration: 0.3, delay: index * 0.1 + 1 }}
                        />
                      )}
                      
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00D6C2" />
                          <stop offset="100%" stopColor="#18FF74" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* 中心文字 */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
                        {demand.progress}%
                      </div>
                      <div className="text-xs text-white/40">
                        {statusConfig[demand.status].label}
                      </div>
                    </div>
                  </div>

                  {/* 信息区 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="mb-2">{demand.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-mono">¥{demand.amount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div 
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          background: `${statusConfig[demand.status].color}20`,
                          color: statusConfig[demand.status].color
                        }}
                      >
                        {statusConfig[demand.status].label}
                      </div>
                    </div>

                    {/* 还款日历迷你图 */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(12)].map((_, i) => {
                        const isPaid = i < demand.monthsPaid;
                        const isCurrentMonth = i === demand.monthsPaid;
                        
                        return (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.2 }}
                            className="relative group"
                          >
                            <div 
                              className={`w-3 h-3 rounded-full transition-all ${
                                isPaid 
                                  ? 'bg-[#18FF74]' 
                                  : isCurrentMonth
                                  ? 'bg-[#FFD700] animate-pulse'
                                  : 'bg-white/20'
                              }`}
                            />
                            
                            {/* Hover提示 */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-black/80 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              {new Date(2025, i, 1).toLocaleDateString('zh-CN', { month: 'long' })}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* 底部信息 */}
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>到期: {demand.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{demand.monthsPaid}/{demand.totalMonths}期</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 左滑快捷按钮 */}
              {swipedItem === demand.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute right-0 top-0 bottom-0 flex gap-2 items-center pr-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-[#00D6C2]/20 backdrop-blur-sm flex items-center justify-center text-[#00D6C2]"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-[#18FF74]/20 backdrop-blur-sm flex items-center justify-center text-[#18FF74]"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-[#FF2566]/20 backdrop-blur-sm flex items-center justify-center text-[#FF2566]"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredDemands.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🌌</div>
            <h4 className="mb-2 text-white/60">暂无需求</h4>
            <p className="text-sm text-white/40">创建您的第一个融资需求吧</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
