import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Share2, QrCode, Radar, Check, X, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { useLoanStore } from '../stores/loanStore';
import { LoanSuccessModal } from '../components/LoanSuccessModal';
import { toast } from 'sonner';

export default function LoanMatching() {
  const {
    quota,
    unitedEnabled,
    unitedList,
    matchPool,
    toggleUnited,
    inviteFarmer,
    removeFarmer,
    loadMatchPool,
  } = useLoanStore();

  const [showQRCode, setShowQRCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loanResult, setLoanResult] = useState<any>(null);

  useEffect(() => {
    if (unitedEnabled) {
      loadMatchPool();
    }
  }, [unitedEnabled]);

  const handleConfirmUnited = async () => {
    if (unitedList.length === 0) {
      toast.error('请至少邀请一位农户');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const totalAmount = quota + unitedList.reduce((sum) => sum + 50000, 0);
      const mockResult = {
        loanId: `UNITED-${Date.now()}`,
        amount: totalAmount,
        blockchainHash: `0x${Math.random().toString(16).slice(2, 34)}`,
      };
      setLoanResult(mockResult);
      setShowSuccess(true);
      toast.success('联合贷款申请成功！');
    } catch (error: any) {
      toast.error(error.message || '提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#0A0F1E] pb-32">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-white mb-2">智能匹配贷款</h1>
            <p className="text-white/60 text-sm">联合多位农户，提高额度与通过率</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* United Switch */}
          <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-[#00D6C2]" />
                  <h3 className="text-white">开启联合贷款</h3>
                </div>
                <p className="text-white/60 text-sm">
                  与其他农户联合申请，共享额度，降低风险
                </p>
              </div>
              <Switch
                checked={unitedEnabled}
                onCheckedChange={toggleUnited}
                className="ml-4"
              />
            </div>

            {unitedEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 rounded-2xl border border-[#00D6C2]/30 bg-[#00D6C2]/5"
              >
                <p className="text-[#00D6C2] text-sm mb-2">✓ 联合优势</p>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• 提高贷款额度上限</li>
                  <li>• 降低单个农户风险</li>
                  <li>• 提高审批通过率</li>
                  <li>• 区块链存证保障</li>
                </ul>
              </motion.div>
            )}
          </div>

          {unitedEnabled && (
            <>
              {/* Invite Methods */}
              <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-white mb-4">邀请农户</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => setShowQRCode(true)}
                    variant="outline"
                    className="h-20 rounded-2xl border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 flex flex-col gap-2"
                  >
                    <QrCode className="w-6 h-6" />
                    <span className="text-sm">二维码邀请</span>
                  </Button>
                  <Button
                    onClick={() => {
                      navigator.share?.({
                        title: '联合贷款邀请',
                        text: '邀请您参与联合贷款',
                        url: window.location.href,
                      }).catch(() => {
                        toast.success('分享链接已复制');
                      });
                    }}
                    variant="outline"
                    className="h-20 rounded-2xl border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 flex flex-col gap-2"
                  >
                    <Share2 className="w-6 h-6" />
                    <span className="text-sm">分享邀请</span>
                  </Button>
                </div>
              </div>

              {/* Invited List */}
              {unitedList.length > 0 && (
                <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
                  <h3 className="text-white mb-4">已邀请农户 ({unitedList.length})</h3>
                  <div className="space-y-3">
                    {unitedList.map((farmer) => (
                      <motion.div
                        key={farmer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-4 p-4 rounded-2xl border-2 border-[#18FF74]/50 bg-[#18FF74]/10"
                      >
                        <img
                          src={farmer.avatar}
                          alt={farmer.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-white mb-1">{farmer.name}</p>
                          <div className="flex items-center gap-3 text-sm text-white/60">
                            <span>📍 {farmer.location}</span>
                            <span>⭐ {farmer.creditScore}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeFarmer(farmer.id)}
                          variant="ghost"
                          className="w-8 h-8 p-0 text-white/40 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 rounded-2xl border border-white/10 bg-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">联合总额度</span>
                      <span className="text-[#18FF74]">
                        ¥{(quota + unitedList.length * 50000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Match Pool */}
              <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Radar className="w-5 h-5 text-[#00D6C2]" />
                  <h3 className="text-white">智能匹配池</h3>
                </div>
                <p className="text-white/60 text-sm mb-6">
                  基于地理位置、信用评分、种植类型等多维度智能匹配
                </p>

                <div className="space-y-3">
                  {matchPool.map((farmer) => (
                    <motion.div
                      key={farmer.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.01 }}
                      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                        unitedList.find((f) => f.id === farmer.id)
                          ? 'border-[#18FF74]/50 bg-[#18FF74]/10'
                          : 'border-white/20 bg-white/5 hover:border-[#00D6C2]/50'
                      }`}
                    >
                      {/* Similarity Badge */}
                      {farmer.similarity >= 80 && (
                        <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black text-xs">
                          可联合 {farmer.similarity}%
                        </div>
                      )}

                      {/* Particle Effect */}
                      {farmer.similarity >= 80 && (
                        <motion.div
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00D6C2]/20 to-[#18FF74]/20 blur-xl"
                        />
                      )}

                      <div className="relative flex items-center gap-4">
                        <img
                          src={farmer.avatar}
                          alt={farmer.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-white mb-1">{farmer.name}</p>
                          <div className="flex items-center gap-3 text-sm text-white/60">
                            <span>📍 {farmer.location}</span>
                            <span>⭐ {farmer.creditScore}</span>
                          </div>
                        </div>

                        {/* Similarity Radar */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="relative w-16 h-16">
                            <svg className="w-full h-full -rotate-90">
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="4"
                              />
                              <motion.circle
                                cx="32"
                                cy="32"
                                r="28"
                                fill="none"
                                stroke={farmer.similarity >= 80 ? '#18FF74' : '#00D6C2'}
                                strokeWidth="4"
                                strokeDasharray={`${2 * Math.PI * 28}`}
                                strokeDashoffset={`${2 * Math.PI * 28 * (1 - farmer.similarity / 100)}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - farmer.similarity / 100) }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-xs ${farmer.similarity >= 80 ? 'text-[#18FF74]' : 'text-[#00D6C2]'}`}>
                                {farmer.similarity}%
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-white/40">相似度</span>
                        </div>

                        <Button
                          onClick={() => {
                            if (unitedList.find((f) => f.id === farmer.id)) {
                              removeFarmer(farmer.id);
                              toast.success('已移除');
                            } else {
                              inviteFarmer(farmer);
                              toast.success('邀请成功');
                            }
                          }}
                          className={`h-10 px-6 rounded-xl transition-all duration-300 ${
                            unitedList.find((f) => f.id === farmer.id)
                              ? 'bg-red-500/20 border-2 border-red-500/50 text-red-400 hover:bg-red-500/30'
                              : 'bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90'
                          }`}
                        >
                          {unitedList.find((f) => f.id === farmer.id) ? '移除' : '邀请'}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* QR Code Modal */}
        {showQRCode && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQRCode(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border-2 border-[#00D6C2]/30 bg-[#0A0F1E]/95 backdrop-blur-xl p-8"
            >
              <h3 className="text-white text-center mb-6">扫码加入联合贷款</h3>
              <div className="w-full aspect-square bg-white rounded-2xl p-4 mb-6">
                <div className="w-full h-full bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 rounded-xl flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-[#00D6C2]" />
                </div>
              </div>
              <p className="text-center text-white/60 text-sm">
                邀请码：UNITED-{Date.now().toString().slice(-6)}
              </p>
            </motion.div>
          </div>
        )}

        {/* Fixed Bottom Bar */}
        {unitedEnabled && (
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0A0F1E]/95 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto px-4 py-4 pb-8">
              <Button
                onClick={handleConfirmUnited}
                disabled={isSubmitting || unitedList.length === 0}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full mr-2"
                    />
                    确认联合中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    确认联合贷款（{unitedList.length + 1}人）
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {loanResult && (
        <LoanSuccessModal
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false);
            window.location.href = '/';
          }}
          loanId={loanResult.loanId}
          amount={loanResult.amount}
          blockchainHash={loanResult.blockchainHash}
        />
      )}
    </>
  );
}
