import { useMemo } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Clock, TrendingUp, DollarSign, Phone, Mail, CheckCircle2 } from "lucide-react";
import { useFinancingStore } from "../../../stores/financingStore";
import { StatsCard } from "../../../components/common/StatsCard";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function BankOverdueAlert() {
  const { list } = useFinancingStore();

  const overdueData = useMemo(() => {
    const overdueFinancings = list.filter((f) => {
      if (!f.repaymentSchedule) return false;
      return f.repaymentSchedule.some((i) => i.status === "overdue");
    });

    const totalOverdueAmount = overdueFinancings.reduce((sum, f) => {
      const overdueItems = f.repaymentSchedule?.filter((i) => i.status === "overdue") || [];
      return sum + overdueItems.reduce((s, i) => s + i.principal + i.interest, 0);
    }, 0);

    const overdueCount = overdueFinancings.length;
    const overdueDays = overdueFinancings.map((f) => {
      const overdueItem = f.repaymentSchedule?.find((i) => i.status === "overdue");
      if (!overdueItem) return 0;
      const dueDate = new Date(overdueItem.dueDate);
      const now = new Date();
      return Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    });

    return {
      overdueFinancings,
      totalOverdueAmount,
      overdueCount,
      maxOverdueDays: Math.max(...overdueDays, 0),
      avgOverdueDays: overdueDays.length > 0 ? overdueDays.reduce((a, b) => a + b, 0) / overdueDays.length : 0,
    };
  }, [list]);

  const handleContact = (farmerName: string) => {
    toast.success(`联系 ${farmerName}`);
  };

  const handleSendAlert = (financingId: string) => {
    toast.success(`已发送逾期提醒给融资 ${financingId}`);
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF8C00]">
              逾期预警
            </h2>
            <p className="text-sm text-white/60">
              监控逾期融资，及时处理风险
            </p>
          </div>
          {overdueData.overdueCount > 0 && (
            <div className="text-sm px-3 py-1 rounded-full bg-red-500/20 text-red-400">
              {overdueData.overdueCount} 笔逾期
            </div>
          )}
        </motion.div>

        {/* 统计卡片 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
              title="逾期笔数"
              value={overdueData.overdueCount.toString()}
              subtitle="需要处理的逾期融资"
            />
            <StatsCard
              icon={<DollarSign className="w-6 h-6 text-[#FFD700]" />}
              title="逾期金额"
              value={`¥${(overdueData.totalOverdueAmount / 10000).toFixed(1)}万`}
              subtitle="累计逾期金额"
            />
            <StatsCard
              icon={<Clock className="w-6 h-6 text-amber-400" />}
              title="平均逾期天数"
              value={`${overdueData.avgOverdueDays.toFixed(1)} 天`}
              subtitle="逾期融资平均天数"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-[#FF8C00]" />}
              title="最长逾期"
              value={`${overdueData.maxOverdueDays} 天`}
              subtitle="最长逾期天数"
            />
          </div>
        </motion.section>

        {/* 逾期列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#FFD700] to-[#FF8C00] rounded-full" />
            <h3 className="text-lg">逾期融资列表</h3>
          </div>

          {overdueData.overdueFinancings.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 mb-2">暂无逾期融资</p>
              <p className="text-sm text-white/40">所有融资均按时还款</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueData.overdueFinancings.map((financing, index) => {
                const overdueItems = financing.repaymentSchedule?.filter((i) => i.status === "overdue") || [];
                const overdueAmount = overdueItems.reduce((sum, i) => sum + i.principal + i.interest, 0);
                const firstOverdue = overdueItems[0];
                const dueDate = firstOverdue ? new Date(firstOverdue.dueDate) : new Date();
                const overdueDays = Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <motion.div
                    key={financing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl glass-morphism border border-red-500/30 bg-red-500/10 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          <span className="font-semibold text-white">融资 #{financing.id}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                            逾期 {overdueDays} 天
                          </span>
                        </div>
                        <div className="text-sm text-white/60 space-y-1 pl-8">
                          <div>逾期金额：¥{overdueAmount.toLocaleString()}</div>
                          <div>逾期期数：{overdueItems.length} 期</div>
                          <div>应还日期：{dueDate.toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendAlert(financing.id)}
                          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          发送提醒
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigateToSubRoute("finance", `post-loan?id=${financing.id}`)}
                        >
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

