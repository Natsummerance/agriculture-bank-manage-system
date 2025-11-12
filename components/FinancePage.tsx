import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Sparkles, TrendingUp, Shield, Zap, Check, ArrowRight, Users, Lock, Activity } from "lucide-react";
import { JointLoanHub } from "./bank/JointLoanHub";
import { BlockchainExplorer } from "./blockchain/BlockchainExplorer";
import { HeatmapSphere } from "./HeatmapSphere";

const loanProducts = [
  {
    id: 1,
    name: "农业生产贷",
    rate: "3.85%",
    limit: "1-50万",
    period: "1-3年",
    features: ["快速审批", "利率优惠", "灵活还款"],
    color: "from-[#00D6C2] to-[#18FF74]",
    score: 95
  },
  {
    id: 2,
    name: "种植专项贷",
    rate: "4.15%",
    limit: "5-100万",
    period: "1-5年",
    features: ["专项支持", "季节性还款", "免抵押"],
    color: "from-[#18FF74] to-[#00D6C2]",
    score: 92
  },
  {
    id: 3,
    name: "供应链融资",
    rate: "4.50%",
    limit: "10-200万",
    period: "6个月-2年",
    features: ["订单融资", "应收账款", "库存质押"],
    color: "from-[#00D6C2] to-[#FF2566]",
    score: 88
  },
  {
    id: 4,
    name: "设备租赁贷",
    rate: "5.00%",
    limit: "20-500万",
    period: "2-5年",
    features: ["设备抵押", "以租代购", "税收优惠"],
    color: "from-[#FF2566] to-[#00D6C2]",
    score: 85
  },
];

const matchNodes = [
  { id: 1, type: "farmer", name: "张农户", x: 20, y: 30, similarity: 0.85 },
  { id: 2, type: "farmer", name: "李农场", x: 30, y: 60, similarity: 0.78 },
  { id: 3, type: "buyer", name: "王商贸", x: 60, y: 25, similarity: 0.92 },
  { id: 4, type: "buyer", name: "赵超市", x: 70, y: 70, similarity: 0.88 },
  { id: 5, type: "bank", name: "农行", x: 45, y: 45, similarity: 1.0 },
  { id: 6, type: "farmer", name: "钱合作社", x: 25, y: 85, similarity: 0.75 },
];

const steps = [
  { id: 1, title: "填写信息", desc: "基本资料与需求", status: "completed" },
  { id: 2, title: "智能匹配", desc: "AI分析推荐产品", status: "active" },
  { id: 3, title: "在线申请", desc: "提交贷款申请", status: "pending" },
  { id: 4, title: "审批放款", desc: "快速审批到账", status: "pending" },
];

type ModalType = 'jointLoan' | 'blockchain' | 'heatmap' | null;

