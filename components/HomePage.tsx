import { motion } from "motion/react";
import { WebGLSphere } from "./WebGLSphere";
import { TrendingUp, Leaf, Users, MapPin, ArrowRight, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const newsData = [
  { id: 1, title: "AI智能匹配系统上线：农户融资效率提升300%", category: "技术", time: "2小时前", hot: true },
  { id: 2, title: "绿色金融助力乡村振兴，累计放贷超50亿元", category: "金融", time: "5小时前", hot: true },
  { id: 3, title: "专家在线问诊服务突破10万次，满意度98.5%", category: "服务", time: "1天前", hot: false },
  { id: 4, title: "数字化农产品交易平台月交易额破亿", category: "交易", time: "2天前", hot: false },
];

const financeProducts = [
  { id: 1, name: "农业生产贷", rate: "3.85%", limit: "1-50万", color: "from-[#00D6C2] to-[#18FF74]", glow: "#00D6C2" },
  { id: 2, name: "种植专项贷", rate: "4.15%", limit: "5-100万", color: "from-[#18FF74] to-[#00D6C2]", glow: "#18FF74" },
  { id: 3, name: "供应链融资", rate: "4.50%", limit: "10-200万", color: "from-[#00D6C2] to-[#FF2566]", glow: "#FF2566" },
  { id: 4, name: "设备租赁贷", rate: "5.00%", limit: "20-500万", color: "from-[#FF2566] to-[#00D6C2]", glow: "#00D6C2" },
];

const experts = [
  { id: 1, name: "张教授", field: "水稻种植", avatar: "🌾", status: "在线", rating: 4.9 },
  { id: 2, name: "李专家", field: "果树管理", avatar: "🍎", status: "在线", rating: 4.8 },
  { id: 3, name: "王顾问", field: "畜牧养殖", avatar: "🐄", status: "忙碌", rating: 5.0 },
  { id: 4, name: "赵老师", field: "智慧农业", avatar: "🤖", status: "在线", rating: 4.7 },
];

export function HomePage() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section - WebGL星球（D1功能） */}
        <WebGLSphere />

        {/* 新闻流 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3>实时资讯</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // 使用Web Speech API实现简单的语音播报
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance(
                    newsData.slice(0, 3).map(n => n.title).join('。')
                  );
                  utterance.lang = 'zh-CN';
                  utterance.rate = 0.9;
                  utterance.pitch = 1;
                  speechSynthesis.speak(utterance);
                  toast.success("AI语音播报已开始");
                } else {
                  toast.info("您的浏览器不支持语音播报功能");
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#00D6C2] hover:bg-[#00D6C2]/10 transition-colors"
            >
              <Play className="w-4 h-4" />
              AI语音播报
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsData.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="glass-morphism p-6 rounded-xl cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs bg-gradient-to-r from-[#00D6C2]/20 to-[#18FF74]/20 text-[#00D6C2]">
                    {news.category}
                  </span>
                  {news.hot && (
                    <span className="px-2 py-1 rounded text-xs bg-[#FF2566]/20 text-[#FF2566] flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      热门
                    </span>
                  )}
                </div>
                <h4 className="mb-2 group-hover:text-[#00D6C2] transition-colors">{news.title}</h4>
                <div className="flex items-center justify-between text-sm text-white/40">
                  <span>{news.time}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 金融产品轨道 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3>金融产品</h3>
            <span className="text-sm text-white/40">· 智能推荐，极速匹配</span>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {financeProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredProduct(product.id)}
                  onHoverEnd={() => setHoveredProduct(null)}
                  className="relative flex-shrink-0 w-80 p-6 rounded-2xl overflow-hidden cursor-pointer group"
                  style={{
                    background: hoveredProduct === product.id 
                      ? `linear-gradient(135deg, rgba(0, 214, 194, 0.15), rgba(24, 255, 116, 0.15))`
                      : 'rgba(18, 23, 38, 0.5)',
                    border: '1px solid rgba(0, 214, 194, 0.2)',
                    transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {hoveredProduct === product.id && (
                    <motion.div
                      layoutId="productGlow"
                      className="absolute inset-0 opacity-30 blur-xl"
                      style={{ background: `radial-gradient(circle at center, ${product.glow}, transparent)` }}
                    />
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="mb-2">{product.name}</h4>
                        <p className="text-sm text-white/60">额度 {product.limit}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${product.color} text-white font-mono`}>
                        {product.rate}
                      </div>
                    </div>

                    {/* 粒子进度条 */}
                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${product.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                      {hoveredProduct === product.id && (
                        <motion.div
                          className="absolute top-0 left-0 w-2 h-2 rounded-full"
                          style={{ background: product.glow, boxShadow: `0 0 8px ${product.glow}` }}
                          animate={{ left: ['0%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`mt-4 w-full py-3 rounded-lg bg-gradient-to-r ${product.color} text-white opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      立即申请
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 专家问答磁贴 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3>在线专家</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {experts.map((expert, index) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-morphism p-6 rounded-xl text-center cursor-pointer relative overflow-hidden group"
              >
                {/* 呼吸灯效果 */}
                {expert.status === '在线' && (
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#18FF74]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ boxShadow: '0 0 8px #18FF74' }}
                  />
                )}

                <div className="text-5xl mb-3">{expert.avatar}</div>
                <h4 className="mb-1">{expert.name}</h4>
                <p className="text-sm text-white/60 mb-2">{expert.field}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-[#FFD700]">
                  <span>⭐</span>
                  <span className="font-mono">{expert.rating}</span>
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-[#00D6C2]/20 to-transparent flex items-end justify-center pb-4"
                >
                  <button className="px-4 py-2 rounded-lg bg-[#00D6C2] text-white text-sm">
                    立即咨询
                  </button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 供需脉冲地图 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3>实时供需地图</h3>
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#18FF74]" />
                <span className="text-xs text-white/60">供应</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00D6C2]" />
                <span className="text-xs text-white/60">需求</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-morphism rounded-2xl p-8 h-96 relative overflow-hidden"
          >
            {/* 模拟地图背景 */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 800 400">
                <path d="M 100,200 Q 250,100 400,200 T 700,200" stroke="#00D6C2" strokeWidth="1" fill="none" opacity="0.3" />
                <path d="M 150,250 Q 300,150 450,250 T 750,250" stroke="#18FF74" strokeWidth="1" fill="none" opacity="0.3" />
              </svg>
            </div>

            {/* 脉冲点 */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  background: i % 2 === 0 ? '#18FF74' : '#00D6C2',
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: `2px solid ${i % 2 === 0 ? '#18FF74' : '#00D6C2'}`,
                  }}
                  animate={{
                    scale: [1, 2.5],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
            ))}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-[#00D6C2]" />
                <p className="text-white/60">实时数据流正在更新...</p>
                <p className="mt-2 text-sm text-white/40">WebSocket连接中</p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
