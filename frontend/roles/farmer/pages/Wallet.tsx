import { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, ArrowDownCircle, ArrowUpCircle, Wallet as WalletIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { z } from "zod";
import { useZodForm } from "../../../hooks/useZodForm";
import { toast } from "sonner";
import { StatsCard, SimpleLineChart } from "../../../components/common";

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

export default function FarmerWallet() {
  const [balance, setBalance] = useState(58200);
  const [frozen] = useState(8000);
  const [withdrawResult, setWithdrawResult] = useState<string | null>(null);
  const form = useZodForm(withdrawSchema);

  return (
    <div className="min-h-screen bg-[#0A0F1E] pt-24 pb-12 px-6 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              农户钱包中心
            </h2>
            <p className="text-xs text-white/60">
              实时查看账户余额、收支趋势，并一键发起提现申请。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 border border-white/10">
              <WalletIcon className="w-4 h-4 text-[#18FF74]" />
              <span className="text-xs text-white/70">可用余额</span>
              <span className="font-mono text-[#18FF74]">¥{balance.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="可用余额"
            value={`¥${balance.toLocaleString()}`}
            icon={<WalletIcon />}
            subtitle="随时可提取"
            color="#18FF74"
          />
          <StatsCard
            title="冻结金额"
            value={`¥${frozen.toLocaleString()}`}
            icon={<ArrowDownCircle />}
            subtitle="处理中或未到账"
            color="#F97316"
          />
          <StatsCard
            title="累计提现"
            value="¥12,500"
            icon={<ArrowUpCircle />}
            subtitle="历史总提现金额（模拟数据）"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm text-white/70 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#00D6C2]" />
              绑定的收款账户
            </h3>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">中国农业银行</div>
                  <div className="text-xs text-white/60">尾号 6234 · 储蓄卡</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400">默认</span>
                  <Button variant="outline" size="sm">
                    更换银行卡
                  </Button>
                </div>
              </div>
              <p className="text-xs text-white/50">
                提现资金将优先打款至默认银行卡，预计 1-2 个工作日内到账。
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm text-white/70 flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4 text-[#18FF74]" />
              发起提现
            </h3>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Form {...form}>
                <form
                  className="space-y-4"
                  onSubmit={form.handleSubmit((values) => {
                    if (values.amount > balance) {
                      form.setError("amount", { message: "提现金额不能大于可用余额" });
                      return;
                    }
                    setBalance((b) => b - values.amount);
                    setWithdrawResult(
                      `已成功提交提现申请：¥${values.amount.toFixed(
                        2,
                      )}，预计1-2个工作日到账（模拟）`,
                    );
                    toast.success("提现申请已提交（模拟）");
                  })}
                >
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>提现金额（元）</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="本次提现金额" {...field} />
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
                        <FormLabel>收款银行卡号</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入银行卡号" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    确认提现
                  </Button>
                </form>
              </Form>
              {withdrawResult && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                  {withdrawResult}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm text-white/70 flex items-center gap-2">
            <ArrowDownCircle className="w-4 h-4 text-[#38BDF8]" />
            收入趋势（最近6个月）
          </h3>
          <SimpleLineChart data={mockIncomeTrend} />
        </div>
      </div>
    </div>
  );
}


