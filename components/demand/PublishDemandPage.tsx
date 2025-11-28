import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Send, 
  ChevronDown,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useDemandStore } from '../../stores/demandStore';
import { useDraftSave } from '../../utils/useDraftSave';
import { useAIPreFill } from '../../utils/useAIPreFill';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { BasicInfoCard } from './cards/BasicInfoCard';
import { AttachmentsCard } from './cards/AttachmentsCard';
import { AIPreFillCard } from './cards/AIPreFillCard';
import { SettingsCard } from './cards/SettingsCard';
import { PreviewDrawer } from './PreviewDrawer';
import { SuccessDialog } from './SuccessDialog';

interface PublishDemandPageProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function PublishDemandPage({ onClose, onSuccess }: PublishDemandPageProps) {
  const { draft, publish, reset, currentStep, setStep } = useDemandStore();
  const { manualSave } = useDraftSave();
  const { isLoading: isAILoading } = useAIPreFill();
  
  const [expandedCards, setExpandedCards] = useState({
    basic: true,
    attachments: true,
    ai: false,
    settings: true,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const toggleCard = (card: keyof typeof expandedCards) => {
    setExpandedCards(prev => ({ ...prev, [card]: !prev[card] }));
  };

  const validateForm = (): boolean => {
    if (!draft.productName) {
      toast.error('请输入商品名称');
      return false;
    }
    if (!draft.category || draft.category.length === 0) {
      toast.error('请选择商品分类');
      return false;
    }
    if (!draft.quantity || draft.quantity <= 0) {
      toast.error('请输入有效数量');
      return false;
    }
    if (!draft.deliveryDate) {
      toast.error('请选择交货日期');
      return false;
    }
    if (!draft.deliveryLocation) {
      toast.error('请选择交货地点');
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsPublishing(true);
    try {
      await publish();
      setShowSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      toast.error('发布失败，请稍后重试');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    await manualSave();
  };

  // 计算进度
  const progress = (() => {
    let completed = 0;
    const total = 6;
    if (draft.productName) completed++;
    if (draft.category && draft.category.length > 0) completed++;
    if (draft.quantity && draft.quantity > 0) completed++;
    if (draft.deliveryDate) completed++;
    if (draft.deliveryLocation) completed++;
    if (draft.description) completed++;
    return (completed / total) * 100;
  })();

  return (
    <div className="fixed inset-0 z-[70] bg-[#050816] overflow-hidden flex flex-col">
      {/* 顶部导航 - 64px */}
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 flex-shrink-0 bg-[#0A0F1E]/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white/80" />
            </motion.button>
            <div>
              <h1 className="text-white">发布求购需求</h1>
              <p className="text-xs text-white/40">填写您的采购需求</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveDraft}
            className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            草稿
          </motion.button>
        </div>
      </motion.header>

      {/* 进度指示器 - 8px */}
      <div className="h-2 flex-shrink-0 bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          className="h-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] relative overflow-hidden"
        >
          {/* Neon glow effect */}
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>
      </div>

      {/* 表单区域 - flex */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* 卡片 1: 基本信息 */}
          <BasicInfoCard
            expanded={expandedCards.basic}
            onToggle={() => toggleCard('basic')}
          />

          {/* 卡片 2: 附件与说明 */}
          <AttachmentsCard
            expanded={expandedCards.attachments}
            onToggle={() => toggleCard('attachments')}
          />

          {/* 卡片 3: AI 预填充 */}
          <AIPreFillCard
            expanded={expandedCards.ai}
            onToggle={() => toggleCard('ai')}
          />

          {/* 卡片 4: 发布设置 */}
          <SettingsCard
            expanded={expandedCards.settings}
            onToggle={() => toggleCard('settings')}
          />

          {/* 底部空白，避免被按钮遮挡 */}
          <div className="h-24" />
        </div>
      </div>

      {/* 底部按钮 - 80px 固定 */}
      <motion.footer
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-20 flex-shrink-0 bg-[#0A0F1E]/80 backdrop-blur-xl border-t border-white/10"
      >
        <div className="h-full px-6 flex items-center gap-3">
          {/* 保存草稿 - 25% */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveDraft}
            className="flex-[1] h-12 rounded-xl border border-[#00D6C2]/30 text-[#00D6C2] hover:bg-[#00D6C2]/10 transition-all flex items-center justify-center gap-2"
            style={{
              boxShadow: '0 0 20px rgba(0, 214, 194, 0.15)',
            }}
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">保存</span>
          </motion.button>

          {/* 预览 - 25% */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPreview(true)}
            className="flex-[1] h-12 rounded-xl border border-white/10 text-white/80 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">预览</span>
          </motion.button>

          {/* 发布 - 50% */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex-[2] h-12 rounded-xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-[#0A0A0D] hover:shadow-2xl transition-all flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-50"
            style={{
              boxShadow: '0 0 30px rgba(0, 214, 194, 0.5), 0 0 60px rgba(24, 255, 116, 0.3)',
            }}
          >
            {isPublishing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span>发布中...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>发布需求</span>
              </>
            )}
            
            {/* Shimmer effect */}
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </motion.button>
        </div>
      </motion.footer>

      {/* 预览抽屉 */}
      <PreviewDrawer
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        draft={draft}
      />

      {/* 成功弹窗 */}
      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          reset();
          if (onClose) onClose();
        }}
        onViewDemand={() => {
          setShowSuccess(false);
          if (onSuccess) onSuccess();
        }}
        onContinue={() => {
          setShowSuccess(false);
          reset();
        }}
      />
    </div>
  );
}
