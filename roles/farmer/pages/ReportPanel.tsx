import { useMemo } from "react";
import { motion } from "motion/react";
import { Download, TrendingUp, BarChart3 } from "lucide-react";
import { useFarmerOrderStore } from "../../../stores/farmerOrderStore";
import { StatsCard } from "../../../components/common/StatsCard";
import { SimpleLineChart } from "../../../components/common/SimpleLineChart";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function FarmerReportPanel() {
  const { orders } = useFarmerOrderStore();

  const totalAmount = useMemo(
    () => orders.reduce((sum, o) => sum + o.totalAmount, 0),
    [orders]
  );

  const mockTrend = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        name: `${i + 1}月`,
        value: Math.max(0, Math.round(totalAmount / 6 || 0)),
      })),
    [totalAmount]
  );

  const handleExport = () => {
    try {
      toast.success("正在生成 Excel 报表...");
      // 创建CSV格式的报表（Excel可以打开CSV）
      const headers = ['订单号', '买家', '金额', '状态', '创建时间'];
      const csvRows = [headers.join(',')];
      
      orders.forEach((order) => {
        const row = [
          order.id,
          order.buyerName,
          order.totalAmount.toFixed(2),
          order.status,
          new Date(order.createdAt).toLocaleString(),
        ].map((cell) => `"${cell}"`).join(',');
        csvRows.push(row);
      });

      // 添加汇总信息
      csvRows.push('');
      csvRows.push('汇总信息');
      csvRows.push(`总订单数,${orders.length}`);
      csvRows.push(`总金额,${totalAmount.toFixed(2)}`);
      csvRows.push(`平均订单金额,${(totalAmount / orders.length || 0).toFixed(2)}`);

      const csvContent = csvRows.join('\n');
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `收入报表_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Excel 报表已导出");
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
              收入报表
            </h2>
            <p className="text-sm text-white/60">
              汇总订单收入情况，并提供趋势图和导出入口
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("profile", "overview")}
            >
              返回个人中心
            </Button>
            <Button
              onClick={handleExport}
              className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
            >
              <Download className="w-4 h-4 mr-2" />
              导出 Excel 报表
            </Button>
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
              icon={<TrendingUp className="w-6 h-6 text-[#00D6C2]" />}
              title="累计订单金额"
              value={`¥${totalAmount.toFixed(2)}`}
              subtitle="含所有已完成订单"
            />
            <StatsCard
              icon={<BarChart3 className="w-6 h-6 text-[#18FF74]" />}
              title="近6个月平均月收入"
              value={`¥${(totalAmount / 6 || 0).toFixed(0)}`}
              subtitle="依据本地订单数据估算"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-amber-400" />}
              title="预估同比增长"
              value="+12.5%"
              subtitle="示意数据，可对接报表服务"
            />
          </div>
        </motion.section>

        {/* 收入趋势图 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
  );
}
