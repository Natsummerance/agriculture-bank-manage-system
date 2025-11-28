import { motion } from "motion/react";
import { AlertTriangle, TrendingDown, Shield, CreditCard } from "lucide-react";
import { StatsCard, SimpleLineChart } from "../../../components/common";

const riskTrend = [
  { name: "1月", value: 1.2 },
  { name: "2月", value: 1.0 },
  { name: "3月", value: 0.9 },
  { name: "4月", value: 0.8 },
  { name: "5月", value: 0.85 },
  { name: "6月", value: 0.78 },
];

export default function BankRiskDashboard() {
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF8C00]">
              风控仪表盘
            </h2>
            <p className="text-sm text-white/60">
              实时监控逾期率、不良率与授信余额，把控风险
            </p>
          </div>
        </motion.div>

        {/* 风险指标 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard
              icon={<TrendingDown className="w-6 h-6 text-emerald-400" />}
              title="当前逾期率"
              value="0.78%"
              subtitle="较上月下降 0.07 个百分点"
            />
            <StatsCard
              icon={<Shield className="w-6 h-6 text-[#FFD700]" />}
              title="不良率"
              value="0.35%"
              subtitle="控制在警戒线以内"
            />
            <StatsCard
              icon={<CreditCard className="w-6 h-6 text-[#FF8C00]" />}
              title="授信余额"
              value="¥ 5,000 万"
              subtitle="联合贷占比 35%"
            />
          </div>
        </motion.section>

        {/* 趋势图 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#FFD700] to-[#FF8C00]" />
            <div>
              <h3 className="text-base font-semibold">逾期率趋势（近6个月）</h3>
              <p className="text-xs text-white/60">用于监控风险变化</p>
            </div>
          </div>
          <SimpleLineChart data={riskTrend} />
        </motion.section>
      </div>
    </div>
  );
}
