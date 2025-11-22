import { motion } from "motion/react";
import {
  User,
  MessageCircle,
  Calendar,
  BookOpen,
  DollarSign,
  Settings,
  Bell,
  Shield,
  Star,
} from "lucide-react";
import { useRole } from "../../../contexts/RoleContext";
import { StatsCard } from "../../../components/common/StatsCard";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useExpertQAStore } from "../../../stores/expertQAStore";
import { useExpertIncomeStore } from "../../../stores/expertIncomeStore";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function ExpertProfilePanel() {
  const { userProfile, role } = useRole();
  const navigate = useNavigate();
  const { questions } = useExpertQAStore();
  const { qaEarnings, appointmentEarnings, withdrawTotal } = useExpertIncomeStore();

  const displayName = userProfile?.name || "未命名专家";
  const displayAvatar = userProfile?.avatar || (role === "expert" ? "👨‍🔬" : "👤");

  const stats = {
    totalQuestions: questions.length,
    answeredQuestions: questions.filter((q) => q.status !== "pending").length,
    totalIncome: qaEarnings + appointmentEarnings,
    availableBalance: qaEarnings + appointmentEarnings - withdrawTotal,
  };

  const quickActions = [
    { icon: MessageCircle, label: "问答中心", path: "/expert/qa", color: "#00D6C2" },
    { icon: Calendar, label: "预约管理", path: "/expert/calendar", color: "#18FF74" },
    { icon: BookOpen, label: "知识发布", path: "/expert/knowledge", color: "#FFD700" },
    { icon: DollarSign, label: "收入中心", path: "/expert/income", color: "#FF7A9C" },
  ];

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 用户信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#FF6B9D] flex items-center justify-center text-4xl">
              {displayAvatar}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-2">{displayName}</h2>
              <p className="text-sm text-white/60 mb-4">专家 · 认证用户</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/80">已认证专家</span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigateToSubRoute("profile", "edit")}>
              <Settings className="w-4 h-4 mr-2" />
              编辑资料
            </Button>
          </div>
        </motion.div>

        {/* 统计数据 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#A78BFA] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">数据概览</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<MessageCircle className="w-6 h-6 text-[#00D6C2]" />}
              title="回答问题"
              value={stats.answeredQuestions.toString()}
              subtitle={`共 ${stats.totalQuestions} 条问题`}
            />
            <StatsCard
              icon={<DollarSign className="w-6 h-6 text-[#18FF74]" />}
              title="累计收益"
              value={`¥${stats.totalIncome.toFixed(2)}`}
              subtitle="总收入"
            />
            <StatsCard
              icon={<DollarSign className="w-6 h-6 text-amber-400" />}
              title="可提现余额"
              value={`¥${stats.availableBalance.toFixed(2)}`}
              subtitle="可提现金额"
            />
            <StatsCard
              icon={<Calendar className="w-6 h-6 text-emerald-400" />}
              title="预约次数"
              value="0"
              subtitle="TODO: 接入预约数据"
            />
          </div>
        </motion.section>

        {/* 快捷操作 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#A78BFA] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">快捷操作</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => {
                    if (action.path) {
                      navigate(action.path);
                    }
                  }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 flex flex-col items-center gap-3"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: action.color }} />
                  </div>
                  <span className="text-sm text-white">{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* 账户设置 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#A78BFA] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">账户设置</h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: Bell, label: "通知设置", onClick: () => navigateToSubRoute("profile", "notifications") },
              { icon: Shield, label: "隐私设置", onClick: () => navigateToSubRoute("profile", "settings") },
              { icon: Star, label: "评价农户", onClick: () => navigateToSubRoute("profile", "farmer-review") },
              { icon: Settings, label: "系统设置", onClick: () => navigateToSubRoute("profile", "settings") },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-white/60" />
                    <span className="text-white">{item.label}</span>
                  </div>
                  <span className="text-white/40">→</span>
                </button>
              );
            })}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

