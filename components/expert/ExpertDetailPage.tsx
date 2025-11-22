import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { 
  X, 
  Star, 
  Award, 
  Clock, 
  Video, 
  MessageCircle, 
  Calendar,
  ThumbsUp,
  CheckCircle,
  TrendingUp,
  Users
} from "lucide-react";
import { toast } from "sonner";

interface ExpertDetailPageProps {
  expertId: number;
  onClose: () => void;
}

// 专家详细数据
const expertDetails = {
  1: {
    name: "张教授",
    field: "水稻种植",
    avatar: "🌾",
    rating: 4.9,
    consultations: 1230,
    online: true,
    title: "农业科学院研究员",
    years: 15,
    specialties: ["水稻种植", "病虫害防治", "高产栽培", "土壤改良"],
    education: "中国农业大学 博士",
    certifications: ["高级农艺师", "国家级专家", "科技特派员"],
    achievements: [
      "主持国家级科研项目5项",
      "发表学术论文50余篇",
      "培育新品种3个",
      "获得省级科技进步奖2次"
    ],
    responseTime: "平均5分钟",
    satisfaction: 98,
    description: "专注于水稻种植技术研究与推广，在高产栽培、病虫害综合防治等方面有深厚造诣。擅长解决水稻种植中的各类技术难题，为农户提供科学、实用的种植方案。"
  },
  2: {
    name: "李专家",
    field: "果树管理",
    avatar: "🍎",
    rating: 4.8,
    consultations: 980,
    online: true,
    title: "果树栽培技术专家",
    years: 12,
    specialties: ["苹果种植", "桃树管理", "果园规划", "修剪技术"],
    education: "西北农林科技大学 硕士",
    certifications: ["高级农艺师", "果树专家"],
    achievements: [
      "指导果园超过500个",
      "推广新技术20余项",
      "培训农户5000余人次",
      "果园增产平均30%"
    ],
    responseTime: "平均8分钟",
    satisfaction: 96,
    description: "长期从事果树栽培技术研究与推广工作，对苹果、桃、梨等果树的栽培管理有丰富经验。擅长果园规划设计、树形培养、病虫害防治等技术指导。"
  }
};

const reviews = [
  {
    id: 1,
    user: "李农户",
    avatar: "👨‍🌾",
    rating: 5,
    date: "2025-10-28",
    content: "张教授非常专业，给出的水稻病虫害防治方案很实用，按照他的建议操作后，效果非常好！",
    helpful: 23
  },
  {
    id: 2,
    user: "王种植户",
    avatar: "👨‍🌾",
    rating: 5,
    date: "2025-10-25",
    content: "咨询过程很愉快，张教授耐心解答了我关于水稻高产栽培的所有问题，还给了很多额外的建议。",
    helpful: 18
  },
  {
    id: 3,
    user: "赵大哥",
    avatar: "👨‍🌾",
    rating: 4,
    date: "2025-10-20",
    content: "专业水平很高，建议都很中肯。美中不足的是预约时间有点难约。",
    helpful: 12
  }
];

const availableSlots = [
  { date: "11月3日", time: "09:00-10:00", available: true },
  { date: "11月3日", time: "10:00-11:00", available: true },
  { date: "11月3日", time: "14:00-15:00", available: false },
  { date: "11月4日", time: "09:00-10:00", available: true },
  { date: "11月4日", time: "15:00-16:00", available: true },
  { date: "11月5日", time: "10:00-11:00", available: true },
];

