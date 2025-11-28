import { useMemo } from "react";
import { motion } from "motion/react";
import { Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle, CreditCard, Download } from "lucide-react";
import { useExpertIncomeStore } from "../../../stores/expertIncomeStore";
import { StatsCard } from "../../../components/common/StatsCard";
import { SimpleLineChart } from "../../../components/common/SimpleLineChart";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const withdrawSchema = z.object({
  amount: z.coerce.number().positive("提现金额必须大于0"),
  bankCard: z.string().min(4, "请输入银行卡号"),
});

export default function ExpertIncomePanel() {
  const { qaEarnings, appointmentEarnings, withdrawTotal, withdraw } = useExpertIncomeStore();
  const form = useZodForm(withdrawSchema);

  // 确保所有值都有默认值，避免 undefined 错误
  const safeQaEarnings = qaEarnings ?? 0;
  const safeAppointmentEarnings = appointmentEarnings ?? 0;
  const safeTotalWithdrawn = withdrawTotal ?? 0;
  const safeWithdrawableBalance = (safeQaEarnings + safeAppointmentEarnings - safeTotalWithdrawn);

  const totalEarnings = safeQaEarnings + safeAppointmentEarnings;
  const mockTrend = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        name: `${i + 1}月`,
        value: Math.round((totalEarnings / 6) * (0.8 + Math.random() * 0.4)),
      })),
    [totalEarnings]
  );

  const handleWithdraw = form.handleSubmit((values) => {
    if (values.amount > safeWithdrawableBalance) {
      toast.error("提现金额不能超过可提现余额");
      return;
    }
    withdraw(values.amount);
    toast.success(`已申请提现 ¥${values.amount.toFixed(2)}`);
    form.reset();
  });

  const handleExport = () => {
    try {
      toast.success("正在生成收入报表...");
      // 创建CSV格式的报表
      const headers = ['收入类型', '金额', '时间'];
      const csvRows = [headers.join(',')];
      
      // 添加问答收入
      if (safeQaEarnings > 0) {
        csvRows.push(`"问答收入","${safeQaEarnings.toFixed(2)}","累计"`);
      }
      
      // 添加预约收入
      if (safeAppointmentEarnings > 0) {
        csvRows.push(`"预约收入","${safeAppointmentEarnings.toFixed(2)}","累计"`);
      }
      
      // 添加汇总信息
      csvRows.push('');
      csvRows.push('汇总信息');
      csvRows.push(`总收入,${totalEarnings.toFixed(2)}`);
      csvRows.push(`累计提现,${safeTotalWithdrawn.toFixed(2)}`);
      csvRows.push(`可提现余额,${Math.max(0, safeWithdrawableBalance).toFixed(2)}`);

      const csvContent = csvRows.join('\n');
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `收入报表_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("收入报表已导出");
    } catch (error: any) {
      toast.error("导出失败，请稍后重试");
    }
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
              收入中心
            </h2>
            <p className="text-sm text-white/60">
              查看问答和预约收入，管理提现
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              导出报表
            </Button>
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("profile", "bank-card")}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              银行卡管理
            </Button>
          </div>
        </motion.div>

        {/* 统计卡片 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-[#00D6C2]" />}
              title="问答收入"
              value={`¥${safeQaEarnings.toLocaleString()}`}
              subtitle="来自问答奖励"
            />
            <StatsCard
              icon={<CreditCard className="w-6 h-6 text-[#18FF74]" />}
              title="预约收入"
              value={`¥${safeAppointmentEarnings.toLocaleString()}`}
              subtitle="来自预约咨询"
            />
            <StatsCard
              icon={<ArrowDownCircle className="w-6 h-6 text-amber-400" />}
              title="累计提现"
              value={`¥${safeTotalWithdrawn.toLocaleString()}`}
              subtitle="历史总提现金额"
            />
            <StatsCard
              icon={<Wallet className="w-6 h-6 text-emerald-400" />}
              title="可提现余额"
              value={`¥${Math.max(0, safeWithdrawableBalance).toLocaleString()}`}
              subtitle="随时可提取"
            />
          </div>
        </motion.section>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 提现表单 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">发起提现</h3>
            </div>
            <Form {...form}>
              <form onSubmit={handleWithdraw} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>提现金额</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="请输入提现金额" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>银行卡号</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入银行卡号" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  申请提现
                </Button>
              </form>
            </Form>
          </motion.section>

          {/* 收入趋势 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00D6C2] to-[#18FF74]" />
              <div>
                <h3 className="text-base font-semibold">收入趋势（最近6个月）</h3>
                <p className="text-xs text-white/60">用于把握收入节奏</p>
              </div>
            </div>
            <SimpleLineChart data={mockTrend} />
          </motion.section>
        </div>
      </div>
    </div>
  );
}

