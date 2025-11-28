import { motion } from "motion/react";
import { useEffect, useMemo } from "react";
import {
  Sprout,
  ShoppingBasket,
  CreditCard,
  FileText,
  ArrowRight,
} from "lucide-react";
import { navigateToTab } from "../../../utils/navigationEvents";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { StatsCard } from "../../../components/common/StatsCard";
import { WebGLSphere } from "../../../components/WebGLSphere";
import { useFarmerProductStore } from "../../../stores/farmerProductStore";
import { useFarmerOrderStore } from "../../../stores/farmerOrderStore";
import { useFinancingStore } from "../../../stores/financingStore";

export default function FarmerHome() {
  const products = useFarmerProductStore((state) => state.products);
  const fetchProducts = useFarmerProductStore((state) => state.fetchProducts);
  const initialized = useFarmerProductStore((state) => state.initialized);
  const { orders } = useFarmerOrderStore();
  const { list: financingList } = useFinancingStore();

  useEffect(() => {
    if (!initialized) {
      fetchProducts().catch((error) => {
        console.error("加载商品数据失败", error);
      });
    }
  }, [initialized, fetchProducts]);

  const stats = useMemo(() => {
    const onShelf = products.filter((p) => p.status === "on");
    const totalStock = onShelf.reduce((sum, p) => sum + p.stock, 0);
    // 计算今日销售额（已完成订单）
    const today = new Date().toDateString();
    const todayCompletedOrders = orders.filter(
      (o) => o.status === "completed" && new Date(o.createdAt).toDateString() === today
    );
    const todaySales = todayCompletedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const toShip = orders.filter((o) => o.status === "to-ship");
    const shipped = orders.filter((o) => o.status === "shipped");

    const activeFinancing = financingList.filter((f) =>
      ["applied", "reviewing", "approved", "signed", "disbursed", "repaying"].includes(
        f.status,
      ),
    );
    const totalFinancingAmount = activeFinancing.reduce(
      (sum, f) => sum + f.amount,
      0,
    );

    return {
      todaySales,
      toShipCount: toShip.length,
      shippedCount: shipped.length,
      onShelfCount: onShelf.length,
      totalStock,
      totalFinancingAmount,
      activeFinancingCount: activeFinancing.length,
    };
  }, [products, orders, financingList]);

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* WebGL星球 */}
        <WebGLSphere 
          title="田心星云·数字农场"
          subtitle="一眼看清商品、订单与融资情况，像看天气一样轻松管理农场经营"
          gradientFrom="#18FF74"
          gradientTo="#00D6C2"
        />

        {/* 概览数据 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">今日概览</h3>
            <span className="text-xs text-white/40">
              · 销售 / 订单 / 融资一屏掌握
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard
              title="今日销售额"
              value={`¥${stats.todaySales.toFixed(2)}`}
              subtitle="含所有已完成订单"
              icon={<ShoppingBasket />}
              color="#18FF74"
            />
            <StatsCard
              title="待发货订单"
              value={`${stats.toShipCount} 单`}
              subtitle={`在途订单：${stats.shippedCount} 单`}
              icon={<FileText />}
              color="#FFE600"
            />
            <StatsCard
              title="在途融资总额"
              value={
                stats.totalFinancingAmount
                  ? `¥${stats.totalFinancingAmount.toFixed(0)}`
                  : "¥0"
              }
              subtitle={`进行中项目：${stats.activeFinancingCount} 笔`}
              icon={<CreditCard />}
              color="#00D6C2"
            />
          </div>
        </motion.section>

        {/* 商品 & 资产 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">商品与资产</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <motion.div
              className="glass-morphism rounded-2xl p-6 border border-white/10 cursor-pointer"
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => navigateToTab("trade")}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sprout className="w-6 h-6 text-[#18FF74]" />
                  <span className="text-sm text-white/80">在售商品</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#18FF74]/20 text-[#18FF74]">
                  商品中心
                </span>
              </div>
              <div className="text-3xl font-mono text-[#18FF74] mb-1">
                {stats.onShelfCount}
              </div>
              <div className="text-xs text-white/50">
                总库存约 {stats.totalStock} 件
              </div>
            </motion.div>

            <motion.div
              className="glass-morphism rounded-2xl p-6 border border-white/10 cursor-pointer"
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => navigateToTab("cart")}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBasket className="w-6 h-6 text-[#00D6C2]" />
                  <span className="text-sm text-white/80">订单中心</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#00D6C2]/20 text-[#00D6C2]">
                  查看订单
                </span>
              </div>
              <div className="text-sm text-white/60">
                待发货 <span className="text-[#18FF74]">{stats.toShipCount}</span>{" "}
                单，在途{" "}
                <span className="text-[#00D6C2]">{stats.shippedCount}</span> 单
              </div>
            </motion.div>

            <motion.div
              className="glass-morphism rounded-2xl p-6 border border-white/10 cursor-pointer"
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => {
                navigateToTab("profile");
                setTimeout(() => navigateToSubRoute("profile", "report"), 200);
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#FFB800]" />
                  <span className="text-sm text-white/80">收入报表</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[#FFB800]/20 text-[#FFB800]">
                  报表中心
                </span>
              </div>
              <div className="text-sm text-white/60">
                查看月度收入趋势与品类贡献分布
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* 快捷入口 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">快捷入口</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                navigateToTab("finance");
                setTimeout(() => navigateToSubRoute("finance", "apply"), 200);
              }}
              className="w-full glass-morphism rounded-2xl p-6 border border-[#00D6C2]/40 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-black" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-white/90">申请融资</div>
                  <div className="text-xs text-white/50">
                    智能匹配农户融资方案
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#00D6C2]" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                navigateToTab("finance");
                setTimeout(() => navigateToSubRoute("finance", "match"), 200);
              }}
              className="w-full glass-morphism rounded-2xl p-6 border border-[#18FF74]/40 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#18FF74] to-[#00D6C2] flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-black" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-white/90">智能拼单融资</div>
                  <div className="text-xs text-white/50">
                    小额融资联合其他农户
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#18FF74]" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                navigateToTab("trade");
                setTimeout(() => navigateToSubRoute("trade", "refunds"), 200);
              }}
              className="w-full glass-morphism rounded-2xl p-6 border border-[#FF2566]/40 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF2566] to-[#FF6B9D] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-black" />
                </div>
                <div className="text-left">
                  <div className="text-sm text-white/90">退款审核</div>
                  <div className="text-xs text-white/50">
                    处理买家退款申请
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#FF6B9D]" />
            </motion.button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
