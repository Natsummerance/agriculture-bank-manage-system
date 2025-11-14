import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Eye, Plus, Home } from 'lucide-react';
import { Button } from '../ui/button';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDemand: () => void;
  onContinue: () => void;
}

export function SuccessDialog({
  isOpen,
  onClose,
  onViewDemand,
  onContinue,
}: SuccessDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-full max-w-md glass-morphism rounded-3xl p-8 text-center"
          >
            {/* 成功图标动画 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
              >
                <CheckCircle2 className="w-12 h-12 text-[#18FF74]" />
              </motion.div>

              {/* 光环效果 */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{
                    scale: [1, 2, 2.5],
                    opacity: [0.5, 0.3, 0],
                  }}
                  transition={{
                    delay: 0.5 + i * 0.2,
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.6,
                  }}
                  className="absolute inset-0 rounded-full border-2 border-[#18FF74]"
                />
              ))}
            </motion.div>

            {/* 标题 */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-2xl text-white mb-2"
            >
              发布成功！
            </motion.h2>

            {/* 描述 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/60 mb-8"
            >
              您的求购需求已成功发布
              <br />
              我们将为您智能匹配合适的农户
            </motion.p>

            {/* 按钮组 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-3"
            >
              <Button
                onClick={onViewDemand}
                className="w-full h-12 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-[#0A0A0D] hover:shadow-2xl"
                style={{
                  boxShadow: '0 0 30px rgba(0, 214, 194, 0.3)',
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                查看需求
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={onContinue}
                  variant="outline"
                  className="h-12 border-[#00D6C2]/30 text-[#00D6C2] hover:bg-[#00D6C2]/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  继续发布
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="h-12 border-white/10 text-white/60 hover:bg-white/5"
                >
                  <Home className="w-4 h-4 mr-2" />
                  返回首页
                </Button>
              </div>
            </motion.div>

            {/* 粒子效果 */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: Math.cos((i / 12) * Math.PI * 2) * 100,
                  y: Math.sin((i / 12) * Math.PI * 2) * 100,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  delay: 0.3 + i * 0.05,
                  duration: 1.5,
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
