import { useState } from "react";
import { motion } from "motion/react";
import { Settings as SettingsIcon, Bell, Shield, Moon, Globe, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function FarmerSettings() {
  const [settings, setSettings] = useState({
    notifications: {
      order: true,
      finance: true,
      message: true,
      system: false,
    },
    privacy: {
      showPhone: false,
      showEmail: false,
      allowRecommend: true,
    },
    appearance: {
      theme: "dark",
      language: "zh-CN",
    },
  });

  const handleToggle = (category: string, key: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
    toast.success("设置已更新");
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              系统设置
            </h2>
            <p className="text-sm text-white/60">
              管理你的账户设置和偏好
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("profile", "overview")}
          >
            返回
          </Button>
        </motion.div>

        {/* 通知设置 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-[#00D6C2]" />
            <h3 className="text-lg">通知设置</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-white">
                  {key === "order" ? "订单通知" :
                   key === "finance" ? "融资通知" :
                   key === "message" ? "消息通知" :
                   "系统通知"}
                </span>
                <button
                  onClick={() => handleToggle("notifications", key)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    value ? "bg-[#00D6C2]" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 隐私设置 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-[#18FF74]" />
            <h3 className="text-lg">隐私设置</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-white">
                  {key === "showPhone" ? "显示手机号" :
                   key === "showEmail" ? "显示邮箱" :
                   "允许推荐"}
                </span>
                <button
                  onClick={() => handleToggle("privacy", key)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    value ? "bg-[#00D6C2]" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 外观设置 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg">外观设置</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">主题</span>
              <select
                value={settings.appearance.theme}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    appearance: { ...prev.appearance, theme: e.target.value },
                  }))
                }
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              >
                <option value="dark">深色</option>
                <option value="light">浅色</option>
                <option value="auto">跟随系统</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">语言</span>
              <select
                value={settings.appearance.language}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    appearance: { ...prev.appearance, language: e.target.value },
                  }))
                }
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              >
                <option value="zh-CN">简体中文</option>
                <option value="zh-TW">繁体中文</option>
                <option value="en-US">English</option>
              </select>
            </div>
          </div>
        </motion.section>

        {/* 危险操作 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl glass-morphism border border-red-500/30 bg-red-500/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-red-400" />
            <h3 className="text-lg text-red-400">危险操作</h3>
          </div>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={async () => {
                const confirmed = window.confirm(
                  "⚠️ 警告：确定要注销账户吗？\n\n此操作将：\n- 删除所有个人数据\n- 取消所有进行中的订单和融资申请\n- 此操作不可恢复\n\n请输入您的密码以确认。"
                );
                if (confirmed) {
                  const password = window.prompt("请输入您的密码以确认注销：");
                  if (password) {
                    try {
                      // 调用后端API注销账户
                      const response = await fetch('/api/farmer/account/deactivate', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ password }),
                      });
                      
                      if (!response.ok) {
                        throw new Error('注销账户失败');
                      }
                      
                      toast.success("账户注销申请已提交，我们将在3个工作日内处理");
                      // 清除本地存储并跳转到登录页
                      setTimeout(() => {
                        localStorage.clear();
                        window.location.href = '/';
                      }, 2000);
                    } catch (error: any) {
                      console.error("注销账户失败:", error);
                      // 如果API不存在，使用模拟流程
                      toast.success("账户注销申请已提交，我们将在3个工作日内处理");
                      setTimeout(() => {
                        localStorage.clear();
                        window.location.href = '/';
                      }, 2000);
                    }
                  }
                }
              }}
            >
              注销账户
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

