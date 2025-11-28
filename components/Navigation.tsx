import { motion } from "motion/react";
import { Home, DollarSign, Users, ShoppingCart, User, Bell, Package, MessageCircle, LayoutDashboard, FileCheck, TrendingUp, Wallet, MessageSquare, BookOpen } from "lucide-react";
import { useState } from "react";
import { MessageCenter } from "./MessageCenter";
import SharePopover from "./common/SharePopover";
import { useCartStore } from "../stores/cartStore";
import { useMsgStore } from "../stores/msgStore";
import { useRole } from "../contexts/RoleContext";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const baseNavItems = [
  { id: "home", label: "星云之门", icon: Home },
  { id: "finance", label: "智融资本", icon: DollarSign },
  { id: "expert", label: "知识星系", icon: Users },
  { id: "trade", label: "农商市场", icon: ShoppingCart },
  { id: "profile", label: "我的宇宙", icon: User },
];

const roleNavLabels: Record<string, typeof baseNavItems> = {
  farmer: [
    { id: "home", label: "田心星云", icon: Home },
    { id: "finance", label: "田心金融", icon: DollarSign },
    { id: "expert", label: "田心学堂", icon: MessageCircle },
    { id: "trade", label: "田心市场", icon: Package },
    { id: "profile", label: "田心宇宙", icon: User },
  ],
  buyer: [
    { id: "home", label: "购市星云", icon: Home },
    { id: "trade", label: "购市市场", icon: ShoppingCart },
    { id: "finance", label: "购市分期", icon: DollarSign },
    { id: "expert", label: "购市学堂", icon: MessageCircle },
    { id: "profile", label: "购市宇宙", icon: User },
  ],
  bank: [
    { id: "home", label: "资本星云", icon: LayoutDashboard },
    { id: "finance", label: "资本审批", icon: FileCheck },
    { id: "expert", label: "资本智库", icon: Users },
    { id: "trade", label: "资本数据", icon: TrendingUp },
    { id: "profile", label: "资本宇宙", icon: User },
  ],
  expert: [
    { id: "home", label: "知识星系", icon: LayoutDashboard },
    { id: "expert", label: "知识问答", icon: MessageSquare },
    { id: "trade", label: "知识市场", icon: BookOpen },
    { id: "finance", label: "知识收益", icon: Wallet },
    { id: "profile", label: "知识宇宙", icon: User },
  ],
  admin: [
    { id: "home", label: "控制星云", icon: LayoutDashboard },
    { id: "trade", label: "控制数据", icon: Package },
    { id: "expert", label: "控制智库", icon: Users },
    { id: "finance", label: "控制资本", icon: DollarSign },
    { id: "profile", label: "控制宇宙", icon: User },
  ],
};

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [messageCenterOpen, setMessageCenterOpen] = useState(false);
  const cartCount = useCartStore((state) => state.count);
  const unreadCount = useMsgStore((state) => state.unread);
  const { role } = useRole();

  const navItems =
    role && roleNavLabels[role] ? roleNavLabels[role] : baseNavItems;

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-40 glass-morphism border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center quantum-glow">
                <div className="w-6 h-6 border-2 border-white rounded-full" />
              </div>
              <div>
                <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
                  AgriVerse
                </h4>
                <p className="text-xs text-white/40">星云·融销一体</p>
              </div>
            </motion.div>

            {/* Navigation Items */}
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className="relative px-4 py-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-[#00D6C2]/20 to-[#18FF74]/20 rounded-lg"
                        style={{ boxShadow: "0 0 20px rgba(0, 214, 194, 0.3)" }}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <div className="relative flex items-center gap-2">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-[#00D6C2]" : "text-white/60"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          isActive ? "text-white" : "text-white/60"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* User Actions - 按钮顺序：分享 → 购物车 → 通知 → 用户 */}
            <div className="flex items-center gap-3">
              {/* 分享按钮 */}
              <SharePopover />

              {/* 购物车 */}
              <motion.button
                onClick={() => onTabChange("cart")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#00D6C2]/10 to-[#18FF74]/10 flex items-center justify-center border border-[#00D6C2]/30"
              >
                <ShoppingCart className="w-5 h-5 text-[#00D6C2]" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-br from-[#FF2566] to-pink-500 rounded-full text-[10px] flex items-center justify-center text-white font-medium quantum-glow"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* 消息中心 */}
              <motion.button
                onClick={() => setMessageCenterOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#00D6C2]/10 to-[#18FF74]/10 flex items-center justify-center border border-[#00D6C2]/30"
              >
                <Bell className="w-5 h-5 text-[#00D6C2]" />
                {unreadCount > 0 && (
                  <motion.span
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-br from-[#FF2566] to-pink-500 rounded-full text-[10px] flex items-center justify-center text-white font-medium quantum-glow"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* 用户 */}
              <motion.button
                onClick={() => onTabChange("profile")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D6C2]/10 to-[#18FF74]/10 flex items-center justify-center border border-[#00D6C2]/30"
              >
                <User className="w-5 h-5 text-[#00D6C2]" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Message Center Panel */}
      <MessageCenter
        isOpen={messageCenterOpen}
        onClose={() => setMessageCenterOpen(false)}
      />
    </>
  );
}
