import { motion } from "motion/react";
import { Shield, Users, TrendingUp, AlertTriangle, CheckCircle, XCircle, Settings, BarChart3, Database, Server } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const systemStats = [
  { label: "总用户数", value: "8,456", change: "+12%", color: "#00D6C2", icon: Users },
  { label: "今日交易", value: "¥234万", change: "+25%", color: "#18FF74", icon: TrendingUp },
  { label: "系统负载", value: "32%", change: "-8%", color: "#FFE600", icon: Server },
  { label: "待审核", value: "45", change: "+5", color: "#FF7A9C", icon: AlertTriangle },
];

const pendingApprovals = [
  { id: 1, type: "product", user: "张农户", title: "有机苹果上架申请", time: "2小时前", priority: "high" },
  { id: 2, type: "cert", user: "李专家", title: "专家认证申请", time: "5小时前", priority: "medium" },
  { id: 3, type: "loan", user: "王农场", title: "农业生产贷 ¥50万", time: "1天前", priority: "high" },
  { id: 4, type: "user", user: "赵买家", title: "企业认证申请", time: "2天前", priority: "low" },
];

const recentActivities = [
  { id: 1, type: "login", user: "管理员001", action: "登录系统", time: "10分钟前", status: "success" },
  { id: 2, type: "approve", user: "管理员002", action: "批准商品审核", time: "30分钟前", status: "success" },
  { id: 3, type: "block", user: "管理员001", action: "封禁违规用户", time: "1小时前", status: "warning" },
  { id: 4, type: "config", user: "系统", action: "更新系统配置", time: "2小时前", status: "info" },
];

const userDistribution = [
  { role: "farmer", count: 3234, percent: 38, color: "#18FF74" },
  { role: "buyer", count: 2890, percent: 34, color: "#FFE600" },
  { role: "bank", count: 156, percent: 2, color: "#00D6C2" },
  { role: "expert", count: 890, percent: 11, color: "#FF7A9C" },
  { role: "admin", count: 89, percent: 1, color: "#A5ACBA" },
];

export function AdminHome() {
  const handleGoToUserManagement = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-admin-users'));
  };

  const handleGoToApprovals = () => {
    toast.success("进入审批中心");
  };

  const handleApprove = (id: number) => {
    toast.success(`已批准审核 #${id}`);
  };

  const handleReject = (id: number) => {
    toast.error(`已拒绝审核 #${id}`);
  };

  const handleSystemSettings = () => {
    toast.success("打开系统设置");
  };

  const handleExportData = () => {
    toast.success("正在导出数据...");
  };

  const handleViewLogs = () => {
    toast.success("查看系统日志");
  };

  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 欢迎区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#A5ACBA] to-[#00D6C2]">
            控制星云·Admin Universe
          </h2>
          <p className="text-white/60">系统管理，数据监控</p>
        </motion.div>

        {/* 顶部快速操作 */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Button
              onClick={handleGoToUserManagement}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#A5ACBA] to-[#00D6C2] text-white hover:opacity-90 shadow-lg flex items-center gap-3"
              style={{ boxShadow: "0 8px 24px rgba(165, 172, 186, 0.4)" }}
            >
              <Users className="w-6 h-6" />
              用户管理
            </Button>
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <Button
              onClick={handleGoToApprovals}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#A5ACBA] text-white hover:opacity-90 shadow-lg flex items-center gap-3"
              style={{ boxShadow: "0 8px 24px rgba(0, 214, 194, 0.4)" }}
            >
              <Shield className="w-6 h-6" />
              审批中心
            </Button>
          </motion.div>
        </div>

        {/* 系统统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {systemStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-morphism rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${stat.color}20`,
                      border: `1px solid ${stat.color}40`
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <span 
                    className="text-sm px-2 py-1 rounded-full"
                    style={{
                      background: stat.change.startsWith('+') || stat.change.startsWith('-') && stat.label === '系统负载' 
                        ? '#18FF7420' 
                        : '#FF256620',
                      color: stat.change.startsWith('+') || stat.change.startsWith('-') && stat.label === '系统负载'
                        ? '#18FF74' 
                        : '#FF2566'
                    }}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-mono mb-1 text-white">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* 快速操作面板 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSystemSettings}
            className="glass-morphism rounded-2xl p-6 text-left border border-white/10 hover:border-[#00D6C2]/30 transition-all"
          >
            <Settings className="w-10 h-10 mb-4 text-[#00D6C2]" />
            <h3 className="text-white mb-2">系统设置</h3>
            <p className="text-white/60 text-sm">配置系统参数</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportData}
            className="glass-morphism rounded-2xl p-6 text-left border border-white/10 hover:border-[#18FF74]/30 transition-all"
          >
            <Database className="w-10 h-10 mb-4 text-[#18FF74]" />
            <h3 className="text-white mb-2">数据导出</h3>
            <p className="text-white/60 text-sm">导出业务数据</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewLogs}
            className="glass-morphism rounded-2xl p-6 text-left border border-white/10 hover:border-[#FFE600]/30 transition-all"
          >
            <BarChart3 className="w-10 h-10 mb-4 text-[#FFE600]" />
            <h3 className="text-white mb-2">系统日志</h3>
            <p className="text-white/60 text-sm">查看操作记录</p>
          </motion.button>
        </div>

        {/* 用户分布 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-white mb-6">用户角色分布</h3>
          <div className="space-y-4">
            {userDistribution.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 capitalize">{item.role}</span>
                  <span className="text-white">{item.count} 人 ({item.percent}%)</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                      boxShadow: `0 0 10px ${item.color}40`
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 待审核项目 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white">待审核项目</h3>
            <span className="text-sm text-white/60">{pendingApprovals.length} 个待处理</span>
          </div>
          
          <div className="space-y-4">
            {pendingApprovals.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#00D6C2]/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white">{item.title}</h4>
                      {item.priority === 'high' && (
                        <span className="px-2 py-1 rounded-full text-xs bg-[#FF2566]/20 text-[#FF2566] border border-[#FF2566]/40">
                          紧急
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span>{item.user}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                      <span>•</span>
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApprove(item.id)}
                    className="flex-1 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white hover:opacity-90"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    批准
                  </Button>
                  <Button
                    onClick={() => handleReject(item.id)}
                    variant="outline"
                    className="flex-1 border-white/20 text-white/80 hover:bg-white/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    拒绝
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 最近活动 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-white mb-6">系统活动记录</h3>
          
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: 
                      activity.status === 'success' ? '#18FF74' :
                      activity.status === 'warning' ? '#FFE600' :
                      activity.status === 'error' ? '#FF2566' :
                      '#00D6C2'
                  }}
                />
                <div className="flex-1">
                  <div className="text-white mb-1">{activity.action}</div>
                  <div className="text-sm text-white/60">{activity.user}</div>
                </div>
                <span className="text-sm text-white/60">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
