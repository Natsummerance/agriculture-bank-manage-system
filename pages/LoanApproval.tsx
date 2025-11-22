import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Video, CheckCircle, XCircle, FileText, AlertCircle, TrendingUp, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

interface LoanApplicationData {
  id: string;
  applicant: string;
  avatar: string;
  amount: number;
  purpose: string;
  duration: number;
  creditScore: number;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  location: string;
  farmSize: string;
  isUnited: boolean;
  unitedMembers?: number;
}

const mockApplications: LoanApplicationData[] = [
  {
    id: 'LOAN-001',
    applicant: '张三农场',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=applicant1',
    amount: 80000,
    purpose: '购买有机肥料和种子，扩大种植面积',
    duration: 24,
    creditScore: 850,
    documents: ['身份证.pdf', '土地证明.pdf', '收入证明.pdf'],
    status: 'pending',
    appliedAt: '2025-11-05',
    location: '四川成都',
    farmSize: '50亩',
    isUnited: false,
  },
  {
    id: 'UNITED-002',
    applicant: '李四种植园',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=applicant2',
    amount: 150000,
    purpose: '联合采购农机设备',
    duration: 36,
    creditScore: 820,
    documents: ['联合协议.pdf', '设备清单.pdf', '收入证明.pdf'],
    status: 'pending',
    appliedAt: '2025-11-06',
    location: '山东济南',
    farmSize: '80亩',
    isUnited: true,
    unitedMembers: 3,
  },
];

