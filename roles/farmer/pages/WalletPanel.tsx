import { useState } from "react";
import { motion } from "motion/react";
import { Wallet, ArrowDownCircle, ArrowUpCircle, CreditCard, TrendingUp } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { StatsCard } from "../../../components/common/StatsCard";
import { SimpleLineChart } from "../../../components/common/SimpleLineChart";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const withdrawSchema = z.object({
  amount: z.coerce.number().positive("提现金额必须大于0"),
  bankCard: z.string().min(4, "请输入银行卡号"),
});

const mockIncomeTrend = [
  { name: "1月", value: 12000 },
  { name: "2月", value: 15000 },
  { name: "3月", value: 18000 },
  { name: "4月", value: 22000 },
  { name: "5月", value: 19000 },
  { name: "6月", value: 25000 },
];

export default function FarmerWalletPanel() {
  const [balance, setBalance] = useState(58200);
  const [frozen] = useState(8000);
  const form = useZodForm(withdrawSchema);

  const handleWithdraw = form.handleSubmit((values) => {
    if (values.amount > balance) {
      toast.error("提现金额不能超过可用余额");
      return;
    }
    setBalance((prev) => prev - values.amount);
    toast.success(`已申请提现 ¥${values.amount.toFixed(2)}`);
    form.reset();
  });

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
              钱包中心
            </h2>
            <p className="text-sm text-white/60">
              实时查看账户余额、收支趋势，并一键发起提现申请
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("profile", "bank-card")}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            银行卡管理
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
              icon={<Wallet className="w-6 h-6 text-[#18FF74]" />}
              title="可用余额"
              value={`¥${balance.toLocaleString()}`}
              subtitle="随时可提取"
            />
            <StatsCard
              icon={<ArrowDownCircle className="w-6 h-6 text-amber-400" />}
              title="冻结金额"
              value={`¥${frozen.toLocaleString()}`}
              subtitle="处理中或未到账"
            />
            <StatsCard
              icon={<ArrowUpCircle className="w-6 h-6 text-emerald-400" />}
              title="累计提现"
              value="¥12,500"
              subtitle="历史总提现金额"
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

          {/* 银行卡信息 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-[#00D6C2]" />
              <h3 className="text-lg">绑定的收款账户</h3>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">中国农业银行</div>
                  <div className="text-xs text-white/60">尾号 6234 · 储蓄卡</div>
                </div>
                <span className="text-xs text-emerald-400">默认</span>
              </div>
              <p className="text-xs text-white/50">
                提现资金将优先打款至默认银行卡，预计 1-2 个工作日内到账
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigateToSubRoute("profile", "bank-card")}
            >
              管理银行卡
            </Button>
          </motion.section>
        </div>

        {/* 收入趋势 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00D6C2] to-[#18FF74]" />
            <div>
              <h3 className="text-base font-semibold">收入趋势</h3>
              <p className="text-xs text-white/60">近 6 个月收入变化</p>
            </div>
          </div>
          <SimpleLineChart data={mockIncomeTrend} />
        </motion.section>
      </div>
    </div>
  );
}
