import { useMemo } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Receipt, CreditCard, TrendingUp } from "lucide-react";
import { StatsCard } from "../../../components/common/StatsCard";
import { SimpleLineChart } from "../../../components/common/SimpleLineChart";
import { Button } from "../../../components/ui/button";
import { WebGLSphere } from "../../../components/WebGLSphere";
import { useBuyerOrderStore } from "../../../stores/buyerOrderStore";
import { useCartStore } from "../../../stores/cartStore";
import { navigateToTab } from "../../../utils/navigationEvents";

export default function BuyerHome() {
  const { orders } = useBuyerOrderStore();
  const { items, totalAmount } = useCartStore();

  const paidOrders = orders.filter((o) => o.status === "paid" || o.status === "completed");

  const totalSpend = useMemo(
    () => paidOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    [paidOrders],
  );

  const mockTrend = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        name: `${i + 1}月`,
        value: Math.max(0, Math.round(totalSpend / 6 || 0)),
      })),
    [totalSpend],
  );

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* WebGL星球 */}
        <WebGLSphere 
          title="购市星云·采购驾驶舱"
          subtitle="汇总最近订单支出、购物车待结算金额与分期消费趋势，帮助你更好规划采购预算"
          gradientFrom="#00D6C2"
          gradientTo="#18FF74"
        />

        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            icon={<ShoppingCart className="w-6 h-6 text-[#18FF74]" />}
            title="购物车待结算"
            value={`¥${totalAmount.toFixed(2)}`}
            subtitle={`${items.length} 个商品待结算`}
          />
          <StatsCard
            icon={<Receipt className="w-6 h-6 text-sky-400" />}
            title="累计采购金额"
            value={`¥${totalSpend.toFixed(2)}`}
            subtitle={`${paidOrders.length} 笔已支付订单`}
          />
          <StatsCard
            icon={<CreditCard className="w-6 h-6 text-violet-400" />}
            title="本月预计支出"
            value={`¥${(totalSpend / 6 || 0).toFixed(0)}`}
            subtitle="示意数据，可接入分期账单"
          />
          <StatsCard
            icon={<TrendingUp className="w-6 h-6 text-amber-300" />}
            title="供应商稳定度"
            value="A级"
            subtitle="根据订单履约情况模拟评估"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00D6C2] to-[#18FF74]" />
                <div>
                  <h3 className="text-base font-semibold">近 6 个月采购支出趋势</h3>
                  <p className="text-xs text-white/60">
                    用于把握总体采购节奏，后续可接入真实报表服务。
                  </p>
                </div>
              </div>
            </div>
            <SimpleLineChart data={mockTrend} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00D6C2] to-[#18FF74]" />
              <div>
                <h3 className="text-base font-semibold">常用入口</h3>
                <p className="text-xs text-white/60">
                  从这里快速进入买好货 / 购物车 / 订单中心 / 分期中心。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToTab("trade")}
              >
                去买好货
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToTab("cart")}
              >
                查看购物车
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToTab("cart")}
              >
                订单中心
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToTab("finance")}
              >
                分期中心
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

