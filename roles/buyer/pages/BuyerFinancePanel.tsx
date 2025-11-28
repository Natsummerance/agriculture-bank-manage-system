import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  CreditCard, 
  ShoppingCart,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Plus
} from "lucide-react";
import { navigateToTab } from "../../../utils/navigationEvents";
import { useBuyerOrderStore } from "../../../stores/buyerOrderStore";
import { StatsCard } from "../../../components/common/StatsCard";
import { Button } from "../../../components/ui/button";
import { SimpleLineChart } from "../../../components/common/SimpleLineChart";

export default function BuyerFinancePanel() {
  const { orders } = useBuyerOrderStore();
  const [activeTab, setActiveTab] = useState<"overview" | "installment">("overview");

  const paidOrders = orders.filter((o) => o.status === "paid" || o.status === "completed");
  const totalSpend = useMemo(
    () => paidOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    [paidOrders]
  );

  const mockTrend = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        name: `${i + 1}月`,
        value: Math.max(0, Math.round(totalSpend / 6 || 0)),
      })),
    [totalSpend]
  );

  const stats = {
    cartAmount: 0, // TODO: 从 cartStore 获取
    totalSpend,
    monthlyEstimate: totalSpend / 6 || 0,
    installmentCount: 0, // TODO: 从分期数据获取
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
              购市分期·分期中心
            </h2>
            <p className="text-sm text-white/60">
              管理分期付款，查看账单，规划采购预算。
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
            { id: "overview", label: "概览" },
            { id: "installment", label: "分期管理" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  isActive ? "text-[#00D6C2]" : "text-white/60 hover:text-white/80"
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="buyerFinanceTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* 概览 */}
        {activeTab === "overview" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">财务概览</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <StatsCard
                icon={<ShoppingCart className="w-6 h-6 text-[#18FF74]" />}
                title="购物车待结算"
                value={`¥${stats.cartAmount.toFixed(2)}`}
                subtitle="待支付金额"
              />
              <StatsCard
                icon={<CreditCard className="w-6 h-6 text-[#00D6C2]" />}
                title="累计采购金额"
                value={`¥${stats.totalSpend.toFixed(2)}`}
                subtitle={`${paidOrders.length} 笔已支付订单`}
              />
              <StatsCard
                icon={<TrendingUp className="w-6 h-6 text-amber-400" />}
                title="本月预计支出"
                value={`¥${stats.monthlyEstimate.toFixed(0)}`}
                subtitle="基于历史数据估算"
              />
              <StatsCard
                icon={<Calendar className="w-6 h-6 text-violet-400" />}
                title="分期订单"
                value={stats.installmentCount.toString()}
                subtitle="进行中的分期"
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
                    <h3 className="text-base font-semibold">近 6 个月采购支出趋势</h3>
                    <p className="text-xs text-white/60">
                      用于把握总体采购节奏
                    </p>
                  </div>
                </div>
              </div>
              <SimpleLineChart data={mockTrend} />
            </motion.div>
          </motion.section>
        )}

        {/* 分期管理 */}
        {activeTab === "installment" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">分期订单</h3>
            </div>
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 mb-2">暂无分期订单</p>
              <p className="text-sm text-white/40 mb-4">
                购买商品时选择分期付款，将在此处显示分期计划
              </p>
              <Button
                onClick={() => navigateToTab("trade")}
                className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                去购物
              </Button>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

