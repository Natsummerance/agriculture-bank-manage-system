import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { useFinancingStore } from "../../../stores/financingStore";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { toast } from "sonner";

export default function FarmerFinanceRepayPlan() {
  const { id } = useParams<{ id: string }>();
  const { list } = useFinancingStore();
  const financing = list.find((f) => f.id === id);

  if (!financing) {
    return (
      <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/60">未找到对应的融资记录</p>
        </div>
      </div>
    );
  }

  const repaymentSchedule = financing.repaymentSchedule || [];

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
              还款计划表
            </h2>
            <p className="text-sm text-white/60">
              融资编号：{financing.id} · 总额：¥{financing.amount.toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("finance", "detail")}
            >
              返回详情
            </Button>
            <Button
              onClick={() => navigateToSubRoute("finance", "repay")}
              className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
            >
              立即还款
            </Button>
          </div>
        </motion.div>

        {/* 还款计划列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">还款计划</h3>
          </div>

          {repaymentSchedule.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 mb-2">暂无还款计划</p>
              <p className="text-sm text-white/40">
                待银行放款并生成还款计划后，将在此处展示每期应还金额与状态
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {repaymentSchedule.map((installment, index) => (
                <motion.div
                  key={installment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center">
                      <span className="text-lg font-semibold text-black">{index + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-white/60" />
                        <span className="text-white font-semibold">
                          第 {index + 1} 期
                        </span>
                      </div>
                      <div className="text-sm text-white/60">
                        到期日：{new Date(installment.dueDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-white/60 mt-1">
                        应还本金：¥{installment.principal.toLocaleString()} · 
                        应还利息：¥{installment.interest.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-semibold text-[#00D6C2] mb-1">
                        ¥{(installment.principal + installment.interest).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {installment.status === "paid" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400">已还清</span>
                          </>
                        ) : installment.status === "overdue" ? (
                          <>
                            <Clock className="w-4 h-4 text-red-400" />
                            <span className="text-red-400">已逾期</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-400">待还款</span>
                          </>
                        )}
                      </div>
                    </div>
                    {installment.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          navigateToSubRoute("finance", "repay", { installmentId: installment.id });
                        }}
                        className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                      >
                        立即还款
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* 统计信息 */}
        {repaymentSchedule.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 grid grid-cols-3 gap-4"
          >
            <div>
              <div className="text-sm text-white/60 mb-1">总期数</div>
              <div className="text-2xl font-semibold text-white">
                {repaymentSchedule.length} 期
              </div>
            </div>
            <div>
              <div className="text-sm text-white/60 mb-1">已还期数</div>
              <div className="text-2xl font-semibold text-emerald-400">
                {repaymentSchedule.filter((i) => i.status === "paid").length} 期
              </div>
            </div>
            <div>
              <div className="text-sm text-white/60 mb-1">待还总额</div>
              <div className="text-2xl font-semibold text-[#00D6C2]">
                ¥{repaymentSchedule
                  .filter((i) => i.status === "pending" || i.status === "overdue")
                  .reduce((sum, i) => sum + i.principal + i.interest, 0)
                  .toLocaleString()}
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

