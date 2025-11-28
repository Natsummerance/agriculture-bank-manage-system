import { useEffect } from "react";
import { motion } from "motion/react";
import { CreditCard, CheckCircle2, XCircle, Clock, ArrowRight, FileText } from "lucide-react";
import { useBankApprovalStore, type BankApprovalStatus } from "../../../stores/bankApprovalStore";
import { Button } from "../../../components/ui/button";
import { StatsCard } from "../../../components/common/StatsCard";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const mockApprovals = [
  {
    id: "fa_001",
    farmerName: "张三",
    amount: 200000,
    term: "12个月",
    purpose: "扩大水稻种植面积，购买农机设备",
    createdAt: "2025-03-01 10:00",
    status: "pending" as BankApprovalStatus,
  },
  {
    id: "fa_002",
    farmerName: "李四",
    amount: 500000,
    term: "24个月",
    purpose: "冷链仓储建设",
    createdAt: "2025-03-02 14:20",
    status: "approved" as BankApprovalStatus,
  },
];

export default function BankAppApproval() {
  const { approvals, setApprovals, selectedId, select, updateStatus } = useBankApprovalStore();

  useEffect(() => {
    if (approvals.length === 0) {
      setApprovals(mockApprovals);
    }
  }, [approvals.length, setApprovals]);

  const selected = approvals.find((a) => a.id === selectedId) ?? approvals[0];

  const handleDecision = (status: BankApprovalStatus) => {
    if (!selected) return;
    updateStatus(selected.id, status);
    toast.success(`已将申请 ${selected.id} 标记为 ${status}`);
  };

  const pendingCount = approvals.filter((a) => a.status === "pending").length;
  const approvedCount = approvals.filter((a) => a.status === "approved").length;
  const rejectedCount = approvals.filter((a) => a.status === "rejected").length;

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF8C00]">
              融资申请审批
            </h2>
            <p className="text-sm text-white/60">
              审核农户融资申请，进行风险评估和审批决策
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="text-sm px-3 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700]">
              {pendingCount} 个待审批
            </div>
          )}
        </motion.div>

        {/* 统计卡片 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard
              icon={<Clock className="w-6 h-6 text-[#FFD700]" />}
              title="待审批申请"
              value={`${pendingCount} 笔`}
              subtitle="需要处理的申请"
            />
            <StatsCard
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              title="已通过"
              value={`${approvedCount} 笔`}
              subtitle="已批准融资"
            />
            <StatsCard
              icon={<XCircle className="w-6 h-6 text-red-400" />}
              title="已拒绝"
              value={`${rejectedCount} 笔`}
              subtitle="已拒绝申请"
            />
          </div>
        </motion.section>

        <div className="grid gap-6 md:grid-cols-3">
          {/* 申请队列 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#FFD700] to-[#FF8C00] rounded-full" />
              <h3 className="text-lg">申请队列</h3>
            </div>
            <div className="space-y-2 max-h-[600px] overflow-auto">
              {approvals.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-8 text-center">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 text-white/20" />
                  <p className="text-white/60 text-sm">暂无申请</p>
                </div>
              ) : (
                approvals.map((a, index) => (
                  <motion.button
                    key={a.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    onClick={() => select(a.id)}
                    className={`w-full text-left rounded-2xl glass-morphism border p-4 transition-all ${
                      selected?.id === a.id
                        ? "border-[#FFD700] bg-[#FFD700]/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{a.farmerName}</span>
                      <span className="text-xs text-white/60">{a.createdAt}</span>
                    </div>
                    <div className="text-sm text-white/60 mb-1">
                      申请金额：<span className="text-[#FFD700] font-mono font-semibold">¥{a.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          a.status === "pending"
                            ? "bg-amber-400/20 text-amber-400"
                            : a.status === "approved"
                            ? "bg-emerald-400/20 text-emerald-400"
                            : "bg-red-400/20 text-red-400"
                        }`}
                      >
                        {a.status === "pending" ? "待审批" : a.status === "approved" ? "已通过" : "已拒绝"}
                      </span>
                      {selected?.id === a.id && (
                        <ArrowRight className="w-4 h-4 text-[#FFD700]" />
                      )}
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.section>

          {/* 申请详情 */}
          {selected && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 space-y-6"
            >
              <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-[#FFD700]" />
                  <h3 className="text-lg">申请详情</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-white/60 mb-1">申请编号</div>
                      <div className="text-white font-mono">{selected.id}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-1">农户名称</div>
                      <div className="text-white">{selected.farmerName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-1">申请金额</div>
                      <div className="text-2xl font-semibold text-[#FFD700]">
                        ¥{selected.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-white/60 mb-1">申请期限</div>
                      <div className="text-white">{selected.term}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-1">提交时间</div>
                      <div className="text-white">{selected.createdAt}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/60 mb-1">资金用途</div>
                      <div className="text-white">{selected.purpose}</div>
                    </div>
                  </div>
                </div>
                {selected.status === "pending" && (
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button
                      onClick={() => {
                        navigateToSubRoute("finance", `scoring?id=${selected.id}`);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      查看评分卡
                    </Button>
                    <Button
                      onClick={() => handleDecision("approved")}
                      className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black hover:opacity-90"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      通过
                    </Button>
                    <Button
                      onClick={() => handleDecision("rejected")}
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      拒绝
                    </Button>
                    <Button
                      onClick={() => handleDecision("returned")}
                      variant="outline"
                      className="flex-1"
                    >
                      退回补充
                    </Button>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}
