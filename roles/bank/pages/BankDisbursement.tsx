import { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { useFinancingStore } from "../../../stores/financingStore";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { StatsCard } from "../../../components/common/StatsCard";

export default function BankDisbursement() {
  const { list, updateStatus } = useFinancingStore();
  const [selectedFinancing, setSelectedFinancing] = useState<string | null>(null);

  // 筛选已批准但未放款的申请
  const pendingDisbursements = list.filter(
    (f) => f.status === "approved" || f.status === "signed"
  );

  const handleDisburse = (id: string) => {
    updateStatus(id, "disbursed");
    toast.success("放款成功");
    setSelectedFinancing(null);
  };

  const totalPendingAmount = pendingDisbursements.reduce((sum, f) => sum + f.amount, 0);
  const todayDisbursed = list.filter(
    (f) => f.status === "disbursed" && new Date(f.updatedAt).toDateString() === new Date().toDateString()
  );
  const todayAmount = todayDisbursed.reduce((sum, f) => sum + f.amount, 0);

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
              放款中心
            </h2>
            <p className="text-sm text-white/60">
              管理已批准融资的放款操作
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("finance", "approval/list")}
          >
            返回审批列表
          </Button>
        </motion.div>

        {/* 统计卡片 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard
              icon={<Clock className="w-6 h-6 text-amber-400" />}
              title="待放款数量"
              value={pendingDisbursements.length.toString()}
              subtitle="已批准/已签约"
            />
            <StatsCard
              icon={<CreditCard className="w-6 h-6 text-[#00D6C2]" />}
              title="待放款总额"
              value={`¥${(totalPendingAmount / 10000).toFixed(1)}万`}
              subtitle="待处理金额"
            />
            <StatsCard
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              title="今日放款"
              value={`¥${(todayAmount / 10000).toFixed(1)}万`}
              subtitle={`${todayDisbursed.length} 笔`}
            />
          </div>
        </motion.section>

        {/* 放款列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">待放款列表</h3>
          </div>
          {pendingDisbursements.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无待放款申请</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDisbursements.map((financing, index) => (
                <motion.div
                  key={financing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CreditCard className="w-5 h-5 text-[#00D6C2]" />
                        <span className="text-xl font-semibold text-white">
                          ¥{financing.amount.toLocaleString()}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-400/20 text-blue-400">
                          {financing.status === "approved" ? "已批准" : "已签约"}
                        </span>
                      </div>
                      <div className="text-sm text-white/60 space-y-1">
                        <div>申请编号：{financing.id}</div>
                        <div>农户ID：{financing.farmerId}</div>
                        <div>期限：{financing.termMonths} 个月</div>
                        <div>申请时间：{new Date(financing.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        onClick={() => handleDisburse(financing.id)}
                        className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        确认放款
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigateToSubRoute("finance", `approval/detail?id=${financing.id}`)}
                      >
                        查看详情
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

