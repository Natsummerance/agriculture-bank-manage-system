import { useState } from "react";
import { motion } from "motion/react";
import { 
  DollarSign,
  TrendingUp,
  BarChart3,
  AlertTriangle
} from "lucide-react";
import { useFinancingStore } from "../../../stores/financingStore";
import { StatsCard } from "../../../components/common/StatsCard";
import { SimpleLineChart } from "../../../components/common/SimpleLineChart";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function AdminFinancePanel() {
  const { list: financingList } = useFinancingStore();
  const [activeTab, setActiveTab] = useState<"overview" | "monitor">("overview");

  const stats = {
    totalApplications: financingList.length,
    pendingApprovals: financingList.filter((f) => f.status === "reviewing").length,
    approvedCount: financingList.filter((f) => f.status === "approved" || f.status === "signed" || f.status === "disbursed").length,
    totalAmount: financingList.reduce((sum, f) => sum + f.amount, 0),
    repayingAmount: financingList.filter((f) => f.status === "repaying").reduce((sum, f) => sum + f.amount, 0),
  };

  const mockTrend = Array.from({ length: 6 }).map((_, i) => ({
    name: `${i + 1}月`,
    value: Math.max(0, Math.round(stats.totalAmount / 6 || 0)),
  }));

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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D]">
              控制资本·融资监控
            </h2>
            <p className="text-sm text-white/60">
              监控全平台融资申请、审批、放款与还款情况。
            </p>
          </div>
        </motion.div>

        {/* Tab 切换 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 border-b border-white/10"
        >
          {[
            { id: "overview", label: "概览" },
            { id: "monitor", label: "监控" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  isActive ? "text-[#FF6B9D]" : "text-white/60 hover:text-white/80"
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="adminFinanceTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D]"
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* 概览 */}
        {activeTab === "overview" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#9D4EDD] to-[#FF6B9D] rounded-full" />
              <h3 className="text-lg">融资统计</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <StatsCard
                icon={<DollarSign className="w-6 h-6 text-[#00D6C2]" />}
                title="融资申请总数"
                value={stats.totalApplications.toString()}
                subtitle="所有融资申请"
              />
              <StatsCard
                icon={<TrendingUp className="w-6 h-6 text-[#18FF74]" />}
                title="待审批"
                value={stats.pendingApprovals.toString()}
                subtitle="审批中的申请"
              />
              <StatsCard
                icon={<BarChart3 className="w-6 h-6 text-amber-400" />}
                title="已通过"
                value={stats.approvedCount.toString()}
                subtitle="已批准申请"
              />
              <StatsCard
                icon={<AlertTriangle className="w-6 h-6 text-emerald-400" />}
                title="还款中金额"
                value={`¥${(stats.repayingAmount / 10000).toFixed(1)}万`}
                subtitle="当前还款总额"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00D6C2] to-[#18FF74]" />
                  <div>
                    <h3 className="text-base font-semibold">近 6 个月融资趋势</h3>
                    <p className="text-xs text-white/60">
                      用于把握融资节奏
                    </p>
                  </div>
                </div>
              </div>
              <SimpleLineChart data={mockTrend} />
            </motion.div>
          </motion.section>
        )}

        {/* 监控 */}
        {activeTab === "monitor" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#9D4EDD] to-[#FF6B9D] rounded-full" />
              <h3 className="text-lg">融资监控</h3>
            </div>
            <div className="space-y-4">
              {financingList.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-white/20" />
                  <p className="text-white/60 mb-2">暂无融资数据</p>
                  <p className="text-sm text-white/40">
                    当有融资申请时，数据将显示在这里
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {financingList.slice(0, 10).map((f, index) => (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-4 flex items-center justify-between cursor-pointer"
                      onClick={() => navigateToSubRoute("finance", `approval/detail?id=${f.id}`)}
                    >
                      <div>
                        <div className="font-semibold text-white">
                          申请金额：¥{f.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-white/60">
                          申请时间：{new Date(f.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          f.status === "reviewing" ? "text-amber-400 bg-amber-400/20" :
                          f.status === "approved" ? "text-emerald-400 bg-emerald-400/20" :
                          "text-white/60 bg-white/10"
                        }`}>
                          {f.status === "reviewing" ? "审批中" :
                           f.status === "approved" ? "已通过" :
                           f.status === "rejected" ? "已拒绝" : f.status}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

