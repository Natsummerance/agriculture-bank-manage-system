import { useMemo } from "react";
import { motion } from "motion/react";
import { CreditCard, TrendingUp, AlertTriangle, Clock, CheckCircle2, DollarSign } from "lucide-react";
import { StatsCard } from "../../../components/common/StatsCard";
import { SimpleLineChart } from "../../../components/common/SimpleLineChart";
import { Button } from "../../../components/ui/button";
import { WebGLSphere } from "../../../components/WebGLSphere";
import { useFinancingStore } from "../../../stores/financingStore";
import { useBankApprovalStore } from "../../../stores/bankApprovalStore";
import { navigateToTab } from "../../../utils/navigationEvents";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function BankDashboardPage() {
  const { list: financingList } = useFinancingStore();
  const { approvals } = useBankApprovalStore();

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayDisbursed = financingList.filter(
      (f) => f.status === "disbursed" && new Date(f.updatedAt).toDateString() === today
    );
    const todayAmount = todayDisbursed.reduce((sum, f) => sum + f.amount, 0);

    const outstandingLoans = financingList.filter(
      (f) => f.status === "disbursed" || f.status === "repaying"
    );
    const outstandingAmount = outstandingLoans.reduce((sum, f) => sum + f.amount, 0);

    const pendingApprovals = approvals.filter((a) => a.status === "pending").length;

    const overdueLoans = financingList.filter((f) => {
      if (!f.repaymentSchedule) return false;
      return f.repaymentSchedule.some((i) => i.status === "overdue");
    }).length;

    return {
      todayDisbursed: todayDisbursed.length,
      todayAmount,
      outstandingLoans: outstandingLoans.length,
      outstandingAmount,
      pendingApprovals,
      overdueLoans,
    };
  }, [financingList, approvals]);

  const mockTrend = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        name: `${i + 1}月`,
        value: Math.round((stats.outstandingAmount / 6) * (0.8 + Math.random() * 0.4) / 10000),
      })),
    [stats.outstandingAmount]
  );

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* WebGL星球 */}
        <WebGLSphere 
          title="资本星云·风控驾驶舱"
          subtitle="实时监控放款、在贷余额与风险指标"
          gradientFrom="#FFD700"
          gradientTo="#FF8C00"
        />

        {/* 核心指标 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<DollarSign className="w-6 h-6 text-[#00D6C2]" />}
              title="今日放款"
              value={`¥${(stats.todayAmount / 10000).toFixed(1)}万`}
              subtitle={`${stats.todayDisbursed} 笔融资`}
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-[#18FF74]" />}
              title="在贷余额"
              value={`¥${(stats.outstandingAmount / 10000).toFixed(1)}万`}
              subtitle={`${stats.outstandingLoans} 笔在途融资`}
            />
            <StatsCard
              icon={<Clock className="w-6 h-6 text-amber-400" />}
              title="待审批申请"
              value={stats.pendingApprovals.toString()}
              subtitle="需要处理的融资申请"
            />
            <StatsCard
              icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
              title="风险预警"
              value={stats.overdueLoans.toString()}
              subtitle="逾期融资项目"
            />
          </div>
        </motion.section>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 在贷余额趋势 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00D6C2] to-[#18FF74]" />
              <div>
                <h3 className="text-base font-semibold">在贷余额趋势（最近6个月）</h3>
                <p className="text-xs text-white/60">单位：万元</p>
              </div>
            </div>
            <SimpleLineChart data={mockTrend} />
          </motion.section>

          {/* 快捷入口 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00D6C2] to-[#18FF74]" />
              <div>
                <h3 className="text-base font-semibold">业务入口</h3>
                <p className="text-xs text-white/60">快速进入各业务模块</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToTab("cart")}
              >
                <Clock className="w-4 h-4 mr-2" />
                审批中心
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToSubRoute("finance", "products")}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                产品中心
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToSubRoute("finance", "disbursement")}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                放款中心
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToSubRoute("finance", "post-loan")}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                贷后管理
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToSubRoute("finance", "reconciliation")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                对账中心
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToTab("trade")}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                风控仪表盘
              </Button>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
