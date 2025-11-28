import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Settings, Globe, DollarSign, Clock } from 'lucide-react';
import { useDemandStore } from '../../../stores/demandStore';
import { Switch } from '../../ui/switch';

interface SettingsCardProps {
  expanded: boolean;
  onToggle: () => void;
}

const expireDays = [
  { value: 7, label: '7天' },
  { value: 14, label: '14天' },
  { value: 30, label: '30天' },
];

export function SettingsCard({ expanded, onToggle }: SettingsCardProps) {
  const { draft, setField } = useDemandStore();

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
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FFD700]/20 to-[#FF2566]/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#FFD700]" />
          </div>
          <div className="text-left">
            <h3 className="text-white">发布设置</h3>
            <p className="text-xs text-white/50">控制需求的可见性和互动</p>
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
            <div className="px-6 pb-6 space-y-4">
              {/* 公开/私密 */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#00D6C2]" />
                  <div>
                    <div className="text-sm text-white/90">公开需求</div>
                    <div className="text-xs text-white/50">
                      {draft.isPublic ? '所有农户可见' : '仅邀请的农户可见'}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={draft.isPublic}
                  onCheckedChange={(checked) => setField('isPublic', checked)}
                />
              </div>

              {/* 允许报价 */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#18FF74]" />
                  <div>
                    <div className="text-sm text-white/90">允许报价</div>
                    <div className="text-xs text-white/50">
                      {draft.allowBidding ? '农户可主动报价' : '仅供浏览参考'}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={draft.allowBidding}
                  onCheckedChange={(checked) => setField('allowBidding', checked)}
                />
              </div>

              {/* 自动下架时间 */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <Clock className="w-5 h-5 text-[#FFD700]" />
                  <span>自动下架时间</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {expireDays.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setField('autoExpireDays', option.value)}
                      className={`h-12 rounded-xl transition-all ${
                        draft.autoExpireDays === option.value
                          ? 'bg-gradient-to-br from-[#00D6C2] to-[#18FF74] text-[#0A0A0D] shadow-lg'
                          : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                      style={
                        draft.autoExpireDays === option.value
                          ? {
                              boxShadow: '0 0 20px rgba(0, 214, 194, 0.3)',
                            }
                          : {}
                      }
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
                <p className="text-xs text-white/40 pl-8">
                  到期后需求将自动下架，不再显示给农户
                </p>
              </div>

              {/* 预览信息 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-gradient-to-br from-[#00D6C2]/10 to-[#18FF74]/10 border border-[#00D6C2]/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00D6C2]/20 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-4 h-4 text-[#00D6C2]" />
                  </div>
                  <div className="text-xs text-white/70 leading-relaxed">
                    <strong className="text-[#00D6C2]">当前设置：</strong>
                    <br />
                    • 可见性：{draft.isPublic ? '公开' : '私密'}
                    <br />
                    • 报价：{draft.allowBidding ? '允许' : '不允许'}
                    <br />
                    • 有效期：{draft.autoExpireDays}天后自动下架
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
