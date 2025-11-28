import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { FileText, User, DollarSign, Calendar, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { useBankApprovalStore } from "../../../stores/bankApprovalStore";
import { useFinancingStore } from "../../../stores/financingStore";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function BankApprovalDetail() {
  const { id } = useParams<{ id: string }>();
  const { list: financingList, updateStatus } = useFinancingStore();
  const financing = financingList.find((f) => f.id === id);

  if (!financing) {
    return (
      <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/60">未找到对应的融资申请</p>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    updateStatus(financing.id, "approved");
    toast.success("已批准融资申请");
    navigateToSubRoute("finance", "approval/list");
  };

  const handleReject = () => {
    updateStatus(financing.id, "rejected");
    toast.success("已拒绝融资申请");
    navigateToSubRoute("finance", "approval/list");
  };

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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              融资申请详情
            </h2>
            <p className="text-sm text-white/60">
              申请编号：{financing.id}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("finance", "approval/list")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回列表
            </Button>
            {financing.status === "reviewing" && (
              <>
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  拒绝
                </Button>
                <Button
                  onClick={handleApprove}
                  className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  批准
                </Button>
              </>
            )}
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 申请信息 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-[#00D6C2]" />
              <h3 className="text-lg">申请信息</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60">申请人</span>
                <span className="text-white font-semibold">农户 #{financing.farmerId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">申请金额</span>
                <span className="text-[#18FF74] font-semibold text-xl">
                  ¥{financing.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">贷款期限</span>
                <span className="text-white">{financing.termMonths} 个月</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">申请用途</span>
                <span className="text-white">{financing.purpose || "未填写"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">还款方式</span>
                <span className="text-white">{financing.repayMethod || "等额本息"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">申请时间</span>
                <span className="text-white">{new Date(financing.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </motion.section>

          {/* 审批操作 */}
          {financing.status === "reviewing" && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-[#18FF74]" />
                <h3 className="text-lg">审批操作</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-2 block">审批意见</label>
                  <Textarea
                    placeholder="请输入审批意见..."
                    rows={4}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    拒绝申请
                  </Button>
                  <Button
                    onClick={handleApprove}
                    className="flex-1 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                  >
                    批准申请
                  </Button>
                </div>
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}

