import { useState } from "react";
import { motion } from "motion/react";
import { FileText, Download, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { useFinancingStore } from "../../../stores/financingStore";
import { Button } from "../../../components/ui/button";
import { DateRangePicker } from "../../../components/common/DateRangePicker";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { StatsCard } from "../../../components/common/StatsCard";

export default function BankReconciliation() {
  const { list } = useFinancingStore();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // 筛选已放款的融资
  const disbursedFinancings = list.filter((f) => f.status === "disbursed" || f.status === "repaying");

  const handleExport = () => {
    toast.success("正在生成对账报表...");
    // TODO: 调用Excel导出服务
    // 生成T+1对账文件，包含：融资编号、放款日期、放款金额、已还本金、已还利息、待还本金、待还利息等
  };

  const handleExportT1 = () => {
    toast.success("正在生成T+1对账文件...");
    // TODO: 生成T+1格式的对账文件，用于银行内部系统对接
  };

  const totalDisbursed = disbursedFinancings.reduce((sum, f) => sum + f.amount, 0);
  const totalRepaid = disbursedFinancings
    .filter((f) => f.repaymentSchedule)
    .reduce((sum, f) => {
      const paid = f.repaymentSchedule?.filter((i) => i.status === "paid").reduce((s, i) => s + i.principal + i.interest, 0) || 0;
      return sum + paid;
    }, 0);

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
              对账中心
            </h2>
            <p className="text-sm text-white/60">
              查看放款和还款对账信息
            </p>
          </div>
          <div className="flex gap-2">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              导出对账单
            </Button>
            <Button variant="outline" onClick={handleExportT1} className="bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]">
              <Download className="w-4 h-4 mr-2" />
              导出T+1文件
            </Button>
          </div>
        </motion.div>

        {/* 统计卡片 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard
              icon={<FileText className="w-6 h-6 text-[#00D6C2]" />}
              title="累计放款"
              value={`¥${(totalDisbursed / 10000).toFixed(1)}万`}
              subtitle={`${disbursedFinancings.length} 笔融资`}
            />
            <StatsCard
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              title="累计回收"
              value={`¥${(totalRepaid / 10000).toFixed(1)}万`}
              subtitle="已还款总额"
            />
            <StatsCard
              icon={<AlertCircle className="w-6 h-6 text-amber-400" />}
              title="待回收"
              value={`¥${((totalDisbursed - totalRepaid) / 10000).toFixed(1)}万`}
              subtitle="未还款余额"
            />
          </div>
        </motion.section>

        {/* 对账列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#FFD700] to-[#FF8C00] rounded-full" />
            <h3 className="text-lg">对账明细</h3>
          </div>
          {disbursedFinancings.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无对账数据</p>
            </div>
          ) : (
            <div className="space-y-3">
              {disbursedFinancings.map((financing, index) => {
                const repaid = financing.repaymentSchedule?.filter((i) => i.status === "paid").reduce((s, i) => s + i.principal + i.interest, 0) || 0;
                const remaining = financing.amount - repaid;
                return (
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
                          <FileText className="w-5 h-5 text-[#FFD700]" />
                          <span className="font-semibold text-white">融资 #{financing.id}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            financing.status === "disbursed" ? "bg-blue-400/20 text-blue-400" : "bg-amber-400/20 text-amber-400"
                          }`}>
                            {financing.status === "disbursed" ? "已放款" : "还款中"}
                          </span>
                        </div>
                        <div className="text-sm text-white/60 space-y-1">
                          <div>放款金额：¥{financing.amount.toLocaleString()}</div>
                          <div>已回收：¥{repaid.toLocaleString()}</div>
                          <div>待回收：¥{remaining.toLocaleString()}</div>
                          <div>放款时间：{new Date(financing.updatedAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => navigateToSubRoute("finance", `reconciliation/detail?id=${financing.id}`)}
                      >
                        查看详情
                      </Button>
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

