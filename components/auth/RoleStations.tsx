/**
 * 五角色空间站登录舱
 * 差异化主题 + 专属交互
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Lock,
  Mail,
  Phone,
  Key,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';

interface RoleStationProps {
  role: RoleType;
  onLogin: (data: any) => void;
  onBack: () => void;
}

const stationConfig = {
  farmer: {
    title: '晨露·生态舱',
    subtitle: 'Farmer Eco Station',
    theme: 'from-[#18FF74]/20 to-[#00D6C2]/10',
    primaryColor: '#18FF74',
    icon: '🌾',
    background: 'linear-gradient(135deg, rgba(24, 255, 116, 0.05), rgba(0, 214, 194, 0.02))',
    feature: '数字稻田生长动画'
  },
  buyer: {
    title: '都市·购汇舱',
    subtitle: 'Buyer Commerce Station',
    theme: 'from-[#00D6C2]/20 to-[#18FF74]/10',
    primaryColor: '#00D6C2',
    icon: '🛒',
    background: 'linear-gradient(135deg, rgba(0, 214, 194, 0.05), rgba(24, 255, 116, 0.02))',
    feature: '城市霓虹扫描线'
  },
  bank: {
    title: '量子·金库舱',
    subtitle: 'Bank Quantum Vault',
    theme: 'from-[#FFD700]/20 to-[#FF8C00]/10',
    primaryColor: '#FFD700',
    icon: '🏦',
    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 140, 0, 0.02))',
    feature: '金库门旋转开启'
  },
  expert: {
    title: '知识·轨道舱',
    subtitle: 'Expert Knowledge Orbit',
    theme: 'from-[#FF2566]/20 to-[#FF6B9D]/10',
    primaryColor: '#FF2566',
    icon: '👨‍🔬',
    background: 'linear-gradient(135deg, rgba(255, 37, 102, 0.05), rgba(255, 107, 157, 0.02))',
    feature: '环形书架旋转'
  },
  admin: {
    title: '核心·控制舱',
    subtitle: 'Admin Control Core',
    theme: 'from-[#9D4EDD]/20 to-[#C77DFF]/10',
    primaryColor: '#9D4EDD',
    icon: '⚙️',
    background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.05), rgba(199, 125, 255, 0.02))',
    feature: '3D拓扑实时旋转'
  }
};

export function RoleStation({ role, onLogin, onBack }: RoleStationProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    code: '',
    password: '',
    inviteCode: ''
  });

  const config = stationConfig[role];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 模拟登录
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success(`欢迎进入${config.title}！`);
    setLoading(false);
    
    onLogin({
      role,
      user: {
        name: `测试${config.title.split('·')[0]}`,
        phone: formData.phone
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
      style={{ background: config.background }}
    >
      {/* 背景特效 */}
      <StationBackground role={role} />

      {/* 返回按钮 */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="absolute top-8 left-8 px-4 py-2 rounded-lg glass-morphism border border-white/20 text-white/80 hover:text-white transition-colors"
      >
        ← 返回星球选择
      </motion.button>

      {/* 登录卡片 */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="relative w-full max-w-md"
      >
        {/* 舱门装饰 */}
        <motion.div
          className="absolute -inset-4 rounded-3xl opacity-30 blur-xl"
          style={{ background: `radial-gradient(circle, ${config.primaryColor}40, transparent)` }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative glass-morphism rounded-2xl border border-white/20 p-8"
          style={{ borderColor: `${config.primaryColor}40` }}
        >
          {/* 头部 */}
          <div className="text-center mb-8">
            <motion.div
              className="text-6xl mb-4"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {config.icon}
            </motion.div>
            <h2 className="text-2xl mb-2" style={{ color: config.primaryColor }}>
              {config.title}
            </h2>
            <p className="text-white/60 text-sm">{config.subtitle}</p>
            <div className="mt-2 text-xs text-white/40">
              ✨ {config.feature}
            </div>
          </div>

          {/* 登录/注册切换 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all ${
                mode === 'login'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              登录舱门
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all ${
                mode === 'register'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              注册新账号
            </button>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 手机号 */}
            <div>
              <label className="text-sm text-white/80 mb-2 block">手机号</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="请输入手机号"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  required
                />
              </div>
            </div>

            {mode === 'login' ? (
              <>
                {/* 密码 */}
                <div>
                  <label className="text-sm text-white/80 mb-2 block">密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="请输入密码"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 验证码 */}
                <div>
                  <label className="text-sm text-white/80 mb-2 block">验证码</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="验证码"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors whitespace-nowrap"
                    >
                      获取验证码
                    </button>
                  </div>
                </div>

                {/* 邀请码（农户专属） */}
                {role === 'farmer' && (
                  <div>
                    <label className="text-sm text-white/80 mb-2 block flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      邀请码（可选）
                    </label>
                    <input
                      type="text"
                      value={formData.inviteCode}
                      onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                      placeholder="输入后稻田将生长一茬新稻"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                )}
              </>
            )}

            {/* 提交按钮 */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-lg text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${config.primaryColor}, ${config.primaryColor}CC)`
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>正在开启舱门...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{mode === 'login' ? '进入空间站' : '创建账号'}</span>
                </>
              )}
            </motion.button>

            {/* 快捷登录（买家专属） */}
            {role === 'buyer' && mode === 'login' && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/40 text-center mb-3">快捷登录</p>
                <div className="flex gap-3">
                  {['微信', '支付宝', 'Apple'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-sm transition-colors"
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>

          {/* 安全提示（银行/管理员） */}
          {(role === 'bank' || role === 'admin') && (
            <div className="mt-6 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-start gap-2 text-xs text-white/60">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="mb-1">
                    {role === 'bank' ? '支持硬件U-Key登录' : '需要内网IP+TOTP双因子认证'}
                  </p>
                  <p className="text-white/40">
                    企业级安全保障
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// 空间站背景特效组件
function StationBackground({ role }: { role: RoleType }) {
  const config = stationConfig[role];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 粒子效果 */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: config.primaryColor,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* 扫描线（买家/管理员） */}
      {(role === 'buyer' || role === 'admin') && (
        <motion.div
          className="absolute inset-x-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${config.primaryColor}80, transparent)` }}
          animate={{
            top: ['0%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}

      {/* 环形轨道（专家） */}
      {role === 'expert' && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-2 opacity-20"
          style={{ borderColor: config.primaryColor }}
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}
    </div>
  );
}
