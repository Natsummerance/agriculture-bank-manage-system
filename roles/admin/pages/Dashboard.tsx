import { useMemo } from "react";
import { motion } from "motion/react";
import { Users, Package, FileText, AlertTriangle, TrendingUp, CreditCard, Eye, UserCheck, DollarSign, Target } from "lucide-react";
import { StatsCard } from "../../../components/common/StatsCard";
import { SimpleLineChart } from "../../../components/common/SimpleLineChart";
import { Button } from "../../../components/ui/button";
import { WebGLSphere } from "../../../components/WebGLSphere";
import { useAdminAuditStore } from "../../../stores/adminAuditStore";
import { useBuyerOrderStore } from "../../../stores/buyerOrderStore";
import { useFinancingStore } from "../../../stores/financingStore";
import { navigateToTab } from "../../../utils/navigationEvents";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function AdminDashboardPage() {
  const { productAudits, contentAudits } = useAdminAuditStore();
  const { orders } = useBuyerOrderStore();
  const { list: financingList } = useFinancingStore();

  const stats = useMemo(() => {
    const pendingProducts = productAudits.filter((p) => p.status === "pending").length;
    const pendingContent = contentAudits.filter((c) => c.status === "pending").length;
    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
    ).length;
    const totalOrders = orders.length;
    const activeFinancing = financingList.filter((f) =>
      ["applied", "reviewing", "approved", "signed", "disbursed", "repaying"].includes(f.status)
    ).length;
    const totalFinancingAmount = financingList.reduce((sum, f) => sum + f.amount, 0);
    const todayRevenue = orders
      .filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString())
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    // Mock PV/UV数据
    const todayPV = Math.floor(Math.random() * 10000) + 5000;
    const todayUV = Math.floor(Math.random() * 2000) + 1000;
    const totalPV = todayPV * 30;
    const totalUV = todayUV * 15;

    return {
      pendingProducts,
      pendingContent,
      todayOrders,
      totalOrders,
      activeFinancing,
      totalFinancingAmount,
      todayRevenue,
      totalRevenue,
      todayPV,
      todayUV,
      totalPV,
      totalUV,
    };
  }, [productAudits, contentAudits, orders, financingList]);

  const mockTrend = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        name: `${i + 1}月`,
        value: Math.round((stats.totalOrders / 6) * (0.8 + Math.random() * 0.4)),
      })),
    [stats.totalOrders]
  );

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* WebGL星球 */}
        <WebGLSphere 
          title="控制星云·运营中台"
          subtitle="平台运营数据监控与管理入口"
          gradientFrom="#9D4EDD"
          gradientTo="#FF6B9D"
        />

        {/* 核心指标 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<Eye className="w-6 h-6 text-[#00D6C2]" />}
              title="今日PV"
              value={stats.todayPV.toLocaleString()}
              subtitle={`累计PV：${stats.totalPV.toLocaleString()}`}
            />
            <StatsCard
              icon={<UserCheck className="w-6 h-6 text-[#18FF74]" />}
              title="今日UV"
              value={stats.todayUV.toLocaleString()}
              subtitle={`累计UV：${stats.totalUV.toLocaleString()}`}
            />
            <StatsCard
              icon={<DollarSign className="w-6 h-6 text-amber-400" />}
              title="今日交易额"
              value={`¥${(stats.todayRevenue / 1000).toFixed(1)}k`}
              subtitle={`累计：¥${(stats.totalRevenue / 10000).toFixed(1)}万`}
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
              title="今日订单"
              value={stats.todayOrders.toString()}
              subtitle={`累计订单：${stats.totalOrders} 笔`}
            />
          </div>
        </motion.section>

        {/* 审核与融资指标 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<Package className="w-6 h-6 text-[#00D6C2]" />}
              title="待审核商品"
              value={stats.pendingProducts.toString()}
              subtitle="商品审核队列"
            />
            <StatsCard
              icon={<FileText className="w-6 h-6 text-[#18FF74]" />}
              title="待审核内容"
              value={stats.pendingContent.toString()}
              subtitle="内容审核队列"
            />
            <StatsCard
              icon={<CreditCard className="w-6 h-6 text-amber-400" />}
              title="在途融资"
              value={stats.activeFinancing.toString()}
              subtitle={`总额：¥${(stats.totalFinancingAmount / 10000).toFixed(1)}万`}
            />
            <StatsCard
              icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
              title="待处理事项"
              value={(stats.pendingProducts + stats.pendingContent).toString()}
              subtitle="需要审核的内容"
            />
          </div>
        </motion.section>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 订单趋势 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00D6C2] to-[#18FF74]" />
              <div>
                <h3 className="text-base font-semibold">订单趋势（最近6个月）</h3>
                <p className="text-xs text-white/60">平台订单量变化</p>
              </div>
            </div>
            <SimpleLineChart data={mockTrend} />
          </motion.section>

          {/* 快捷入口 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00D6C2] to-[#18FF74]" />
              <div>
                <h3 className="text-base font-semibold">管理入口</h3>
                <p className="text-xs text-white/60">快速进入各管理模块</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToTab("trade")}
              >
                <Package className="w-4 h-4 mr-2" />
                商品审核
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToSubRoute("expert", "content")}
              >
                <FileText className="w-4 h-4 mr-2" />
                内容审核
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToSubRoute("expert", "expert")}
              >
                <Users className="w-4 h-4 mr-2" />
                专家审核
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToTab("cart")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                订单监控
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToTab("finance")}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                融资监控
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToSubRoute("profile", "permission")}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                权限管理
              </Button>
              <Button
                variant="outline"
                className="justify-start border-white/20 bg-white/5 hover:bg-white/10"
                onClick={() => navigateToSubRoute("home", "gray")}
              >
                <Target className="w-4 h-4 mr-2" />
                灰度发布
              </Button>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
