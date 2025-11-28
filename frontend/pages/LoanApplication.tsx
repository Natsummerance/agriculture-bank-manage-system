import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Sparkles, FileText, Send, ChevronRight, X, File, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLoanStore } from '../stores/loanStore';
import { LoanSuccessModal } from '../components/LoanSuccessModal';
import { toast } from 'sonner';

const steps = [
  { id: 0, name: '额度计算', icon: Sparkles },
  { id: 1, name: '填写信息', icon: FileText },
  { id: 2, name: '上传资料', icon: Upload },
];

export default function LoanApplication() {
  const {
    quota,
    duration,
    purpose,
    documents,
    setQuota,
    setDuration,
    setPurpose,
    addDocument,
    removeDocument,
    submitApplication,
    aiPrefill,
  } = useLoanStore();

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loanResult, setLoanResult] = useState<any>(null);

  const handleNext = () => {
    if (step === 0 && quota === 0) {
      toast.error('请设置贷款额度');
      return;
    }
    if (step === 1 && !purpose.trim()) {
      toast.error('请填写贷款用途');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (documents.length === 0) {
      toast.error('请至少上传一份资料');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitApplication();
      const mockResult = {
        loanId: `LOAN-${Date.now()}`,
        amount: quota,
        blockchainHash: `0x${Math.random().toString(16).slice(2, 34)}`,
      };
      setLoanResult(mockResult);
      setShowSuccess(true);
      toast.success('贷款申请提交成功！');
    } catch (error: any) {
      toast.error(error.message || '提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} 文件过大（限制10MB）`);
        return;
      }
      addDocument(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const calculateMonthlyPayment = () => {
    const monthlyRate = 0.05 / 12; // 年化5%
    const payment = (quota * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
      (Math.pow(1 + monthlyRate, duration) - 1);
    return payment.toFixed(2);
  };

  return (
    <>
      <div className="min-h-screen bg-[#0A0F1E] pb-32">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-white mb-6">贷款申请</h1>

            {/* Progress Bar */}
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <motion.div
                      animate={{
                        scale: step >= s.id ? 1 : 0.9,
                        borderColor: step >= s.id ? '#18FF74' : 'rgba(255,255,255,0.2)',
                        backgroundColor: step >= s.id ? 'rgba(24,255,116,0.1)' : 'transparent',
                      }}
                      className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                    >
                      <s.icon className={`w-5 h-5 ${step >= s.id ? 'text-[#18FF74]' : 'text-white/40'}`} />
                    </motion.div>
                    <span className={`text-xs ${step >= s.id ? 'text-white' : 'text-white/40'}`}>
                      {s.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px mx-2 mb-8">
                      <motion.div
                        animate={{
                          scaleX: step > s.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-[#18FF74] origin-left"
                      />
                      <div className="h-full bg-white/20" style={{ marginTop: '-1px' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Step 0: Calculate Quota */}
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white">额度计算器</h3>
                  <Button
                    onClick={aiPrefill}
                    variant="outline"
                    className="h-10 rounded-xl border-2 border-[#00D6C2]/50 bg-[#00D6C2]/10 text-[#00D6C2] hover:bg-[#00D6C2]/20"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI预填充
                  </Button>
                </div>

                {/* Quota Slider */}
                <div className="mb-8">
                  <label className="text-white/60 text-sm mb-4 block">贷款额度（元）</label>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={quota}
                    onChange={(e) => setQuota(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[#00D6C2] [&::-webkit-slider-thumb]:to-[#18FF74] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-[#00D6C2]/50"
                  />
                  <div className="flex justify-between mt-3">
                    <span className="text-white/40 text-sm">¥10,000</span>
                    <motion.span
                      key={quota}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-[#18FF74]"
                    >
                      ¥{quota.toLocaleString()}
                    </motion.span>
                    <span className="text-white/40 text-sm">¥1,000,000</span>
                  </div>
                </div>

                {/* Duration Slider */}
                <div className="mb-8">
                  <label className="text-white/60 text-sm mb-4 block">贷款期限（月）</label>
                  <input
                    type="range"
                    min="6"
                    max="60"
                    step="6"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[#00D6C2] [&::-webkit-slider-thumb]:to-[#18FF74] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-[#00D6C2]/50"
                  />
                  <div className="flex justify-between mt-3">
                    <span className="text-white/40 text-sm">6个月</span>
                    <motion.span
                      key={duration}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-[#00D6C2]"
                    >
                      {duration}个月
                    </motion.span>
                    <span className="text-white/40 text-sm">60个月</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl border-2 border-white/10 bg-white/5">
                    <p className="text-white/60 text-sm mb-2">月供金额</p>
                    <p className="text-[#18FF74]">¥{calculateMonthlyPayment()}</p>
                  </div>
                  <div className="p-6 rounded-2xl border-2 border-white/10 bg-white/5">
                    <p className="text-white/60 text-sm mb-2">总还款额</p>
                    <p className="text-[#00D6C2]">
                      ¥{(Number(calculateMonthlyPayment()) * duration).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Fill Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-8">
                <h3 className="text-white mb-6">贷款用途</h3>

                <div className="mb-6">
                  <label className="text-white/60 text-sm mb-3 block">详细说明</label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="请详细描述贷款用途，例如：购买有机肥料、种子，扩大种植面积..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-[#00D6C2] focus:outline-none transition-all duration-300 resize-none"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-white/40 text-xs">
                      请详细描述，有助于提高审批通过率
                    </span>
                    <span className="text-white/40 text-xs">{purpose.length}/500</span>
                  </div>
                </div>

                {/* Auto-saved indicator */}
                {purpose.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-[#00D6C2] text-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>已自动保存草稿</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Upload Documents */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-8">
                <h3 className="text-white mb-6">上传资料</h3>

                {/* Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                    isDragging
                      ? 'border-[#18FF74] bg-[#18FF74]/10'
                      : 'border-white/30 bg-white/5 hover:border-[#00D6C2]/50'
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-[#00D6C2]" />
                  <p className="text-white mb-2">拖拽文件到此处或点击上传</p>
                  <p className="text-white/60 text-sm">
                    支持 PDF、JPG、PNG 格式，单个文件不超过 10MB
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="text-xs text-[#00D6C2] bg-[#00D6C2]/10 px-3 py-1 rounded-full">
                      身份证
                    </span>
                    <span className="text-xs text-[#00D6C2] bg-[#00D6C2]/10 px-3 py-1 rounded-full">
                      土地证明
                    </span>
                    <span className="text-xs text-[#00D6C2] bg-[#00D6C2]/10 px-3 py-1 rounded-full">
                      收入证明
                    </span>
                  </div>
                </div>

                {/* Uploaded Files */}
                {documents.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <p className="text-white/60 text-sm">已上传 ({documents.length})</p>
                    {documents.map((doc, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 p-4 rounded-2xl border-2 border-white/10 bg-white/5"
                      >
                        <File className="w-10 h-10 text-[#00D6C2]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white truncate">{doc.name}</p>
                          <p className="text-white/60 text-sm">
                            {(doc.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#18FF74] bg-[#18FF74]/10 px-3 py-1 rounded-full">
                            已存证
                          </span>
                          <Button
                            onClick={() => removeDocument(index)}
                            variant="ghost"
                            className="w-8 h-8 p-0 text-white/40 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0A0F1E]/95 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-4 py-4 pb-8">
            <div className="flex gap-3">
              {step > 0 && (
                <Button
                  onClick={() => setStep(step - 1)}
                  variant="outline"
                  className="h-14 px-8 rounded-2xl border-2 border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  上一步
                </Button>
              )}

              {step < 2 ? (
                <Button
                  onClick={handleNext}
                  className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                >
                  下一步
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full mr-2"
                      />
                      提交申请中...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      提交申请
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
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
