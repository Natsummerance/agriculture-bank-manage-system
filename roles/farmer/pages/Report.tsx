import { useMemo } from "react";
import { motion } from "motion/react";
import { Download, LineChart as LineIcon } from "lucide-react";
import { useFarmerOrderStore } from "../../../stores/farmerOrderStore";
import { StatsCard, SimpleLineChart } from "../../../components/common";
import { Button } from "../../../components/ui/button";

export default function FarmerReport() {
  const { orders } = useFarmerOrderStore();

  const totalAmount = useMemo(
    () => orders.reduce((sum, o) => sum + o.totalAmount, 0),
    [orders],
  );

  const mockTrend = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        name: `${i + 1}月`,
        value: Math.max(0, Math.round(totalAmount / 6 || 0)),
      })),
    [totalAmount],
  );

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              农户收入报表
            </h2>
            <p className="text-xs text-white/60">
              汇总订单收入情况，并提供趋势图和导出入口（当前为前端模拟数据）。
            </p>
          </div>
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-1" />
            导出 Excel 报表
          </Button>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="累计订单金额"
            value={`¥${totalAmount.toFixed(2)}`}
            subtitle="含所有已完成订单（本地统计）"
          />
          <StatsCard
            title="近6个月平均月收入"
            value={`¥${(totalAmount / 6 || 0).toFixed(0)}`}
            subtitle="依据本地订单数据估算"
            color="#0EA5E9"
          />
          <StatsCard
            title="预估同比增长"
            value="+12.5%"
            subtitle="示意数据，可对接报表服务"
            color="#F97316"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <LineIcon className="w-4 h-4 text-[#18FF74]" />
            收入趋势（最近6个月）
          </div>
          <SimpleLineChart data={mockTrend} />
        </div>
      </div>
    </div>
  );
}

