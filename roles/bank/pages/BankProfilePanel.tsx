import { motion } from "motion/react";
import {
  User,
  Building2,
  Settings,
  Shield,
  Bell,
  BarChart3,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useRole } from "../../../contexts/RoleContext";
import { StatsCard } from "../../../components/common/StatsCard";
import { Button } from "../../../components/ui/button";
import { useBankProductStore } from "../../../stores/bankProductStore";
import { useBankApprovalStore } from "../../../stores/bankApprovalStore";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function BankProfilePanel() {
  const { userProfile } = useRole();
  const { products } = useBankProductStore();
  const { approvals } = useBankApprovalStore();

  const displayName = userProfile?.name || "银行用户";
  const displayAvatar = userProfile?.avatar || "🏦";

  const stats = {
    totalProducts: products.length,
    pendingApprovals: approvals.filter((a) => a.status === "pending").length,
    approvedCount: approvals.filter((a) => a.status === "approved").length,
    totalAmount: 12345678,
  };

  const quickActions = [
    { icon: DollarSign, label: "审批中心", path: "/bank/approval", color: "#00D6C2" },
    { icon: BarChart3, label: "风控仪表盘", path: "/bank/risk-dashboard", color: "#18FF74" },
    { icon: TrendingUp, label: "产品管理", path: "/bank/products", color: "#FFD700" },
    { icon: Settings, label: "账户设置", onClick: () => navigateToSubRoute("profile", "settings"), color: "#A5ACBA" },
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] flex items-center justify-center text-4xl">
              {displayAvatar}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-2">{displayName}</h2>
              <p className="text-sm text-white/60 mb-4">银行 · 认证机构</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-white/80">金融机构</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/80">已认证</span>
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
              <div className="w-1 h-6 bg-gradient-to-b from-[#FFD700] to-[#FF8C00] rounded-full" />
            <h3 className="text-lg">数据概览</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<DollarSign className="w-6 h-6 text-[#00D6C2]" />}
              title="贷款产品"
              value={stats.totalProducts.toString()}
              subtitle="在售产品数"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-[#18FF74]" />}
              title="待审批"
              value={stats.pendingApprovals.toString()}
              subtitle="待处理申请"
            />
            <StatsCard
              icon={<BarChart3 className="w-6 h-6 text-amber-400" />}
              title="已通过"
              value={stats.approvedCount.toString()}
              subtitle="已批准申请"
            />
            <StatsCard
              icon={<DollarSign className="w-6 h-6 text-emerald-400" />}
              title="累计放款"
              value={`¥${(stats.totalAmount / 10000).toFixed(1)}万`}
              subtitle="总放款金额"
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
              <div className="w-1 h-6 bg-gradient-to-b from-[#FFD700] to-[#FF8C00] rounded-full" />
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
                      window.location.href = action.path;
                    } else if (action.onClick) {
                      action.onClick();
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
              <div className="w-1 h-6 bg-gradient-to-b from-[#FFD700] to-[#FF8C00] rounded-full" />
            <h3 className="text-lg">账户设置</h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: Bell, label: "通知设置", onClick: () => navigateToSubRoute("profile", "notifications") },
              { icon: Shield, label: "安全设置", onClick: () => navigateToSubRoute("profile", "settings") },
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