export default function ExpertDetailPage({ expertId, onClose }: ExpertDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'schedule'>('info');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [consultType, setConsultType] = useState<'video' | 'chat'>('video');

  const expert = expertDetails[expertId as keyof typeof expertDetails];

  if (!expert) {
    return null;
  }

  const handleBooking = () => {
    if (!selectedSlot) {
      toast.error("请选择预约时段");
      return;
    }

    toast.success(`预约成功！${expert.name}将在${selectedSlot}与您进行${consultType === 'video' ? '视频' : '文字'}咨询`);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-morphism rounded-2xl"
        >
          {/* 头部 */}
          <div className="sticky top-0 z-10 glass-morphism border-b border-white/10 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* 头像 */}
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative"
                >
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00D6C2] to-[#18FF74] p-1">
                    <div className="w-full h-full rounded-xl bg-[#121726] flex items-center justify-center text-5xl">
                      {expert.avatar}
                    </div>
                  </div>
                  {expert.online && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#18FF74] border-4 border-[#121726]"
                    />
                  )}
                </motion.div>

                {/* 基本信息 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2>{expert.name}</h2>
                    <span className={`px-2 py-1 rounded text-xs ${
                      expert.online 
                        ? 'bg-[#18FF74]/20 text-[#18FF74]' 
                        : 'bg-white/20 text-white/60'
                    }`}>
                      {expert.online ? '在线' : '离线'}
                    </span>
                  </div>
                  <div className="text-white/80 mb-2">{expert.title}</div>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                      <span className="text-[#FFD700]">{expert.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{expert.consultations} 次咨询</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{expert.years} 年经验</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{expert.satisfaction}% 满意度</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 关闭按钮 */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* 标签页 */}
          <div className="border-b border-white/10 px-6">
            <div className="flex gap-6">
              {[
                { id: 'info', label: '专家信息', icon: Award },
                { id: 'reviews', label: '用户评价', icon: Star },
                { id: 'schedule', label: '预约咨询', icon: Calendar }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  whileHover={{ y: -2 }}
                  className={`relative py-4 flex items-center gap-2 ${
                    activeTab === tab.id ? 'text-[#00D6C2]' : 'text-white/60'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="expertTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* 专家信息 */}
              {activeTab === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* 简介 */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                      专家简介
                    </h4>
                    <p className="text-white/80 leading-relaxed">{expert.description}</p>
                  </div>

                  {/* 专长领域 */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                      专长领域
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {expert.specialties.map((specialty, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 border border-[#00D6C2]/30 text-[#00D6C2]"
                        >
                          {specialty}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* 教育背景与认证 */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                        教育背景
                      </h4>
                      <div className="glass-morphism rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 flex items-center justify-center text-xl">
                            🎓
                          </div>
                          <div className="text-white/80">{expert.education}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                        职业认证
                      </h4>
                      <div className="space-y-2">
                        {expert.certifications.map((cert, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-morphism rounded-lg p-3 flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4 text-[#18FF74]" />
                            <span className="text-white/80">{cert}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 主要成就 */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                      主要成就
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {expert.achievements.map((achievement, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="glass-morphism rounded-lg p-4 flex items-start gap-3"
                        >
                          <TrendingUp className="w-5 h-5 text-[#18FF74] flex-shrink-0 mt-1" />
                          <span className="text-white/80">{achievement}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 用户评价 */}
              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {/* 评分统计 */}
                  <div className="glass-morphism rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-mono text-[#FFD700] mb-2">{expert.rating}</div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                          ))}
                        </div>
                        <div className="text-sm text-white/60">{expert.consultations} 次评价</div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const percentage = star === 5 ? 85 : star === 4 ? 12 : 3;
                          return (
                            <div key={star} className="flex items-center gap-3">
                              <div className="text-sm text-white/60 w-8">{star}星</div>
                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.8, delay: star * 0.1 }}
                                  className="h-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
                                />
                              </div>
                              <div className="text-sm text-white/60 w-12">{percentage}%</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 评价列表 */}
                  {reviews.map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-morphism rounded-xl p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{review.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-white">{review.user}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-white/40">{review.date}</span>
                          </div>
                          <p className="text-white/80 mb-3">{review.content}</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 text-sm text-white/60 hover:text-[#00D6C2]"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>有帮助 ({review.helpful})</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* 预约咨询 */}
              {activeTab === 'schedule' && (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* 咨询方式选择 */}
                  <div>
                    <h4 className="mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                      选择咨询方式
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setConsultType('video')}
                        className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all ${
                          consultType === 'video'
                            ? 'bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 border-2 border-[#00D6C2]'
                            : 'glass-morphism border border-white/10'
                        }`}
                      >
                        <Video className={`w-8 h-8 ${consultType === 'video' ? 'text-[#00D6C2]' : 'text-white/60'}`} />
                        <div>
                          <div className={`mb-1 ${consultType === 'video' ? 'text-white' : 'text-white/60'}`}>
                            视频咨询
                          </div>
                          <div className="text-sm text-white/40">实时面对面交流</div>
                        </div>
                        <div className="font-mono text-[#18FF74]">¥200/小时</div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setConsultType('chat')}
                        className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all ${
                          consultType === 'chat'
                            ? 'bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 border-2 border-[#00D6C2]'
                            : 'glass-morphism border border-white/10'
                        }`}
                      >
                        <MessageCircle className={`w-8 h-8 ${consultType === 'chat' ? 'text-[#00D6C2]' : 'text-white/60'}`} />
                        <div>
                          <div className={`mb-1 ${consultType === 'chat' ? 'text-white' : 'text-white/60'}`}>
                            文字咨询
                          </div>
                          <div className="text-sm text-white/40">图文详细沟通</div>
                        </div>
                        <div className="font-mono text-[#18FF74]">¥100/小时</div>
                      </motion.button>
                    </div>
                  </div>

                  {/* 可用时段 */}
                  <div>
                    <h4 className="mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                      选择时段
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSlots.map((slot, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={slot.available ? { scale: 1.05 } : {}}
                          whileTap={slot.available ? { scale: 0.95 } : {}}
                          onClick={() => slot.available && setSelectedSlot(`${slot.date} ${slot.time}`)}
                          disabled={!slot.available}
                          className={`p-4 rounded-lg text-sm transition-all ${
                            selectedSlot === `${slot.date} ${slot.time}`
                              ? 'bg-gradient-to-br from-[#00D6C2] to-[#18FF74] text-white'
                              : slot.available
                              ? 'glass-morphism hover:border-[#00D6C2]/50'
                              : 'glass-morphism opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <div className="mb-1">{slot.date}</div>
                          <div className="font-mono">{slot.time}</div>
                          {!slot.available && (
                            <div className="text-xs text-white/40 mt-1">已约满</div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* 预约按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBooking}
                    disabled={!selectedSlot}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>确认预约</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
