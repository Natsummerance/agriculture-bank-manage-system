import { useMemo } from "react";
import { motion } from "motion/react";
import { MessageSquare, Calendar, FileText, Wallet, TrendingUp, Clock } from "lucide-react";

// 通用组件导入
import { StatsCard } from "../../../components/common/StatsCard";
import { SimpleLineChart } from "../../../components/common/SimpleLineChart";
import { Button } from "../../../components/ui/button";
import { WebGLSphere } from "../../../components/WebGLSphere";

// 角色专用组件导入 (使用默认导入，不带花括号)
import LiveStreamButton from "../../../components/expert/LiveStreamButton.tsx"; 

// 状态管理导入
import { useExpertQAStore } from "../../../stores/expertQAStore";
import { useExpertIncomeStore } from "../../../stores/expertIncomeStore";
import { useExpertCalendarStore } from "../../../stores/expertCalendarStore";

// 工具导入
import { navigateToTab } from "../../../utils/navigationEvents";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function ExpertDashboardPage() {
  const { questions } = useExpertQAStore();
  const { qaEarnings, appointmentEarnings, withdrawTotal } = useExpertIncomeStore();
  const { slots } = useExpertCalendarStore();

  const stats = useMemo(() => {
    const pendingCount = questions.filter((q) => q.status === "pending").length;
    const answeredCount = questions.filter((q) => q.status !== "pending").length;
    const totalIncome = qaEarnings + appointmentEarnings;
    const available = totalIncome - withdrawTotal;
    const availableSlots = slots.filter((s) => !s.isBooked).length;
    const bookedSlots = slots.filter((s) => s.isBooked).length;

    return {
      pendingCount,
      answeredCount,
      totalIncome,
      available,
      availableSlots,
      bookedSlots,
    };
  }, [questions, qaEarnings, appointmentEarnings, withdrawTotal, slots]);

  const mockTrend = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        name: `${i + 1}月`,
        value: Math.round((stats.totalIncome / 6) * (0.8 + Math.random() * 0.4)),
      })),
    [stats.totalIncome]
  );

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* WebGL星球 标题区域 */}
        <WebGLSphere 
          title="知识星系·专家工作台"
          subtitle="管理问答、预约与知识内容，查看收入情况"
          gradientFrom="#A78BFA"
          gradientTo="#FF6B9D"
        />

        {/* 核心指标 (Stats Cards) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<MessageSquare className="w-6 h-6 text-[#00D6C2]" />}
              title="待回答问题"
              value={`${stats.pendingCount} 条`}
              subtitle="需要处理的问答"
            />
            <StatsCard
              icon={<Clock className="w-6 h-6 text-[#18FF74]" />}
              title="可预约时段"
              value={`${stats.availableSlots} 个`}
              subtitle={`已预约：${stats.bookedSlots} 个`}
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-amber-400" />}
              title="累计收益"
              value={`¥${stats.totalIncome.toFixed(2)}`}
              subtitle="问答 + 预约收入"
            />
            <StatsCard
              icon={<Wallet className="w-6 h-6 text-emerald-400" />}
              title="可提现余额"
              value={`¥${stats.available.toFixed(2)}`}
              subtitle="随时可提取"
            />
          </div>
        </motion.section>

        {/* ⚠️ 原独立的 LiveStreamButton section 已移除 */}

        <div className="grid gap-6 md:grid-cols-2">
          
          {/* 收入趋势 图表 */}
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

          {/* 快捷入口 按钮组 (已修改) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00D6C2] to-[#18FF74]" />
              <div>
                <h3 className="text-base font-semibold">工作入口</h3>
                <p className="text-xs text-white/60">快速进入各功能模块</p>
              </div>
            </div>
            
            {/* 现有 2x2 按钮网格 */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToTab("expert")}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                问答中心
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToSubRoute("expert", "calendar")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                预约管理
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToTab("trade")}
              >
                <FileText className="w-4 h-4 mr-2" />
                知识发布
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToTab("finance")}
              >
                <Wallet className="w-4 h-4 mr-2" />
                收入中心
              </Button>
            </div>
            
            {/* ⚡ 新增的直播按钮，位于 2x2 网格下方，独占一行 (w-full) ⚡ */}
            <LiveStreamButton />

          </motion.section>
        </div>
      </div>
    </div>
  );
}