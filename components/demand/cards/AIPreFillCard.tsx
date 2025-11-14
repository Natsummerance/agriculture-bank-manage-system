import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Sparkles, History } from 'lucide-react';
import { useAIPreFill } from '../../../utils/useAIPreFill';

interface AIPreFillCardProps {
  expanded: boolean;
  onToggle: () => void;
}

export function AIPreFillCard({ expanded, onToggle }: AIPreFillCardProps) {
  const { isLoading, generateDescription, fillFromHistory } = useAIPreFill();

  return (
    <motion.div
      layout
      className="glass-morphism rounded-2xl overflow-hidden"
    >
      {/* 卡片头部 */}
      <motion.button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-left">
            <h3 className="text-white flex items-center gap-2">
              AI 预填充
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">实验性</span>
            </h3>
            <p className="text-xs text-white/50">让AI帮你快速填写</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 0 : -180 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-white/60" />
        </motion.div>
      </motion.button>

      {/* 卡片内容 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-3">
              {/* AI生成需求描述 */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateDescription}
                disabled={isLoading}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/50 transition-all flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50"
              >
                <motion.div
                  animate={
                    isLoading
                      ? {
                          rotate: 360,
                        }
                      : {
                          rotate: [0, 10, -10, 0],
                        }
                  }
                  transition={
                    isLoading
                      ? {
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }
                      : {
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }
                  }
                >
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </motion.div>
                <span className="text-white/90">
                  {isLoading ? '正在生成...' : '用 AI 生成需求描述'}
                </span>

                {/* Pulse effect */}
                {!isLoading && (
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 rounded-xl border-2 border-purple-500/50"
                  />
                )}
              </motion.button>

              {/* 用历史偏好填充 */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fillFromHistory}
                disabled={isLoading}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-[#00D6C2]/10 to-[#18FF74]/10 border border-[#00D6C2]/30 hover:border-[#00D6C2]/50 transition-all flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50"
              >
                <motion.div
                  animate={
                    isLoading
                      ? {
                          rotate: 360,
                        }
                      : {}
                  }
                  transition={
                    isLoading
                      ? {
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }
                      : {}
                  }
                >
                  <History className="w-5 h-5 text-[#00D6C2]" />
                </motion.div>
                <span className="text-white/90">
                  {isLoading ? '正在加载...' : '用历史偏好填充'}
                </span>

                {/* Shimmer effect */}
                {!isLoading && (
                  <motion.div
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  />
                )}
              </motion.button>

              {/* 提示信息 */}
              <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <p className="text-xs text-white/60 leading-relaxed">
                  💡 <span className="text-purple-400">AI功能说明：</span>
                  <br />
                  • 生成描述：基于您已填写的信息，AI将生成专业的需求描述
                  <br />
                  • 历史填充：根据您的历史采购记录，智能推荐相似需求
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
