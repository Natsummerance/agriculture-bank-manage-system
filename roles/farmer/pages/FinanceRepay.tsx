import { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, Wallet, CheckCircle2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useFinancingStore } from "../../../stores/financingStore";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const repaySchema = z.object({
  amount: z.coerce.number().positive("还款金额必须大于0"),
  paymentMethod: z.string().min(1, "请选择支付方式"),
});

export default function FarmerFinanceRepay() {
  const { id, installmentId } = useParams<{ id?: string; installmentId?: string }>();
  const { list, markInstallmentPaid } = useFinancingStore();
  const form = useZodForm(repaySchema);
  const [selectedInstallment, setSelectedInstallment] = useState<string | null>(installmentId || null);

  const financing = id ? list.find((f) => f.id === id) : null;
  const installment = financing && selectedInstallment
    ? financing.repaymentSchedule.find((i) => i.id === selectedInstallment)
    : null;

  const repayAmount = installment
    ? installment.principal + installment.interest
    : 0;

  const handleRepay = form.handleSubmit((values) => {
    if (!financing || !selectedInstallment) {
      toast.error("请选择要还款的期数");
      return;
    }
    markInstallmentPaid(financing.id, selectedInstallment);
    toast.success(`已成功还款 ¥${values.amount.toFixed(2)}`);
    navigateToSubRoute("finance", "repay-plan", { id: financing.id });
  });

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              在线还款
            </h2>
            <p className="text-sm text-white/60">
              选择还款期数，完成在线支付
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("finance", "repay-plan")}
          >
            返回还款计划
          </Button>
        </motion.div>

        {/* 还款表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-8 space-y-6"
        >
          {financing && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                <h3 className="text-lg">还款信息</h3>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">融资编号</span>
                  <span className="text-white font-mono">{financing.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">融资总额</span>
                  <span className="text-white font-semibold">¥{financing.amount.toLocaleString()}</span>
                </div>
              </div>

              {installment && (
                <div className="rounded-xl border border-[#00D6C2]/30 bg-[#00D6C2]/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-[#00D6C2]" />
                    <span className="text-white font-semibold">已选择还款期数</span>
                  </div>
                  <div className="text-sm text-white/80">
                    到期日：{new Date(installment.dueDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-white/80">
                    应还本金：¥{installment.principal.toLocaleString()} · 
                    应还利息：¥{installment.interest.toLocaleString()}
                  </div>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={handleRepay} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>还款金额</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="请输入还款金额"
                            {...field}
                            value={field.value || repayAmount}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>支付方式</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                          >
                            <option value="">请选择支付方式</option>
                            <option value="bank">银行卡支付</option>
                            <option value="wallet">钱包余额支付</option>
                            <option value="alipay">支付宝</option>
                            <option value="wechat">微信支付</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-2 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      确认还款
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigateToSubRoute("finance", "early-repay")}
                    >
                      提前还款试算
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

