import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  Calendar,
  FileText,
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { useFinancingStore } from "../../../stores/financingStore";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { StatsCard } from "../../../components/common/StatsCard";

const statusLabel: Record<string, string> = {
  applied: "申请中",
  reviewing: "审批中",
  approved: "已通过",
  rejected: "已拒绝",
  signed: "已签约",
  disbursed: "已放款",
  repaying: "还款中",
  settled: "已结清",
};

const statusColor: Record<string, string> = {
  applied: "text-cyan-400",
  reviewing: "text-blue-400",
  approved: "text-emerald-400",
  rejected: "text-red-400",
  signed: "text-green-400",
  disbursed: "text-teal-400",
  repaying: "text-amber-400",
  settled: "text-gray-400",
};

export default function FinanceDetail() {
  const { list } = useFinancingStore();
  const [financingId, setFinancingId] = useState<string | null>(null);

  // 从 URL 参数或 store 中获取融资 ID
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setFinancingId(id);
    } else if (list.length > 0) {
      setFinancingId(list[0].id);
    }
  }, [list]);

  const financing = financingId ? list.find((f) => f.id === financingId) : null;

  if (!financing) {
    return (
      <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60 mb-2">未找到对应的融资记录</p>
            <Button
              onClick={() => navigateToSubRoute("finance", "list")}
              variant="outline"
              className="mt-4"
            >
              返回列表
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const repaymentSchedule = financing.repaymentSchedule || [];
  const paidCount = repaymentSchedule.filter((i) => i.status === "paid").length;
  const pendingAmount = repaymentSchedule
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((sum, i) => sum + i.principal + i.interest, 0);

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
              融资详情
            </h2>
            <p className="text-sm text-white/60">
              融资编号：{financing.id} · 创建时间：{new Date(financing.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("finance", "list")}
              className="border-white/20 bg-white/5 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回列表
            </Button>
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("finance", `progress?id=${financing.id}`)}
              className="border-white/20 bg-white/5 hover:bg-white/10"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              查看进度
            </Button>
            {financing.status === "approved" && (
              <Button
                variant="outline"
                onClick={() => navigateToSubRoute("finance", `contract-sign?id=${financing.id}`)}
                className="border-[#00D6C2]/30 bg-[#00D6C2]/10 text-[#00D6C2] hover:bg-[#00D6C2]/20"
              >
                <FileText className="w-4 h-4 mr-2" />
                电子合同签署
              </Button>
            )}
            {financing.status === "repaying" && (
              <Button
                variant="outline"
                onClick={() => navigateToSubRoute("finance", `early-repay?id=${financing.id}`)}
                className="border-amber-400/30 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                提前还款试算
              </Button>
            )}
          </div>
        </motion.div>

        {/* 核心信息卡片 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<CreditCard className="w-6 h-6 text-[#18FF74]" />}
              title="申请金额"
              value={`¥${(financing.amount / 10000).toFixed(1)}万`}
              subtitle={`${financing.amount.toLocaleString()} 元`}
            />
            <StatsCard
              icon={<Calendar className="w-6 h-6 text-[#00D6C2]" />}
              title="融资期限"
              value={`${financing.termMonths} 个月`}
              subtitle={`约 ${Math.round(financing.termMonths / 12)} 年`}
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-amber-400" />}
              title="当前状态"
              value={statusLabel[financing.status] || financing.status}
              subtitle="融资状态"
            />
            {repaymentSchedule.length > 0 && (
              <StatsCard
                icon={<DollarSign className="w-6 h-6 text-emerald-400" />}
                title="待还总额"
                value={`¥${(pendingAmount / 10000).toFixed(1)}万`}
                subtitle={`已还 ${paidCount}/${repaymentSchedule.length} 期`}
              />
            )}
          </div>
        </motion.section>

        {/* 详细信息 */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 基本信息 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#18FF74] to-[#00D6C2] rounded-full" />
              <h3 className="text-lg">基本信息</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60">融资编号</span>
                <span className="text-white font-mono">{financing.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">资金用途</span>
                <span className="text-white">{financing.purpose || "未填写"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">创建时间</span>
                <span className="text-white">{new Date(financing.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">更新时间</span>
                <span className="text-white">{new Date(financing.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </motion.section>

          {/* 时间线 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#18FF74] to-[#00D6C2] rounded-full" />
              <h3 className="text-lg">操作时间线</h3>
            </div>
            {financing.timeline.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto mb-3 text-white/20" />
                <p className="text-white/60">暂时没有时间线记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {financing.timeline.map((t, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="relative pl-6 border-l-2 border-[#00D6C2]/30"
                  >
                    <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-gradient-to-br from-[#18FF74] to-[#00D6C2]" />
                    <div className="text-xs text-white/60 mb-1">
                      {new Date(t.at).toLocaleString()} ·{" "}
                      {t.actor === "farmer" ? "农户" : t.actor === "bank" ? "银行" : "平台"}
                    </div>
                    <div className="text-white font-semibold mb-1">{t.action}</div>
                    {t.note && <div className="text-sm text-white/60">{t.note}</div>}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </div>

        {/* 还款计划 */}
        {repaymentSchedule.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#18FF74] to-[#00D6C2] rounded-full" />
                <h3 className="text-lg">还款计划</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToSubRoute("finance", `repay-plan?id=${financing.id}`)}
                className="border-white/20 bg-white/5 hover:bg-white/10"
              >
                查看完整计划
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {repaymentSchedule.slice(0, 4).map((installment, index) => (
                <motion.div
                  key={installment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">第 {index + 1} 期</div>
                    <div className="text-xs text-white/60">
                      {new Date(installment.dueDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      {installment.status === "paid" ? (
                        <span className="text-emerald-400">已还清</span>
                      ) : installment.status === "overdue" ? (
                        <span className="text-red-400">已逾期</span>
                      ) : (
                        <span className="text-amber-400">待还款</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-[#00D6C2]">
                      ¥{(installment.principal + installment.interest).toLocaleString()}
                    </div>
                    <div className="text-xs text-white/60">
                      本金 ¥{installment.principal.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {repaymentSchedule.length > 4 && (
              <div className="text-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToSubRoute("finance", `repay-plan?id=${financing.id}`)}
                  className="border-white/20 bg-white/5 hover:bg-white/10"
                >
                  查看全部 {repaymentSchedule.length} 期
                </Button>
              </div>
            )}
          </motion.section>
        )}
      </div>
    </div>
  );
}