export default function LoanApproval() {
  const [applications] = useState<LoanApplicationData[]>(mockApplications);
  const [selectedApp, setSelectedApp] = useState<LoanApplicationData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleDownloadDocs = async () => {
    setIsDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsDownloading(false);
    toast.success('资料下载完成');
  };

  const handleApprove = async () => {
    if (!selectedApp) return;
    setIsApproving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsApproving(false);
    toast.success('贷款审批通过');
    setSelectedApp(null);
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    setIsApproving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsApproving(false);
    toast.error('贷款审批拒绝');
    setSelectedApp(null);
  };

  const calculateRiskScore = (app: LoanApplicationData) => {
    let score = 100;
    if (app.creditScore < 700) score -= 30;
    else if (app.creditScore < 800) score -= 15;
    if (app.amount > 100000) score -= 10;
    if (app.duration > 36) score -= 10;
    if (app.isUnited) score += 15;
    return Math.max(0, Math.min(100, score));
  };

  if (selectedApp) {
    const riskScore = calculateRiskScore(selectedApp);

    return (
      <div className="min-h-screen bg-[#0A0F1E] pb-40">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Button
                  onClick={() => setSelectedApp(null)}
                  variant="ghost"
                  className="text-white/60 hover:text-white mb-2"
                >
                  ← 返回列表
                </Button>
                <h1 className="text-white">审批详情</h1>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleDownloadDocs}
                  disabled={isDownloading}
                  variant="outline"
                  className="h-10 rounded-xl border-2 border-[#00D6C2]/50 bg-[#00D6C2]/10 text-[#00D6C2] hover:bg-[#00D6C2]/20"
                >
                  {isDownloading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-[#00D6C2]/30 border-t-[#00D6C2] rounded-full mr-2"
                      />
                      下载中...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      打包下载
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowVideoModal(true)}
                  variant="outline"
                  className="h-10 rounded-xl border-2 border-[#18FF74]/50 bg-[#18FF74]/10 text-[#18FF74] hover:bg-[#18FF74]/20"
                >
                  <Video className="w-4 h-4 mr-2" />
                  合同面签
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Applicant Info */}
              <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-white mb-4">申请人信息</h3>
                <div className="flex items-start gap-4">
                  <img
                    src={selectedApp.avatar}
                    alt={selectedApp.applicant}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white">{selectedApp.applicant}</h4>
                      {selectedApp.isUnited && (
                        <span className="text-xs text-[#18FF74] bg-[#18FF74]/20 px-3 py-1 rounded-full">
                          联合贷款 ({selectedApp.unitedMembers}人)
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-white/60">
                      <div>📍 {selectedApp.location}</div>
                      <div>🌾 {selectedApp.farmSize}</div>
                      <div>📅 {selectedApp.appliedAt}</div>
                      <div>⭐ 信用评分 {selectedApp.creditScore}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-white mb-4">贷款详情</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">贷款编号</span>
                      <span className="text-white font-mono">{selectedApp.id}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">申请金额</span>
                      <span className="text-[#18FF74]">¥{selectedApp.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">贷款期限</span>
                      <span className="text-white">{selectedApp.duration}个月</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
                    <div className="flex flex-col gap-2">
                      <span className="text-white/60">贷款用途</span>
                      <p className="text-white">{selectedApp.purpose}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-white mb-4">上传资料</h3>
                <div className="space-y-3">
                  {selectedApp.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5"
                    >
                      <FileText className="w-10 h-10 text-[#00D6C2]" />
                      <div className="flex-1">
                        <p className="text-white">{doc}</p>
                        <p className="text-white/60 text-sm">已通过OCR识别与区块链存证</p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-[#00D6C2] hover:text-[#00D6C2]/80"
                      >
                        查看
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Scoring */}
            <div className="space-y-6">
              {/* Risk Score Card */}
              <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-[#00D6C2]" />
                  <h3 className="text-white">风险评分</h3>
                </div>

                <div className="relative w-40 h-40 mx-auto mb-6">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="12"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke={riskScore >= 70 ? '#18FF74' : riskScore >= 40 ? '#FFB800' : '#FF6B9D'}
                      strokeWidth="12"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - riskScore / 100)}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - riskScore / 100) }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl ${riskScore >= 70 ? 'text-[#18FF74]' : riskScore >= 40 ? 'text-[#FFB800]' : 'text-[#FF6B9D]'}`}>
                      {riskScore}
                    </span>
                    <span className="text-white/60 text-sm">风险分</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">信用评分</span>
                    <span className={selectedApp.creditScore >= 800 ? 'text-[#18FF74]' : 'text-[#FFB800]'}>
                      {selectedApp.creditScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">贷款金额</span>
                    <span className={selectedApp.amount <= 100000 ? 'text-[#18FF74]' : 'text-[#FFB800]'}>
                      {selectedApp.amount <= 100000 ? '低' : '中'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">贷款期限</span>
                    <span className={selectedApp.duration <= 36 ? 'text-[#18FF74]' : 'text-[#FFB800]'}>
                      {selectedApp.duration <= 36 ? '短期' : '长期'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">联合贷款</span>
                    <span className={selectedApp.isUnited ? 'text-[#18FF74]' : 'text-white/40'}>
                      {selectedApp.isUnited ? '是' : '否'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#00D6C2]" />
                  <h3 className="text-white">综合评估</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { label: '信用历史', value: 90 },
                    { label: '还款能力', value: 75 },
                    { label: '资产状况', value: 80 },
                    { label: '经营稳定性', value: 85 },
                    { label: '资料完整性', value: 95 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/60 text-sm">{item.label}</span>
                        <span className="text-[#00D6C2] text-sm">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className={`rounded-3xl border-2 p-6 ${
                riskScore >= 70
                  ? 'border-[#18FF74]/30 bg-[#18FF74]/5'
                  : riskScore >= 40
                  ? 'border-[#FFB800]/30 bg-[#FFB800]/5'
                  : 'border-[#FF6B9D]/30 bg-[#FF6B9D]/5'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 mt-0.5 ${
                    riskScore >= 70
                      ? 'text-[#18FF74]'
                      : riskScore >= 40
                      ? 'text-[#FFB800]'
                      : 'text-[#FF6B9D]'
                  }`} />
                  <div>
                    <h4 className="text-white mb-2">
                      {riskScore >= 70 ? '建议通过' : riskScore >= 40 ? '建议人工审核' : '建议拒绝'}
                    </h4>
                    <p className="text-white/60 text-sm">
                      {riskScore >= 70
                        ? '该申请人信用良好，风险可控，建议批准贷款申请。'
                        : riskScore >= 40
                        ? '该申请存在一定风险，建议进行人工详细审核。'
                        : '该申请风险较高，建议拒绝或要求补充资料。'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {showVideoModal && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl rounded-3xl border-2 border-[#00D6C2]/30 bg-[#0A0F1E]/95 backdrop-blur-xl p-8"
            >
              <h3 className="text-white mb-6">合同面签（WebRTC多方视频）</h3>
              <div className="aspect-video bg-black rounded-2xl mb-6 flex items-center justify-center">
                <Video className="w-20 h-20 text-white/40" />
              </div>
              <p className="text-white/60 text-sm text-center">
                视频面签功能演示区域
              </p>
            </motion.div>
          </div>
        )}

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0A0F1E]/95 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 py-4 pb-8">
            <div className="flex gap-3">
              <Button
                onClick={handleReject}
                disabled={isApproving}
                className="flex-1 h-14 rounded-2xl bg-red-500/20 border-2 border-red-500/50 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
              >
                <XCircle className="w-5 h-5 mr-2" />
                拒绝
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isApproving}
                className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90 disabled:opacity-50"
              >
                {isApproving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full mr-2"
                    />
                    处理中...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    通过
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-white mb-4">贷款审批</h1>

          {/* KPI Dashboard */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '待审批', value: 12, color: '#FFB800' },
              { label: '已通过', value: 156, color: '#18FF74' },
              { label: '已拒绝', value: 23, color: '#FF6B9D' },
              { label: '通过率', value: '87%', color: '#00D6C2' },
            ].map((kpi, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl border-2 border-white/10 bg-white/5"
              >
                <p className="text-white/60 text-sm mb-1">{kpi.label}</p>
                <p className="text-2xl" style={{ color: kpi.color }}>
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {applications.map((app) => (
            <motion.button
              key={app.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedApp(app)}
              className="w-full p-6 rounded-3xl border-2 border-[#00D6C2]/30 bg-white/5 backdrop-blur-xl text-left hover:border-[#00D6C2]/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <img
                  src={app.avatar}
                  alt={app.applicant}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white">{app.applicant}</h3>
                    {app.isUnited && (
                      <span className="text-xs text-[#18FF74] bg-[#18FF74]/20 px-3 py-1 rounded-full">
                        联合贷款
                      </span>
                    )}
                    <span className="text-xs text-[#FFB800] bg-[#FFB800]/20 px-3 py-1 rounded-full">
                      待审批
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm text-white/60">
                    <div>编号：{app.id}</div>
                    <div>金额：¥{app.amount.toLocaleString()}</div>
                    <div>期限：{app.duration}个月</div>
                    <div>信用：{app.creditScore}</div>
                  </div>
                </div>
                <Button
                  className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                >
                  进入审批
                </Button>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
