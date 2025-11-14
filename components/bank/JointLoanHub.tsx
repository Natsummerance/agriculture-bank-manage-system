/**
 * 多人联合贷款Hub - G3
 * 银行发起 → 邀请同行 → 电子联名合同
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Building2,
  Plus,
  Send,
  CheckCircle,
  Clock,
  FileText,
  Shield,
  TrendingUp,
  AlertCircle,
  UserPlus,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Zap
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Bank {
  id: string;
  name: string;
  logo: string;
  shareRatio: number;
  status: 'invited' | 'accepted' | 'declined' | 'pending';
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

interface LoanProject {
  id: string;
  borrowerName: string;
  loanAmount: number;
  purpose: string;
  term: number;
  interestRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: Date;
  leadBank: string;
  participants: Bank[];
  status: 'draft' | 'inviting' | 'assembling' | 'contracted' | 'disbursed';
}

const mockBankList: Omit<Bank, 'shareRatio' | 'status'>[] = [
  {
    id: 'bank-001',
    name: '中国农业银行',
    logo: '🏦',
    contactPerson: '张经理',
    contactEmail: 'zhang@abc.com',
    contactPhone: '138-0000-0001'
  },
  {
    id: 'bank-002',
    name: '中国建设银行',
    logo: '🏛️',
    contactPerson: '李经理',
    contactEmail: 'li@ccb.com',
    contactPhone: '138-0000-0002'
  },
  {
    id: 'bank-003',
    name: '中国工商银行',
    logo: '🏢',
    contactPerson: '王经理',
    contactEmail: 'wang@icbc.com',
    contactPhone: '138-0000-0003'
  },
  {
    id: 'bank-004',
    name: '招商银行',
    logo: '🏪',
    contactPerson: '刘经理',
    contactEmail: 'liu@cmb.com',
    contactPhone: '138-0000-0004'
  },
  {
    id: 'bank-005',
    name: '浦发银行',
    logo: '🏬',
    contactPerson: '陈经理',
    contactEmail: 'chen@spdb.com',
    contactPhone: '138-0000-0005'
  }
];

const mockProject: LoanProject = {
  id: 'proj-001',
  borrowerName: '绿野农业科技有限公司',
  loanAmount: 5000000,
  purpose: '智慧农业物联网设备采购及温室大棚建设',
  term: 36,
  interestRate: 4.5,
  riskLevel: 'medium',
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  leadBank: '本行（主导行）',
  participants: [
    {
      ...mockBankList[0],
      shareRatio: 40,
      status: 'accepted'
    },
    {
      ...mockBankList[1],
      shareRatio: 30,
      status: 'pending'
    }
  ],
  status: 'inviting'
};

interface JointLoanHubProps {
  onClose?: () => void;
}

export function JointLoanHub({ onClose }: JointLoanHubProps) {
  const [project, setProject] = useState<LoanProject>(mockProject);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [shareRatios, setShareRatios] = useState<Record<string, number>>({});

  // 计算已分配比例
  const totalAllocated = project.participants.reduce((sum, bank) => sum + bank.shareRatio, 0);
  const leadBankShare = 100 - totalAllocated;

  // 风险等级颜色
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#18FF74';
      case 'medium': return '#FFD700';
      case 'high': return '#FF2566';
      default: return '#00D6C2';
    }
  };

  // 状态标签
  const getStatusBadge = (status: Bank['status']) => {
    const configs = {
      invited: { label: '已邀请', color: '#FFD700', icon: <Mail className="w-3 h-3" /> },
      accepted: { label: '已接受', color: '#18FF74', icon: <CheckCircle className="w-3 h-3" /> },
      declined: { label: '已拒绝', color: '#FF2566', icon: <AlertCircle className="w-3 h-3" /> },
      pending: { label: '待响应', color: '#00D6C2', icon: <Clock className="w-3 h-3" /> }
    };
    const config = configs[status];
    return (
      <div
        className="flex items-center gap-1 px-2 py-1 rounded text-xs"
        style={{ backgroundColor: `${config.color}20`, color: config.color }}
      >
        {config.icon}
        {config.label}
      </div>
    );
  };

  // 发送邀请
  const handleSendInvitations = () => {
    if (selectedBanks.length === 0) {
      toast.error('请至少选择一家银行');
      return;
    }

    // 验证份额分配
    const totalNewShare = Object.values(shareRatios).reduce((sum, ratio) => sum + ratio, 0);
    if (totalNewShare + totalAllocated > 100) {
      toast.error('总份额不能超过100%');
      return;
    }

    const newParticipants = selectedBanks.map(bankId => {
      const bank = mockBankList.find(b => b.id === bankId)!;
      return {
        ...bank,
        shareRatio: shareRatios[bankId] || 10,
        status: 'invited' as const
      };
    });

    setProject(prev => ({
      ...prev,
      participants: [...prev.participants, ...newParticipants]
    }));

    setShowInviteModal(false);
    setSelectedBanks([]);
    setShareRatios({});
    toast.success(`已向 ${newParticipants.length} 家银行发送邀请`);
  };

  // 生成联名合同
  const generateContract = () => {
    if (totalAllocated >= 100) {
      toast.error('请先调整份额分配');
      return;
    }
    toast.success('正在生成电子联名合同...');
    setTimeout(() => {
      setProject(prev => ({ ...prev, status: 'contracted' }));
      toast.success('电子联名合同已生成并发送给各参与行');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-5xl h-[90vh] glass-morphism rounded-2xl border border-[#00D6C2]/30 flex flex-col overflow-hidden"
      >
        {/* 头部 */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20">
                <Users className="w-6 h-6 text-[#00D6C2]" />
              </div>
              <div>
                <h2>多人联合贷款</h2>
                <p className="text-sm text-white/60">银行协同 · 风险共担 · 收益共享</p>
              </div>
            </div>
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 项目概览 */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1">{project.borrowerName}</h3>
                <p className="text-sm text-white/60">{project.purpose}</p>
              </div>
              <div
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: `${getRiskColor(project.riskLevel)}20`,
                  color: getRiskColor(project.riskLevel)
                }}
              >
                {project.riskLevel === 'low' ? '低风险' : 
                 project.riskLevel === 'medium' ? '中风险' : '高风险'}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                  <DollarSign className="w-4 h-4" />
                  贷款金额
                </div>
                <div className="text-2xl text-[#00D6C2]">
                  ¥{(project.loanAmount / 10000).toFixed(0)}万
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  贷款期限
                </div>
                <div className="text-2xl text-white">
                  {project.term}个月
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  年利率
                </div>
                <div className="text-2xl text-[#18FF74]">
                  {project.interestRate}%
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                  <Users className="w-4 h-4" />
                  参与银行
                </div>
                <div className="text-2xl text-white">
                  {project.participants.length + 1}家
                </div>
              </div>
            </div>
          </div>

          {/* 份额分配可视化 */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4>份额分配</h4>
              <span className="text-sm text-white/60">
                已分配 {totalAllocated}% · 主导行 {leadBankShare}%
              </span>
            </div>

            {/* 进度条可视化 */}
            <div className="h-12 bg-white/10 rounded-lg overflow-hidden flex mb-4">
              {/* 主导行 */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${leadBankShare}%` }}
                className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] flex items-center justify-center text-sm"
                style={{ minWidth: leadBankShare > 0 ? '80px' : '0' }}
              >
                {leadBankShare > 10 && `${leadBankShare}%`}
              </motion.div>

              {/* 参与行 */}
              {project.participants.map((bank, index) => (
                <motion.div
                  key={bank.id}
                  initial={{ width: 0 }}
                  animate={{ width: `${bank.shareRatio}%` }}
                  className="flex items-center justify-center text-sm text-white"
                  style={{
                    backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                    minWidth: bank.shareRatio > 0 ? '60px' : '0'
                  }}
                >
                  {bank.shareRatio > 8 && `${bank.shareRatio}%`}
                </motion.div>
              ))}

              {/* 未分配 */}
              {100 - totalAllocated - leadBankShare > 0 && (
                <div className="flex-1 bg-white/5 flex items-center justify-center text-xs text-white/40">
                  待分配
                </div>
              )}
            </div>

            {/* 主导行卡片 */}
            <div className="mb-3">
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 border-2 border-[#00D6C2]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center text-2xl">
                      🏦
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{project.leadBank}</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-[#18FF74]/20 text-[#18FF74]">
                          主导行
                        </span>
                      </div>
                      <div className="text-sm text-white/60">份额: {leadBankShare}%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl text-[#00D6C2]">
                      ¥{((project.loanAmount * leadBankShare / 100) / 10000).toFixed(0)}万
                    </div>
                    <div className="text-xs text-white/40">出资金额</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 参与行列表 */}
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {project.participants.map((bank, index) => (
                  <motion.div
                    key={bank.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                          {bank.logo}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white">{bank.name}</span>
                            {getStatusBadge(bank.status)}
                          </div>
                          <div className="text-xs text-white/40 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {bank.contactPerson}
                            </span>
                            <span>{bank.contactEmail}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className="text-sm text-white/60 mb-1">份额 {bank.shareRatio}%</div>
                        <div className="text-lg" style={{ color: getRiskColor('medium') }}>
                          ¥{((project.loanAmount * bank.shareRatio / 100) / 10000).toFixed(0)}万
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowInviteModal(true)}
              className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              邀请其他银行
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateContract}
              disabled={project.participants.some(p => p.status !== 'accepted')}
              className="flex-1 py-4 px-6 rounded-xl bg-white/10 text-white flex items-center justify-center gap-2 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-5 h-5" />
              生成联名合同
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 邀请银行弹窗 */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl glass-morphism rounded-2xl border border-[#00D6C2]/30 p-6"
            >
              <h3 className="mb-6">邀请参与银行</h3>

              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {mockBankList
                  .filter(bank => !project.participants.some(p => p.id === bank.id))
                  .map((bank) => {
                    const isSelected = selectedBanks.includes(bank.id);
                    return (
                      <motion.div
                        key={bank.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 border-2 border-[#00D6C2]'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => {
                          setSelectedBanks(prev =>
                            prev.includes(bank.id)
                              ? prev.filter(id => id !== bank.id)
                              : [...prev, bank.id]
                          );
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">
                              {bank.logo}
                            </div>
                            <div>
                              <div className="text-white mb-1">{bank.name}</div>
                              <div className="text-xs text-white/40">
                                {bank.contactPerson} · {bank.contactEmail}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  max="50"
                                  value={shareRatios[bank.id] || 10}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    setShareRatios(prev => ({
                                      ...prev,
                                      [bank.id]: Number(e.target.value)
                                    }));
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-16 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-center"
                                />
                                <span className="text-sm text-white/60">%</span>
                              </div>
                              <CheckCircle className="w-5 h-5 text-[#18FF74]" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-3 px-4 rounded-lg bg-white/10 text-white hover:bg-white/20"
                >
                  取消
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendInvitations}
                  className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  发送邀请 ({selectedBanks.length})
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
