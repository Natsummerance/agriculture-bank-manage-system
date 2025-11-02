import { motion } from "motion/react";
import { useState } from "react";
import { Video, Calendar, MessageCircle, Star, Award, Clock } from "lucide-react";
import ExpertDetailPage from "./expert/ExpertDetailPage";

const experts = [
  { id: 1, name: "张教授", field: "水稻种植", avatar: "🌾", rating: 4.9, consultations: 1230, online: true },
  { id: 2, name: "李专家", field: "果树管理", avatar: "🍎", rating: 4.8, consultations: 980, online: true },
  { id: 3, name: "王顾问", field: "畜牧养殖", avatar: "🐄", rating: 5.0, consultations: 1560, online: false },
  { id: 4, name: "赵老师", field: "智慧农业", avatar: "🤖", rating: 4.7, consultations: 876, online: true },
  { id: 5, name: "孙博士", field: "土壤改良", avatar: "🌱", rating: 4.9, consultations: 1100, online: true },
  { id: 6, name: "周专家", field: "病虫害防治", avatar: "🔬", rating: 4.6, consultations: 750, online: false },
];

const appointments = [
  { id: 1, date: "11月1日", expert: "张教授", time: "09:00-10:00", status: "confirmed" },
  { id: 2, date: "11月3日", expert: "李专家", time: "14:00-15:00", status: "pending" },
  { id: 3, date: "11月5日", expert: "赵老师", time: "16:00-17:00", status: "completed" },
];

const qaData = [
  { 
    id: 1, 
    question: "水稻叶片发黄怎么办？", 
    expert: "张教授", 
    answer: "可能是缺氮或病害，建议先检查土壤养分...", 
    likes: 128,
    time: "2小时前"
  },
  { 
    id: 2, 
    question: "苹果树修剪的最佳时期？", 
    expert: "李专家", 
    answer: "冬季休眠期（12月-次年2月）是最佳修剪期...", 
    likes: 95,
    time: "5小时前"
  },
  { 
    id: 3, 
    question: "智能灌溉系统如何配置？", 
    expert: "赵老师", 
    answer: "需要根据作物类型、土壤条件和气候特点综合考虑...", 
    likes: 156,
    time: "1天前"
  },
];

