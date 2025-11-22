import { useState } from "react";
import { motion } from "motion/react";
import { 
  DollarSign,
  TrendingUp,
  CreditCard,
  Wallet,
  Plus,
  ArrowRight
} from "lucide-react";
import { useExpertIncomeStore } from "../../../stores/expertIncomeStore";
import { StatsCard } from "../../../components/common/StatsCard";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { toast } from "sonner";
import { SimpleLineChart } from "../../../components/common/SimpleLineChart";

export default function ExpertFinancePanel() {
  const { qaEarnings, appointmentEarnings, withdrawTotal, addWithdraw } = useExpertIncomeStore();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "withdraw">("overview");

  const totalIncome = qaEarnings + appointmentEarnings;
  const available = totalIncome - withdrawTotal;

  const mockTrend = Array.from({ length: 6 }).map((_, i) => ({
    name: `${i + 1}月`,
    value: Math.max(0, Math.round(totalIncome / 6 || 0)),
  }));

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("请输入有效的提现金额");
      return;
    }
    if (amount > available) {
      toast.error("提现金额不能超过可提现余额");
      return;
    }
    addWithdraw(amount);
    toast.success(`已申请提现 ¥${amount.toFixed(2)}`);
    setWithdrawAmount("");
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D]">
              知识收益·收入中心
            </h2>
            <p className="text-sm text-white/60">
              查看收入明细，管理提现，追踪收益趋势。
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
            { id: "overview", label: "收入概览" },
            { id: "withdraw", label: "提现管理" },
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
                    layoutId="expertFinanceTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D]"
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* 收入概览 */}
        {activeTab === "overview" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#A78BFA] to-[#FF6B9D] rounded-full" />
              <h3 className="text-lg">收入统计</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <StatsCard
                icon={<DollarSign className="w-6 h-6 text-[#00D6C2]" />}
                title="问答收益"
                value={`¥${qaEarnings.toFixed(2)}`}
                subtitle="回答问题获得的收益"
              />
              <StatsCard
                icon={<CreditCard className="w-6 h-6 text-[#18FF74]" />}
                title="预约收益"
                value={`¥${appointmentEarnings.toFixed(2)}`}
                subtitle="预约咨询获得的收益"
              />
              <StatsCard
                icon={<TrendingUp className="w-6 h-6 text-amber-400" />}
                title="累计收益"
                value={`¥${totalIncome.toFixed(2)}`}
                subtitle="总收入"
              />
              <StatsCard
                icon={<Wallet className="w-6 h-6 text-emerald-400" />}
                title="可提现余额"
                value={`¥${available.toFixed(2)}`}
                subtitle="可提现金额"
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
                    <h3 className="text-base font-semibold">近 6 个月收入趋势</h3>
                    <p className="text-xs text-white/60">
                      用于把握收入节奏
                    </p>
                  </div>
                </div>
              </div>
              <SimpleLineChart data={mockTrend} />
            </motion.div>
          </motion.section>
        )}

        {/* 提现管理 */}
        {activeTab === "withdraw" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#A78BFA] to-[#FF6B9D] rounded-full" />
              <h3 className="text-lg">提现申请</h3>
            </div>
            <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-white/60">可提现余额</div>
                <div className="text-3xl font-semibold text-[#00D6C2]">
                  ¥{available.toFixed(2)}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/80">提现金额</label>
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="请输入提现金额"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <Button
                onClick={handleWithdraw}
                className="w-full bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D] text-white hover:opacity-90"
              >
                <Wallet className="w-4 h-4 mr-2" />
                申请提现
              </Button>
            </div>

            <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#A78BFA] to-[#FF6B9D] rounded-full" />
                <h3 className="text-lg">提现记录</h3>
              </div>
              <div className="text-sm text-white/60">
                <p>提现记录功能待完善，后续将显示历史提现记录。</p>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

