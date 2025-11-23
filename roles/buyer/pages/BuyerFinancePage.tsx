import { motion } from "motion/react";
import { CreditCard, CalendarClock, ShieldCheck } from "lucide-react";
import { RoleFinancePage } from "../../../components/pages/RoleFinancePage";

export default function BuyerFinancePage() {
  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D6C2]/40 to-[#18FF74]/20 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#18FF74]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
              分期中心（占位）
            </h2>
            <p className="text-xs text-white/60">
              这里将用于管理你的采购分期与账单，目前先复用通用金融推荐页做占位展示。
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid gap-4 md:grid-cols-3 text-xs text-white/70"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start gap-2">
            <CalendarClock className="w-4 h-4 text-sky-400 mt-0.5" />
            <div>
              <div className="font-semibold text-white/80 mb-1">灵活期数</div>
              <p>支持 3 / 6 / 12 期等多种组合，后续将根据订单金额自动给出推荐方案。</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5" />
            <div>
              <div className="font-semibold text白/80 mb-1">风险可控</div>
              <p>与银行端风控规则打通，确保在可承受范围内安排你的采购现金流。</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70">
            <div className="font-semibold text-white/80 mb-1">当前为前端占位</div>
            <p>实际分期账单、还款计划、逾期提醒等会在后续迭代中接入后端接口。</p>
          </div>
        </motion.div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <RoleFinancePage />
        </div>
      </div>
    </div>
  );
}
