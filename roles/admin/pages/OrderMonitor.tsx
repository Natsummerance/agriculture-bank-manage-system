import { useMemo } from "react";
import { motion } from "motion/react";
import { TrendingUp, Package, Calendar, Filter } from "lucide-react";
import { useBuyerOrderStore } from "../../../stores/buyerOrderStore";
import { FilterPanel, DateRangePicker } from "../../../components/common";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { StatsCard } from "../../../components/common/StatsCard";

export default function AdminOrderMonitor() {
  const { orders } = useBuyerOrderStore();
  const [status, setStatus] = useState<string>("all");
  const [range, setRange] = useState<DateRange | undefined>();

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = status === "all" || o.status === status;
      const created = new Date(o.createdAt);
      let matchDate = true;
      if (range?.from && range.to) {
        matchDate = created >= range.from && created <= range.to;
      }
      return matchStatus && matchDate;
    });
  }, [orders, status, range]);

  const stats = useMemo(() => {
    const totalAmount = filtered.reduce((sum, o) => sum + o.totalAmount, 0);
    const todayOrders = filtered.filter(
      (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
    ).length;
    return { totalAmount, todayOrders, totalCount: filtered.length };
  }, [filtered]);

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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D]">
              订单监控
            </h2>
            <p className="text-sm text-white/60">
              实时监控平台所有订单状态和交易数据
            </p>
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
              icon={<Package className="w-6 h-6 text-[#9D4EDD]" />}
              title="订单总数"
              value={stats.totalCount.toString()}
              subtitle="当前筛选结果"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-[#FF6B9D]" />}
              title="订单总额"
              value={`¥${(stats.totalAmount / 10000).toFixed(1)}万`}
              subtitle="累计交易金额"
            />
            <StatsCard
              icon={<Calendar className="w-6 h-6 text-amber-400" />}
              title="今日订单"
              value={stats.todayOrders.toString()}
              subtitle="今日新增订单数"
            />
          </div>
        </motion.section>

        {/* 筛选器 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <FilterPanel
            title="状态"
            value={status}
            onChange={setStatus}
            options={[
              { label: "全部", value: "all" },
              { label: "待支付", value: "pending" },
              { label: "已支付", value: "paid" },
              { label: "待发货", value: "to-ship" },
              { label: "已发货", value: "shipped" },
              { label: "已完成", value: "completed" },
              { label: "退款中", value: "refunding" },
            ]}
          />
          <DateRangePicker value={range} onChange={setRange} />
        </motion.section>

        {/* 订单列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#9D4EDD] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">订单详情</h3>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无订单数据</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((o, index) => (
                <motion.div
                  key={o.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-[#9D4EDD]" />
                        <span className="font-mono text-sm text-white/60">{o.id}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            o.status === "completed"
                              ? "bg-emerald-400/20 text-emerald-400"
                              : o.status === "refunding"
                              ? "bg-amber-400/20 text-amber-400"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>
                      <div className="text-sm text-white/60 space-y-1">
                        <div>创建时间：{new Date(o.createdAt).toLocaleString()}</div>
                        <div>商品数量：{o.items.length} 件</div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-semibold text-[#FF6B9D] mb-1">
                        ¥{o.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-xs text-white/60">订单金额</div>
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
