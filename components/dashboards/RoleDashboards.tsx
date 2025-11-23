/**
 * 五角色专属主控台
 * 登录后的角色首页
 */

import { motion } from "motion/react";
import { useState } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  BookOpen,
  Settings,
  Bell,
  Sparkles,
  Zap,
  DollarSign,
  Activity,
  Award
} from "lucide-react";

type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';

interface DashboardProps {
  role: RoleType;
  userData: any;
}

export function RoleDashboard({ role, userData }: DashboardProps) {
  switch (role) {
    case 'farmer':
      return <FarmerDashboard userData={userData} />;
    case 'buyer':
      return <BuyerDashboard userData={userData} />;
    case 'bank':
      return <BankDashboard userData={userData} />;
    case 'expert':
      return <ExpertDashboard userData={userData} />;
    case 'admin':
      return <AdminDashboard userData={userData} />;
    default:
      return null;
  }
}

// 农户主控台 - My Farm
function FarmerDashboard({ userData }: { userData: any }) {
  const [time] = useState(new Date().getHours());
  const isDaytime = time >= 6 && time < 18;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0D] via-[#121726] to-[#0A0A0D] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 欢迎横幅 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{
            background: isDaytime
              ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(24, 255, 116, 0.05))'
              : 'linear-gradient(135deg, rgba(10, 75, 122, 0.3), rgba(0, 214, 194, 0.1))'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-2 text-white">
                {isDaytime ? '☀️' : '🌙'} {isDaytime ? '早安' : '晚上好'}，{userData.name}
              </h2>
              <p className="text-white/60">欢迎回到您的数字农场</p>
            </div>
            <motion.div
              className="text-6xl"
              animate={{
                rotate: isDaytime ? [0, 10, -10, 0] : 0,
                scale: isDaytime ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌾
            </motion.div>
          </div>

          {/* 天气动画 */}
          {isDaytime && (
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 rounded-full bg-yellow-400/20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* 快捷操作FAB */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: DollarSign, label: '测额贷款', color: '#FFD700', action: '立即测额' },
            { icon: ShoppingCart, label: '发布货源', color: '#18FF74', action: '卖货' },
            { icon: BookOpen, label: '问专家', color: '#00D6C2', action: '咨询' }
          ].map((fab, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="glass-morphism rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${fab.color}20` }}
                >
                  <fab.icon className="w-6 h-6" style={{ color: fab.color }} />
                </div>
                <span className="text-xs text-white/60">{fab.action} →</span>
              </div>
              <h4 className="text-white">{fab.label}</h4>
            </motion.button>
          ))}
        </div>

        {/* 数据卡 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism rounded-2xl p-6 border border-white/10"
          >
            <div className="text-sm text-white/60 mb-2">可贷额度</div>
            <div className="flex items-end gap-2 mb-4">
              <div className="text-3xl text-[#FFD700]">¥35万</div>
              <div className="text-sm text-[#18FF74] mb-1">+5万 ↑</div>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-[#FFD700] to-[#18FF74]"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-morphism rounded-2xl p-6 border border-white/10"
          >
            <div className="text-sm text-white/60 mb-2">本月收入</div>
            <div className="text-3xl text-[#18FF74] mb-4">¥12.5万</div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <TrendingUp className="w-4 h-4 text-[#18FF74]" />
              <span>环比上月 +18%</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-morphism rounded-2xl p-6 border border-white/10"
          >
            <div className="text-sm text-white/60 mb-2">天气预警</div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-4xl">☀️</div>
              <div>
                <div className="text-xl text-white">晴 25°C</div>
                <div className="text-sm text-white/60">适宜作业</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// 买家主控台 - My Mall
function BuyerDashboard({ userData }: { userData: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0D] via-[#121726] to-[#0A0A0D] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-3xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
              我的商城 🛒
            </h2>
            <p className="text-white/60">发现新鲜好物</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative p-3 rounded-full bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20"
            >
              <Bell className="w-6 h-6 text-[#00D6C2]" />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF2566] flex items-center justify-center text-xs">
                3
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 心愿卫星 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-morphism rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-[#FFD700]" />
            <h3 className="text-white">心愿清单</h3>
            <span className="text-xs px-2 py-1 rounded bg-[#FFD700]/20 text-[#FFD700]">2件降价</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="aspect-square rounded-lg bg-white/5 border border-white/10 p-3 cursor-pointer"
              >
                <div className="w-full h-3/4 bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 rounded mb-2" />
                <div className="text-xs text-white/60 truncate">商品 {i}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 购物车飞船 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-16 h-16 rounded-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] flex items-center justify-center shadow-2xl"
            style={{ boxShadow: '0 0 30px rgba(0, 214, 194, 0.5)' }}
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#FF2566] flex items-center justify-center text-white text-sm font-mono"
            >
              5
            </motion.div>
            {/* 冒光效果 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ background: 'radial-gradient(circle, rgba(24, 255, 116, 0.6), transparent)' }}
            />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

// 银行主控台 - NeoBank Cockpit
function BankDashboard({ userData }: { userData: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0D] via-[#121726] to-[#0A0A0D] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF8C00]">
            🏦 NeoBank Cockpit
          </h2>
          <p className="text-white/60">智能金融驾驶舱</p>
        </motion.div>

        {/* KPI塔 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: '放款余额', value: '50.8亿', change: '+12%', color: '#FFD700', icon: DollarSign },
            { label: '不良率', value: '0.8%', change: '-0.2%', color: '#18FF74', icon: Activity },
            { label: '今日收益', value: '126万', change: '+8%', color: '#00D6C2', icon: TrendingUp }
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-morphism rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${kpi.color}20` }}
                >
                  <kpi.icon className="w-6 h-6" style={{ color: kpi.color }} />
                </div>
                <span className="text-sm" style={{ color: kpi.color }}>{kpi.change}</span>
              </div>
              <div className="text-sm text-white/60 mb-1">{kpi.label}</div>
              <div className="text-3xl" style={{ color: kpi.color }}>{kpi.value}</div>
            </motion.div>
          ))}
        </div>

        {/* 联合贷编队 */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          className="w-full glass-morphism rounded-2xl p-6 border border-[#FFD700]/30 hover:border-[#FFD700]/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FF8C00]/20">
                <Users className="w-6 h-6 text-[#FFD700]" />
              </div>
              <div className="text-left">
                <h4 className="text-white mb-1">联合贷编队</h4>
                <p className="text-sm text-white/60">3个项目进行中 · 快速开团</p>
              </div>
            </div>
            <div className="text-[#FFD700]">→</div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}

// 专家主控台 - Knowledge Galaxy
function ExpertDashboard({ userData }: { userData: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0D] via-[#121726] to-[#0A0A0D] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FF2566] to-[#FF6B9D]">
            👨‍🔬 Knowledge Galaxy
          </h2>
          <p className="text-white/60">知识星云 · 共享智慧</p>
        </motion.div>

        {/* 待答问题星云 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-morphism rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white">待答问题</h4>
              <span className="px-3 py-1 rounded-full bg-[#FF2566]/20 text-[#FF2566] text-sm">12个</span>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer"
                >
                  <div className="text-sm text-white/80 mb-1">水稻病虫害防治咨询</div>
                  <div className="text-xs text-white/40">2小时前 · 悬赏 ¥50</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 收益火箭 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-morphism rounded-2xl p-6 border border-white/10 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white">本月收益</h4>
              <Award className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div className="text-4xl text-[#18FF74] mb-2">¥8,520</div>
            <div className="text-sm text-white/60 mb-4">目标 ¥10,000</div>
            
            {/* 进度火箭 */}
            <div className="relative h-40">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl"
                >
                  🚀
                </motion.div>
                {/* 尾焰 */}
                <motion.div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-8 h-16"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 140, 0, 0.8), transparent)'
                  }}
                  animate={{
                    scaleY: [1, 1.3, 1],
                    opacity: [0.8, 0.4, 0.8]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              </div>
              {/* 轨道线 */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// 管理员主控台 - Control Core
function AdminDashboard({ userData }: { userData: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0D] via-[#121726] to-[#0A0A0D] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] to-[#C77DFF]">
            ⚙️ Control Core
          </h2>
          <p className="text-white/60">核心控制台 · 上帝模式</p>
        </motion.div>

        {/* 系统状态 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: '在线用户', value: '12,456', color: '#9D4EDD' },
            { label: 'CPU使用率', value: '23%', color: '#18FF74' },
            { label: '内存占用', value: '8.2GB', color: '#00D6C2' },
            { label: '今日交易', value: '¥2.8亿', color: '#FFD700' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-morphism rounded-xl p-4 border border-white/10"
            >
              <div className="text-xs text-white/60 mb-1">{stat.label}</div>
              <div className="text-2xl" style={{ color: stat.color }}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* 上帝模式控制 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-morphism rounded-2xl p-6 border border-[#9D4EDD]/30"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-white">快速操作</h4>
            <Zap className="w-5 h-5 text-[#9D4EDD]" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['全站推送', '紧急熔断', '数据导出'].map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="py-3 px-4 rounded-lg bg-gradient-to-r from-[#9D4EDD]/20 to-[#C77DFF]/20 border border-[#9D4EDD]/30 text-white text-sm hover:border-[#9D4EDD]/50 transition-all"
              >
                {action}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
