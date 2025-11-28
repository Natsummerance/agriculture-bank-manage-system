import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  User,
  TrendingUp,
  Award,
  Settings,
  Shield,
  Bell,
  CreditCard,
  FileText,
  Wallet,
  BarChart3,
  MapPin,
  Download,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import { useRole } from "../../../contexts/RoleContext";
import { StatsCard } from "../../../components/common/StatsCard";
import { SimpleLineChart } from "../../../components/common/SimpleLineChart";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToTab } from "../../../utils/navigationEvents";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { useFarmerOrderStore } from "../../../stores/farmerOrderStore";
import { useFinancingStore } from "../../../stores/financingStore";

const withdrawSchema = z.object({
  amount: z.coerce.number().positive("提现金额必须大于0"),
  bankCard: z.string().min(4, "请输入银行卡号"),
});

export default function FarmerProfilePanel() {
  const { userProfile, role } = useRole();
  const { orders } = useFarmerOrderStore();
  const { list: financingList } = useFinancingStore();

  const displayName = userProfile?.name || "未命名用户";
  const displayAvatar =
    userProfile?.avatar ||
    (role === "farmer" ? "👨‍🌾" : "👤");

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    financingCount: financingList.length,
    creditScore: 98,
  };

  const [activeSubTab, setActiveSubTab] = useState<"overview" | "wallet" | "report" | "notifications" | "settings">("overview");
  const [balance, setBalance] = useState(58200);
  const [frozen] = useState(8000);
  const withdrawForm = useZodForm(withdrawSchema);

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

  const mockIncomeTrend = [
    { name: "1月", value: 12000 },
    { name: "2月", value: 15000 },
    { name: "3月", value: 18000 },
    { name: "4月", value: 22000 },
    { name: "5月", value: 19000 },
    { name: "6月", value: 25000 },
  ];

  const quickActions = [
    { icon: Wallet, label: "钱包中心", onClick: () => navigateToSubRoute("profile", "wallet"), color: "#00D6C2" },
    { icon: BarChart3, label: "收入报表", onClick: () => navigateToSubRoute("profile", "report"), color: "#18FF74" },
    { icon: FileText, label: "融资管理", onClick: () => navigateToTab("finance"), color: "#FFD700" },
    { icon: Settings, label: "账户设置", onClick: () => navigateToSubRoute("profile", "settings"), color: "#A5ACBA" },
  ];

  const handleWithdraw = withdrawForm.handleSubmit((values) => {
    if (values.amount > balance) {
      toast.error("提现金额不能超过可用余额");
      return;
    }
    setBalance((prev) => prev - values.amount);
    toast.success(`已申请提现 ¥${values.amount.toFixed(2)}`);
    withdrawForm.reset();
  });

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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center text-4xl">
              {displayAvatar}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-2">{displayName}</h2>
              <p className="text-sm text-white/60 mb-4">农户 · 认证用户</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-white/80">VIP会员</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/80">已实名认证</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("profile", "edit")}
            >
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
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">数据概览</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-[#00D6C2]" />}
              title="累计订单"
              value={stats.totalOrders.toString()}
              subtitle="全部订单数"
            />
            <StatsCard
              icon={<CreditCard className="w-6 h-6 text-[#18FF74]" />}
              title="累计收入"
              value={`¥${(stats.totalRevenue / 10000).toFixed(1)}万`}
              subtitle="订单总收入"
            />
            <StatsCard
              icon={<FileText className="w-6 h-6 text-amber-400" />}
              title="融资记录"
              value={stats.financingCount.toString()}
              subtitle="融资申请数"
            />
            <StatsCard
              icon={<Award className="w-6 h-6 text-emerald-400" />}
              title="信用评分"
              value={stats.creditScore.toString()}
              subtitle="综合信用等级"
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
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
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

        {/* Tab 切换 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 border-b border-white/10"
        >
          {[
            { id: "overview", label: "概览", route: "overview" },
            { id: "wallet", label: "钱包", route: "wallet" },
            { id: "report", label: "报表", route: "report" },
            { id: "notifications", label: "通知", route: "notifications" },
            { id: "settings", label: "设置", route: "settings" },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  // 如果点击的是已移动到独立页面的tab，直接导航
                  if (["wallet", "report", "notifications", "settings"].includes(tab.route)) {
                    navigateToSubRoute("profile", tab.route);
                  } else {
                    setActiveSubTab(tab.id as any);
                  }
                }}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  isActive ? "text-[#00D6C2]" : "text-white/60 hover:text-white/80"
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="profileSubTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* 钱包、报表、通知、设置页面已移动到独立页面，通过navigateToSubRoute自动跳转 */}

        {/* 钱包页面 - 旧版本保留 */}
        {false && activeSubTab === "wallet" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">钱包中心</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <StatsCard
                icon={<Wallet className="w-6 h-6 text-[#18FF74]" />}
                title="可用余额"
                value={`¥${balance.toLocaleString()}`}
                subtitle="随时可提取"
              />
              <StatsCard
                icon={<ArrowDownCircle className="w-6 h-6 text-amber-400" />}
                title="冻结金额"
                value={`¥${frozen.toLocaleString()}`}
                subtitle="处理中或未到账"
              />
              <StatsCard
                icon={<ArrowUpCircle className="w-6 h-6 text-emerald-400" />}
                title="累计提现"
                value="¥12,500"
                subtitle="历史总提现金额"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4">
                <h4 className="text-sm text-white/70 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#00D6C2]" />
                  绑定的收款账户
                </h4>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">中国农业银行</div>
                      <div className="text-xs text-white/60">尾号 6234 · 储蓄卡</div>
                    </div>
                    <span className="text-xs text-emerald-400">默认</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4">
                <h4 className="text-sm text-white/70">发起提现</h4>
                <Form {...withdrawForm}>
                  <form onSubmit={handleWithdraw} className="space-y-4">
                    <FormField
                      control={withdrawForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>提现金额</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="请输入提现金额" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={withdrawForm.control}
                      name="bankCard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>银行卡号</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入银行卡号" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      申请提现
                    </Button>
                  </form>
                </Form>
              </div>
            </div>

            <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00D6C2] to-[#18FF74]" />
                <h3 className="text-base font-semibold">收入趋势</h3>
              </div>
              <SimpleLineChart data={mockIncomeTrend} />
            </div>
          </motion.section>
        )}

        {/* 报表页面 */}
        {activeSubTab === "report" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                <h3 className="text-lg">收入报表</h3>
              </div>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-1" />
                导出 Excel 报表
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <StatsCard
                title="累计订单金额"
                value={`¥${totalAmount.toFixed(2)}`}
                subtitle="含所有已完成订单"
              />
              <StatsCard
                title="近6个月平均月收入"
                value={`¥${(totalAmount / 6 || 0).toFixed(0)}`}
                subtitle="依据本地订单数据估算"
              />
              <StatsCard
                title="预估同比增长"
                value="+12.5%"
                subtitle="示意数据"
              />
            </div>
            <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00D6C2] to-[#18FF74]" />
                <h3 className="text-base font-semibold">收入趋势（最近6个月）</h3>
              </div>
              <SimpleLineChart data={mockTrend} />
            </div>
          </motion.section>
        )}

        {/* 概览页面 */}
        {activeSubTab === "overview" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">账户设置</h3>
            </div>
            <div className="space-y-3">
              {[
              { icon: Bell, label: "通知中心", onClick: () => navigateToSubRoute("profile", "notifications") },
              { icon: Shield, label: "隐私设置", onClick: () => navigateToSubRoute("profile", "settings") },
              { icon: MapPin, label: "发货地址", onClick: () => navigateToSubRoute("profile", "shipping-address") },
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
        )}
      </div>
    </div>
  );
}

