import { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  ShoppingCart,
  Receipt,
  CreditCard,
  Settings,
  Bell,
  MapPin,
  Award,
} from "lucide-react";
import { useRole } from "../../../contexts/RoleContext";
import { StatsCard } from "../../../components/common/StatsCard";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBuyerOrderStore } from "../../../stores/buyerOrderStore";
import { useCartStore } from "../../../stores/cartStore";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function BuyerProfilePanel() {
  const { userProfile, role } = useRole();
  const navigate = useNavigate();
  const { orders } = useBuyerOrderStore();
  const { items, totalAmount } = useCartStore();

  const displayName = userProfile?.name || "未命名用户";
  const displayAvatar = userProfile?.avatar || (role === "buyer" ? "🛒" : "👤");

  const paidOrders = orders.filter((o) => o.status === "paid" || o.status === "completed");
  const totalSpend = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = {
    cartItems: items.length,
    cartAmount: totalAmount,
    totalOrders: orders.length,
    totalSpend,
  };

  const quickActions = [
    { icon: ShoppingCart, label: "购物车", path: "/buyer/cart", color: "#18FF74" },
    { icon: Receipt, label: "订单中心", path: "/buyer/orders", color: "#00D6C2" },
    { icon: CreditCard, label: "优惠券", path: "/buyer/coupon", color: "#FFD700" },
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center text-4xl">
              {displayAvatar}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-2">{displayName}</h2>
              <p className="text-sm text-white/60 mb-4">买家 · 认证用户</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-white/80">VIP会员</span>
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
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">数据概览</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<ShoppingCart className="w-6 h-6 text-[#18FF74]" />}
              title="购物车"
              value={stats.cartItems.toString()}
              subtitle={`¥${stats.cartAmount.toFixed(2)}`}
            />
            <StatsCard
              icon={<Receipt className="w-6 h-6 text-[#00D6C2]" />}
              title="累计订单"
              value={stats.totalOrders.toString()}
              subtitle="全部订单数"
            />
            <StatsCard
              icon={<CreditCard className="w-6 h-6 text-amber-400" />}
              title="累计消费"
              value={`¥${(stats.totalSpend / 10000).toFixed(1)}万`}
              subtitle="订单总金额"
            />
            <StatsCard
              icon={<Award className="w-6 h-6 text-emerald-400" />}
              title="会员等级"
              value="VIP"
              subtitle="享受专属权益"
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

        {/* 账户设置 */}
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
              { icon: Bell, label: "通知设置", onClick: () => navigateToSubRoute("profile", "notifications") },
              { icon: MapPin, label: "收货地址", onClick: () => navigateToSubRoute("profile", "address") },
              { icon: Award, label: "邀请好友", onClick: () => navigateToSubRoute("profile", "invite") },
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

