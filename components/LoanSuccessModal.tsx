import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, FileText, Share2, Wallet } from 'lucide-react';
import { Button } from './ui/button';

interface LoanSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
  amount: number;
  blockchainHash: string;
}

export function LoanSuccessModal({ isOpen, onClose, loanId, amount, blockchainHash }: LoanSuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="mx-4 rounded-3xl border-2 border-[#18FF74]/30 bg-[#0A0F1E]/95 backdrop-blur-xl p-8">
              {/* Success Icon with Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 rounded-full bg-[#18FF74]/30 blur-2xl"
                  />
                  <CheckCircle2 className="w-20 h-20 text-[#18FF74] relative z-10" strokeWidth={2} />
                </div>
              </motion.div>

              {/* Title */}
              <h2 className="text-center mb-2 text-white">
                贷款申请成功
              </h2>
              <p className="text-center text-[#00D6C2] mb-6">
                预计 1-3 个工作日内到账
              </p>

              {/* Info Cards */}
              <div className="space-y-3 mb-8">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">贷款编号</span>
                    <span className="text-white">{loanId}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">贷款金额</span>
                    <span className="text-[#18FF74]">¥ {amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-white/60">区块链存证</span>
                    <span className="text-[#00D6C2] text-xs break-all font-mono">
                      {blockchainHash}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    // Navigate to contract view
                    console.log('View contract');
                    onClose();
                  }}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90 transition-all duration-300"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  查看合同
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      // Share success
                      console.log('Share success');
                    }}
                    variant="outline"
                    className="h-12 rounded-2xl border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    分享
                  </Button>

                  <Button
                    onClick={() => {
                      // Navigate to repayment
                      console.log('Go to repayment');
                      onClose();
                    }}
                    variant="outline"
                    className="h-12 rounded-2xl border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    还款
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