export function ExpertPage() {
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const [detailExpertId, setDetailExpertId] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(11);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentMonth(prev => direction === 'next' ? prev + 1 : prev - 1);
      setIsFlipping(false);
    }, 300);
  };

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
            知识星系·Expert Galaxy
          </h2>
          <p className="text-white/60">连接农业专家，解锁智慧农业</p>
        </motion.div>

        {/* 专家星云 - 力导向图 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3>专家星云</h3>
            <span className="text-sm text-white/40">· 点击进入虫洞详情</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {experts.map((expert, i) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: 0,
                  y: selectedExpert === expert.id ? -8 : 0
                }}
                transition={{ 
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                onClick={() => setSelectedExpert(expert.id)}
                className="relative cursor-pointer"
              >
                <div className="glass-morphism rounded-2xl p-6 text-center relative overflow-hidden">
                  {/* 在线状态呼吸灯 */}
                  {expert.online && (
                    <motion.div
                      className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#18FF74]"
                      animate={{ 
                        opacity: [1, 0.3, 1],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ boxShadow: '0 0 12px #18FF74' }}
                    />
                  )}

                  {/* 头像 */}
                  <motion.div
                    animate={{ 
                      rotate: selectedExpert === expert.id ? 360 : 0
                    }}
                    transition={{ duration: 0.6 }}
                    className="text-6xl mb-4"
                  >
                    {expert.avatar}
                  </motion.div>

                  <h4 className="mb-1">{expert.name}</h4>
                  <p className="text-sm text-white/60 mb-3">{expert.field}</p>

                  {/* 评分 */}
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                    <span className="font-mono text-[#FFD700]">{expert.rating}</span>
                  </div>

                  <div className="text-xs text-white/40">
                    {expert.consultations} 次咨询
                  </div>

                  {/* 虫洞效果 */}
                  {selectedExpert === expert.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 flex items-center justify-center"
                    >
                      <Video className="w-8 h-8 text-[#00D6C2]" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 专家详情卡片 */}
          {selectedExpert && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 glass-morphism rounded-2xl p-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="mb-4 text-[#00D6C2]">专家信息</h4>
                  <div className="space-y-3">
                    {experts.find(e => e.id === selectedExpert) && (
                      <>
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-[#18FF74]" />
                          <span className="text-white/80">资深农业专家认证</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MessageCircle className="w-5 h-5 text-[#00D6C2]" />
                          <span className="text-white/80">平均响应时间: 5分钟</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-[#18FF74]" />
                          <span className="text-white/80">可预约时段: 工作日 9:00-18:00</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-4 text-[#00D6C2]">服务方式</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDetailExpertId(selectedExpert)}
                      className="py-3 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white flex items-center justify-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      查看详情
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDetailExpertId(selectedExpert)}
                      className="py-3 rounded-lg border border-[#00D6C2] text-[#00D6C2] flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      在线预约
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </section>

        {/* 预约日历 - 3D Flip */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3>预约日历</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 日历 */}
            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleMonthChange('prev')}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
                >
                  ←
                </motion.button>

                <motion.div
                  animate={{ 
                    rotateY: isFlipping ? 180 : 0
                  }}
                  transition={{ duration: 0.6 }}
                  style={{ perspective: 1000 }}
                >
                  <h4>2025年 {currentMonth}月</h4>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleMonthChange('next')}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
                >
                  →
                </motion.button>
              </div>

              {/* 日期网格 */}
              <div className="grid grid-cols-7 gap-2">
                {['日', '一', '二', '三', '四', '五', '六'].map((day, i) => (
                  <div key={i} className="text-center text-sm text-white/40 py-2">
                    {day}
                  </div>
                ))}
                
                {[...Array(31)].map((_, i) => {
                  const isAvailable = i % 3 !== 0;
                  const isSelected = i === 5;
                  
                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02 }}
                      whileHover={isAvailable ? { scale: 1.1 } : {}}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                        isSelected 
                          ? 'bg-gradient-to-br from-[#00D6C2] to-[#18FF74] text-white quantum-glow'
                          : isAvailable
                          ? 'bg-white/5 hover:bg-[#18FF74]/20 text-white'
                          : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                      disabled={!isAvailable}
                    >
                      {i + 1}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 预约列表 */}
            <div className="glass-morphism rounded-2xl p-6">
              <h4 className="mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#00D6C2]" />
                我的预约
              </h4>

              <div className="space-y-3">
                {appointments.map((apt, i) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-white mb-1">{apt.expert}</div>
                        <div className="text-sm text-white/60">{apt.date} {apt.time}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        apt.status === 'confirmed' ? 'bg-[#18FF74]/20 text-[#18FF74]' :
                        apt.status === 'pending' ? 'bg-[#FFD700]/20 text-[#FFD700]' :
                        'bg-white/20 text-white/60'
                      }`}>
                        {apt.status === 'confirmed' ? '已确认' :
                         apt.status === 'pending' ? '待确认' : '已完成'}
                      </span>
                    </div>
                    
                    {apt.status === 'confirmed' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="w-full mt-3 py-2 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white text-sm flex items-center justify-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        进入会诊室
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 问答知识库 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3>热门问答</h3>
          </div>

          <div className="space-y-4">
            {qaData.map((qa, i) => (
              <motion.div
                key={qa.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
                className="glass-morphism rounded-2xl p-6 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-[#00D6C2]" />
                  </div>

                  <div className="flex-1">
                    <h4 className="mb-2">{qa.question}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-[#00D6C2]">{qa.expert}</span>
                      <span className="text-sm text-white/40">·</span>
                      <span className="text-sm text-white/40">{qa.time}</span>
                    </div>
                    <p className="text-white/60 mb-3">{qa.answer}</p>
                    
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1 text-sm text-white/60 hover:text-[#18FF74]"
                      >
                        <span>👍</span>
                        <span>{qa.likes}</span>
                      </motion.button>
                      <button 
                        onClick={() => setDetailExpertId(qa.id)}
                        className="text-sm text-white/60 hover:text-[#00D6C2]"
                      >
                        查看详情 →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* 专家详情页面 */}
      {detailExpertId && (
        <ExpertDetailPage
          expertId={detailExpertId}
          onClose={() => setDetailExpertId(null)}
        />
      )}
    </div>
  );
}