export function FinancePage() {
  const [draggedCards, setDraggedCards] = useState(loanProducts);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
            智融资本·NeoBank
          </h2>
          <p className="text-white/60">AI驱动的智能金融匹配系统</p>
        </motion.div>

        {/* 贷款产品对比 - 3D卡片堆栈 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3>产品对比</h3>
            <span className="text-sm text-white/40">· 拖拽排序，智能推荐</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {draggedCards.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50, rotateY: -20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  rotateY: 0,
                  scale: selectedProduct === product.id ? 1.05 : 1
                }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                whileHover={{ y: -8, rotateY: 5 }}
                onClick={() => setSelectedProduct(product.id)}
                className="relative cursor-pointer"
                style={{ perspective: 1000 }}
              >
                <div className="glass-morphism rounded-2xl p-6 h-full relative overflow-hidden">
                  {/* 背景渐变 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-10`} />
                  
                  {/* 匹配度评分 */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 flex items-center justify-center border border-[#00D6C2]/30"
                    >
                      <div className="text-center">
                        <div className="font-mono text-[#00D6C2]">{product.score}</div>
                        <div className="text-xs text-white/40">分</div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="relative z-10 mt-8">
                    <Sparkles className="w-8 h-8 text-[#00D6C2] mb-4" />
                    <h4 className="mb-2">{product.name}</h4>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className={`text-2xl bg-gradient-to-r ${product.color} bg-clip-text text-transparent font-mono`}>
                        {product.rate}
                      </span>
                      <span className="text-sm text-white/40">年化利率</span>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">贷款额度</span>
                        <span className="text-white">{product.limit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">贷款期限</span>
                        <span className="text-white">{product.period}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {product.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-[#18FF74]" />
                          <span className="text-white/80">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 rounded-lg bg-gradient-to-r ${product.color} text-white flex items-center justify-center gap-2`}
                    >
                      立即申请
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 智能匹配引擎 - 粒子连线动画 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3>智能匹配网络</h3>
            <span className="text-sm text-white/40">· 实时计算相似度</span>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-morphism rounded-2xl p-8 h-96 relative overflow-hidden"
          >
            <svg className="absolute inset-0 w-full h-full">
              {/* 绘制连线 */}
              {matchNodes.map((node, i) => 
                matchNodes.slice(i + 1).map((targetNode, j) => {
                  if (node.similarity * targetNode.similarity > 0.7) {
                    return (
                      <motion.line
                        key={`${i}-${j}`}
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${targetNode.x}%`}
                        y2={`${targetNode.y}%`}
                        stroke={node.type === 'bank' || targetNode.type === 'bank' ? '#FFD700' : '#00D6C2'}
                        strokeWidth="2"
                        opacity="0.3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                      />
                    );
                  }
                  return null;
                })
              )}
            </svg>

            {/* 节点 */}
            {matchNodes.map((node, i) => (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.15, type: "spring" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      `0 0 0px ${node.type === 'bank' ? '#FFD700' : node.type === 'farmer' ? '#18FF74' : '#00D6C2'}`,
                      `0 0 20px ${node.type === 'bank' ? '#FFD700' : node.type === 'farmer' ? '#18FF74' : '#00D6C2'}`,
                      `0 0 0px ${node.type === 'bank' ? '#FFD700' : node.type === 'farmer' ? '#18FF74' : '#00D6C2'}`,
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2`}
                  style={{
                    background: node.type === 'bank' ? 'rgba(255, 215, 0, 0.2)' : 
                                node.type === 'farmer' ? 'rgba(24, 255, 116, 0.2)' : 
                                'rgba(0, 214, 194, 0.2)',
                    borderColor: node.type === 'bank' ? '#FFD700' : 
                                 node.type === 'farmer' ? '#18FF74' : 
                                 '#00D6C2'
                  }}
                >
                  {node.type === 'bank' ? '🏦' : node.type === 'farmer' ? '🌾' : '🏪'}
                </motion.div>

                {/* 悬停详情 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded-lg glass-morphism whitespace-nowrap text-sm"
                >
                  <div>{node.name}</div>
                  <div className="text-xs text-white/60 font-mono">相似度: {(node.similarity * 100).toFixed(0)}%</div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 申请流程时间轴 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3>申请流程</h3>
          </div>

          <div className="flex items-center justify-between relative">
            {/* 进度线 */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '33%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
              />
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex-1 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2 + 0.3, type: "spring" }}
                  className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-2 ${
                    step.status === 'completed' 
                      ? 'bg-gradient-to-br from-[#00D6C2] to-[#18FF74] border-[#00D6C2]'
                      : step.status === 'active'
                      ? 'bg-[#00D6C2]/20 border-[#00D6C2] quantum-glow'
                      : 'bg-white/5 border-white/20'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <Check className="w-8 h-8 text-white" />
                  ) : step.status === 'active' ? (
                    <Zap className="w-8 h-8 text-[#00D6C2]" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                  )}
                </motion.div>
                <h4 className={step.status !== 'pending' ? 'text-white' : 'text-white/40'}>
                  {step.title}
                </h4>
                <p className="text-sm text-white/40 mt-1">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 融资Dashboard */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3>数据看板</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "累计放贷", value: "50.8亿", icon: TrendingUp, color: "#00D6C2" },
              { label: "服务农户", value: "12.6万", icon: Shield, color: "#18FF74" },
              { label: "平均审批", value: "2.4小时", icon: Zap, color: "#FF2566" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-morphism rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-full border-2 border-dashed opacity-20"
                    style={{ borderColor: stat.color }}
                  />
                </div>
                <div className="text-3xl font-mono mb-2" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SP1功能模块入口 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#FF2566] to-[#00D6C2] rounded-full" />
            <h3>高级功能</h3>
            <span className="px-2 py-1 rounded text-xs bg-gradient-to-r from-[#FF2566]/20 to-[#00D6C2]/20 text-[#FF2566]">
              SP1 · 已上线
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* G3 - 多人联合贷 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => setActiveModal('jointLoan')}
              className="glass-morphism rounded-2xl p-6 cursor-pointer group border border-white/10 hover:border-[#FFD700]/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#00D6C2]/20">
                  <Users className="w-6 h-6 text-[#FFD700]" />
                </div>
                <span className="text-xs px-2 py-1 rounded bg-[#FFD700]/20 text-[#FFD700]">G3</span>
              </div>
              <h4 className="mb-2 group-hover:text-[#FFD700] transition-colors">多人联合贷</h4>
              <p className="text-sm text-white/60 mb-4">
                银行协同 · 风险共担 · 收益共享
              </p>
              <div className="flex items-center text-sm text-[#FFD700] group-hover:gap-2 gap-1 transition-all">
                <span>打开协同平台</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>

            {/* G2 - 区块链存证 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => setActiveModal('blockchain')}
              className="glass-morphism rounded-2xl p-6 cursor-pointer group border border-white/10 hover:border-[#18FF74]/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#18FF74]/20 to-[#00D6C2]/20">
                  <Lock className="w-6 h-6 text-[#18FF74]" />
                </div>
                <span className="text-xs px-2 py-1 rounded bg-[#18FF74]/20 text-[#18FF74]">G2</span>
              </div>
              <h4 className="mb-2 group-hover:text-[#18FF74] transition-colors">区块链存证</h4>
              <p className="text-sm text-white/60 mb-4">
                合同上链 · 司法存证 · 零Gas费用
              </p>
              <div className="flex items-center text-sm text-[#18FF74] group-hover:gap-2 gap-1 transition-all">
                <span>查看存证记录</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>

            {/* D2 - 额度热力图 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => setActiveModal('heatmap')}
              className="glass-morphism rounded-2xl p-6 cursor-pointer group border border-white/10 hover:border-[#00D6C2]/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20">
                  <Activity className="w-6 h-6 text-[#00D6C2]" />
                </div>
                <span className="text-xs px-2 py-1 rounded bg-[#00D6C2]/20 text-[#00D6C2]">D2</span>
              </div>
              <h4 className="mb-2 group-hover:text-[#00D6C2] transition-colors">全国额度热力图</h4>
              <p className="text-sm text-white/60 mb-4">
                实时数据 · 5分钟更新 · 智能预测
              </p>
              <div className="flex items-center text-sm text-[#00D6C2] group-hover:gap-2 gap-1 transition-all">
                <span>查看热力分布</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* 模态窗口 */}
      <AnimatePresence>
        {activeModal === 'jointLoan' && (
          <JointLoanHub onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'blockchain' && (
          <BlockchainExplorer onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'heatmap' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl h-[90vh] glass-morphism rounded-2xl border border-[#00D6C2]/30 overflow-hidden relative"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 z-10 p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
              <HeatmapSphere autoRotate={true} showLegend={true} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
