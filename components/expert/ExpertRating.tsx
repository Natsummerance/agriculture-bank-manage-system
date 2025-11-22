import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Star, ThumbsUp, Award, Sparkles, TrendingUp, Send, Rocket } from "lucide-react";

interface ExpertInfo {
  id: string;
  name: string;
  field: string;
  avatar: string;
  consultationId: string;
}

const mockExpert: ExpertInfo = {
  id: "EXP-001",
  name: "张教授",
  field: "水稻种植专家",
  avatar: "🌾",
  consultationId: "CONS-2025-001238"
};

const ratingTags = [
  { id: 1, label: "专业", color: "#00D6C2", emoji: "📚" },
  { id: 2, label: "耐心", color: "#18FF74", emoji: "💚" },
  { id: 3, label: "响应快", color: "#FFD700", emoji: "⚡" },
  { id: 4, label: "细致", color: "#00D6C2", emoji: "🔍" },
  { id: 5, label: "实用", color: "#18FF74", emoji: "💡" },
  { id: 6, label: "经验丰富", color: "#FFD700", emoji: "🎯" },
];

export function ExpertRating() {
  const [stage, setStage] = useState<'rating' | 'submitting' | 'completed'>('rating');
  const [starRating, setStarRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [comment, setComment] = useState("");
  const [rocketProgress, setRocketProgress] = useState(0);

  // 切换标签选择
  const toggleTag = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // 提交评价
  const submitRating = async () => {
    if (starRating === 0) {
      alert('请选择星级评分');
      return;
    }

    setStage('submitting');

    // 模拟火箭升空动画
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setRocketProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => setStage('completed'), 500);
      }
    };
    
    animate();
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {/* 阶段1: 评价表单 */}
          {stage === 'rating' && (
            <motion.div
              key="rating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* 页面标题 */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-block p-4 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#FF8C00]/20 mb-4"
                >
                  <Award className="w-12 h-12 text-[#FFD700]" />
                </motion.div>
                <h2 className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF8C00]">
                  专家评价
                </h2>
                <p className="text-white/60">您的反馈将帮助专家提供更好的服务</p>
              </div>

              {/* 专家信息卡片 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-morphism rounded-2xl p-6"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 flex items-center justify-center text-3xl"
                  >
                    {mockExpert.avatar}
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="mb-1">{mockExpert.name}</h4>
                    <p className="text-sm text-white/60">{mockExpert.field}</p>
                    <p className="text-xs text-white/40 mt-1 font-mono">
                      咨询单号: {mockExpert.consultationId}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 星级评分 */}
              <div className="glass-morphism rounded-2xl p-8">
                <div className="text-center mb-6">
                  <h4 className="mb-2">整体满意度</h4>
                  <p className="text-sm text-white/60">点击星星进行评分</p>
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isActive = star <= (hoverRating || starRating);
                    return (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.3, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setStarRating(star)}
                        className="relative focus:outline-none"
                      >
                        <Star
                          className={`w-16 h-16 transition-all duration-200 ${
                            isActive
                              ? 'fill-[#FFD700] text-[#FFD700]'
                              : 'fill-transparent text-white/30'
                          }`}
                        />
                        
                        {/* 星星发光效果 */}
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute inset-0 rounded-full"
                            style={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}
                          />
                        )}

                        {/* 星星粒子爆炸 */}
                        {isActive && starRating === star && (
                          <>
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ scale: 0, x: 0, y: 0 }}
                                animate={{
                                  scale: [0, 1, 0],
                                  x: Math.cos((i * Math.PI) / 4) * 40,
                                  y: Math.sin((i * Math.PI) / 4) * 40,
                                  opacity: [1, 0]
                                }}
                                transition={{ duration: 0.6, delay: 0 }}
                                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#FFD700]"
                              />
                            ))}
                          </>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* 评分描述 */}
                <AnimatePresence mode="wait">
                  {starRating > 0 && (
                    <motion.div
                      key={starRating}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center"
                    >
                      <p className="text-2xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF8C00]">
                        {starRating === 5 && "非常满意 🎉"}
                        {starRating === 4 && "满意 😊"}
                        {starRating === 3 && "一般 😐"}
                        {starRating === 2 && "不太满意 😕"}
                        {starRating === 1 && "很不满意 😞"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 标签选择 */}
              <div className="glass-morphism rounded-2xl p-8">
                <div className="mb-6">
                  <h4 className="mb-2">服务特点</h4>
                  <p className="text-sm text-white/60">选择您的感受（多选）</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ratingTags.map((tag, index) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                      <motion.button
                        key={tag.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTag(tag.id)}
                        className={`relative p-4 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br from-white/20 to-white/10 border-2'
                            : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                        }`}
                        style={{
                          borderColor: isSelected ? tag.color : 'transparent'
                        }}
                      >
                        {/* 选中动画 */}
                        {isSelected && (
                          <>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2"
                            >
                              <ThumbsUp 
                                className="w-4 h-4" 
                                style={{ color: tag.color }}
                              />
                            </motion.div>
                            
                            {/* 粒子爆炸效果 */}
                            {[...Array(6)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ scale: 0, x: 0, y: 0 }}
                                animate={{
                                  scale: [0, 1, 0],
                                  x: Math.cos((i * Math.PI) / 3) * 20,
                                  y: Math.sin((i * Math.PI) / 3) * 20,
                                  opacity: [1, 0]
                                }}
                                transition={{ duration: 0.5 }}
                                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: tag.color }}
                              />
                            ))}
                          </>
                        )}

                        <div className="text-3xl mb-2">{tag.emoji}</div>
                        <div 
                          className="transition-colors"
                          style={{ color: isSelected ? tag.color : 'rgba(255,255,255,0.8)' }}
                        >
                          {tag.label}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* 文字评价 */}
              <div className="glass-morphism rounded-2xl p-8">
                <div className="mb-6">
                  <h4 className="mb-2">详细评价</h4>
                  <p className="text-sm text-white/60">分享您的咨询体验（选填）</p>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="说说您的看法..."
                  rows={5}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#00D6C2] transition-colors resize-none"
                />
                
                <div className="flex items-center justify-between mt-2 text-sm text-white/40">
                  <span>{comment.length}/500</span>
                  {comment.length > 0 && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1 text-[#18FF74]"
                    >
                      <Sparkles className="w-4 h-4" />
                      写得真好！
                    </motion.span>
                  )}
                </div>
              </div>

              {/* 提交按钮 */}
              <motion.button
                whileHover={{ scale: starRating > 0 ? 1.02 : 1 }}
                whileTap={{ scale: starRating > 0 ? 0.98 : 1 }}
                disabled={starRating === 0}
                onClick={submitRating}
                className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  starRating > 0
                    ? 'bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-white cursor-pointer'
                    : 'bg-white/5 text-white/40 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
                提交评价
              </motion.button>

              {/* 评价提示 */}
              {starRating === 0 && (
                <p className="text-center text-sm text-white/40">
                  💡 请先选择星级评分
                </p>
              )}
            </motion.div>
          )}

          {/* 阶段2: 提交中 - 火箭升空动画 */}
          {stage === 'submitting' && (
            <motion.div
              key="submitting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <div className="relative w-full max-w-md h-96">
                {/* 背景星空 */}
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                    className="absolute w-1 h-1 rounded-full bg-white"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                  />
                ))}

                {/* 火箭 */}
                <motion.div
                  animate={{
                    y: [0, -400],
                    scale: [1, 0.5],
                    rotate: [0, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                >
                  <div className="relative">
                    <Rocket className="w-20 h-20 text-[#FFD700]" />
                    
                    {/* 火箭尾焰粒子 */}
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, 40],
                          x: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 30],
                          scale: [1, 0],
                          opacity: [1, 0]
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.05
                        }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                        style={{
                          background: i % 2 === 0 
                            ? 'linear-gradient(to bottom, #FFD700, #FF8C00)' 
                            : 'linear-gradient(to bottom, #FF8C00, transparent)'
                        }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* 冲击波 */}
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-[#FFD700]"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
              >
                <h3 className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF8C00]">
                  火箭升空中...
                </h3>
                <p className="text-white/60 mb-4">正在为专家加油 🚀</p>
                
                {/* 进度条 */}
                <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rocketProgress * 100}%` }}
                    className="h-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00]"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* 阶段3: 提交成功 */}
          {stage === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* 成功动画 */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200,
                    delay: 0.2
                  }}
                  className="inline-block relative mb-6"
                >
                  {/* 光环扩散 */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2 + i, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                      className="absolute inset-0 rounded-full border-4 border-[#18FF74]"
                    />
                  ))}
                  
                  <div className="relative p-6 rounded-full bg-gradient-to-br from-[#18FF74]/20 to-[#00D6C2]/20">
                    <Award className="w-20 h-20 text-[#18FF74]" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
                >
                  评价已提交！
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/60"
                >
                  感谢您的反馈，这将帮助{mockExpert.name}提供更好的服务
                </motion.p>
              </div>

              {/* 奖励卡片 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="glass-morphism rounded-2xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#FF8C00]/20">
                    <TrendingUp className="w-8 h-8 text-[#FFD700]" />
                  </div>
                  <div>
                    <h4>获得积分奖励</h4>
                    <p className="text-sm text-white/60">感谢您的宝贵反馈</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-[#FFD700]/10 to-[#FF8C00]/10 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, type: "spring" }}
                      className="text-3xl font-mono text-[#FFD700] mb-1"
                    >
                      +50
                    </motion.div>
                    <p className="text-xs text-white/60">积分</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-[#00D6C2]/10 to-[#18FF74]/10 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.1, type: "spring" }}
                      className="text-3xl font-mono text-[#00D6C2] mb-1"
                    >
                      +1
                    </motion.div>
                    <p className="text-xs text-white/60">优惠券</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-[#18FF74]/10 to-[#00D6C2]/10 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, type: "spring" }}
                      className="text-3xl font-mono text-[#18FF74] mb-1"
                    >
                      ⭐
                    </motion.div>
                    <p className="text-xs text-white/60">成就</p>
                  </div>
                </div>
              </motion.div>

              {/* 操作按钮 */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setStage('rating');
                    setStarRating(0);
                    setSelectedTags([]);
                    setComment("");
                  }}
                  className="py-4 rounded-lg border border-white/20 text-white"
                >
                  再次评价
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-4 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white"
                >
                  返回首页
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
