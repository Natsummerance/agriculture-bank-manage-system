import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  CreditCard, 
  Plus, 
  ArrowRight, 
  FileText, 
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { navigateToTab } from "../../../utils/navigationEvents";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { useFinancingStore, type FinancingStatus } from "../../../stores/financingStore";
import { useRole } from "../../../contexts/RoleContext";
import { FilterPanel } from "../../../components/common/FilterPanel";
import { StatsCard } from "../../../components/common/StatsCard";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

const statusOptions: { label: string; value: FinancingStatus | "all" }[] = [
  { label: "全部", value: "all" },
  { label: "申请中", value: "applied" },
  { label: "审批中", value: "reviewing" },
  { label: "已通过", value: "approved" },
  { label: "还款中", value: "repaying" },
  { label: "已结清", value: "settled" },
];

const statusLabel: Record<FinancingStatus, string> = {
  applied: "申请中",
  reviewing: "审批中",
  approved: "已通过",
  rejected: "已拒绝",
  signed: "已签约",
  disbursed: "已放款",
  repaying: "还款中",
  settled: "已结清",
};

const statusColor: Record<FinancingStatus, string> = {
  applied: "text-cyan-400",
  reviewing: "text-blue-400",
  approved: "text-emerald-400",
  rejected: "text-red-400",
  signed: "text-green-400",
  disbursed: "text-teal-400",
  repaying: "text-amber-400",
  settled: "text-gray-400",
};

export default function FarmerFinancePanel() {
  const { userProfile } = useRole();
  const { list } = useFinancingStore();
  const [filterStatus, setFilterStatus] = useState<FinancingStatus | "all">("all");
  const [activeTab, setActiveTab] = useState<"list" | "apply">("list");

  const financingList = useMemo(() => {
    if (!userProfile) return [];
    return list.filter((f) => f.farmerId === userProfile.id);
  }, [list, userProfile]);

  const filtered = financingList.filter((f) =>
    filterStatus === "all" ? true : f.status === filterStatus,
  );

  const stats = useMemo(() => {
    const totalAmount = financingList.reduce((sum, f) => sum + f.amount, 0);
    const activeCount = financingList.filter((f) =>
      ["applied", "reviewing", "approved", "signed", "disbursed", "repaying"].includes(f.status)
    ).length;
    const repayingAmount = financingList
      .filter((f) => f.status === "repaying")
      .reduce((sum, f) => sum + f.amount, 0);
    const settledCount = financingList.filter((f) => f.status === "settled").length;

    return {
      totalAmount,
      activeCount,
      repayingAmount,
      settledCount,
    };
  }, [financingList]);

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              田心金融·我的融资
            </h2>
            <p className="text-sm text-white/60">
              管理所有融资申请与进度，查看还款计划，申请提前还款。
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Button
              onClick={() => {
                navigateToSubRoute("finance", "apply");
              }}
              className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              申请融资
            </Button>
          </motion.div>
        </motion.div>

        {/* 统计卡片 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">融资概览</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<CreditCard className="w-6 h-6 text-[#00D6C2]" />}
              title="累计融资总额"
              value={`¥${(stats.totalAmount / 10000).toFixed(1)}万`}
              subtitle={`${financingList.length} 笔融资记录`}
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-[#18FF74]" />}
              title="在途融资"
              value={stats.activeCount.toString()}
              subtitle="申请中/审批中/还款中"
            />
            <StatsCard
              icon={<Clock className="w-6 h-6 text-amber-400" />}
              title="还款中金额"
              value={`¥${(stats.repayingAmount / 10000).toFixed(1)}万`}
              subtitle="当前需还款总额"
            />
            <StatsCard
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              title="已结清"
              value={stats.settledCount.toString()}
              subtitle="已完成还款的融资"
            />
          </div>
        </motion.section>

        {/* Tab 切换 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 border-b border-white/10"
        >
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "list"
                ? "text-[#00D6C2]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            融资列表
            {activeTab === "list" && (
              <motion.div
                layoutId="financeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
              />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("apply");
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "apply"
                ? "text-[#00D6C2]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            申请融资
            {activeTab === "apply" && (
              <motion.div
                layoutId="financeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
              />
            )}
          </button>
        </motion.div>

        {/* 融资列表 */}
        {activeTab === "list" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                <h3 className="text-lg">融资记录</h3>
              </div>
              <FilterPanel
                title="状态"
                value={filterStatus}
                onChange={(v) => setFilterStatus(v as FinancingStatus | "all")}
                options={statusOptions}
              />
            </div>

            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center"
              >
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/60 mb-2">暂时还没有任何融资记录</p>
                <Button
                  onClick={() => setActiveTab("apply")}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  立即申请融资
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filtered.map((f, index) => (
                  <motion.button
                    key={f.id}
                    onClick={() => {
                      navigateToSubRoute("finance", `detail?id=${f.id}`);
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="w-full text-left rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CreditCard className="w-5 h-5 text-[#00D6C2]" />
                        <div className="text-xl font-semibold text-white">
                          ¥{f.amount.toLocaleString()}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColor[f.status]} bg-white/5`}>
                          {statusLabel[f.status]}
                        </span>
                      </div>
                      <div className="text-sm text-white/60 space-y-1">
                        <div>期限：{f.termMonths} 个月</div>
                        <div>创建时间：{new Date(f.createdAt).toLocaleString()}</div>
                        {f.purpose && (
                          <div className="text-xs text-white/50">用途：{f.purpose}</div>
                        )}
                      </div>
                    </div>
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowRight className="w-5 h-5 text-[#00D6C2]" />
                    </motion.div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </div>
    </div>
  );
}

