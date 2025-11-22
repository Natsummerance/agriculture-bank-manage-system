import { motion } from "motion/react";
import { useState } from "react";
import { 
  Users, TrendingUp, Shield, Settings, Search, Filter,
  UserCheck, UserX, Edit, Trash2, Plus, BarChart3, 
  FileText, Package, Briefcase, GraduationCap, Building2,
  AlertTriangle, CheckCircle, XCircle, Clock
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

const users = [
  { id: 1, name: "张农户", role: "farmer", email: "zhang@farm.com", status: "active", joinDate: "2024-01-15", transactions: 156, credit: 98 },
  { id: 2, name: "李买家", role: "buyer", email: "li@buyer.com", status: "active", joinDate: "2024-02-20", transactions: 234, credit: 95 },
  { id: 3, name: "王银行", role: "bank", email: "wang@bank.com", status: "active", joinDate: "2024-01-10", transactions: 89, credit: 100 },
  { id: 4, name: "赵专家", role: "expert", email: "zhao@expert.com", status: "active", joinDate: "2024-03-05", transactions: 445, credit: 97 },
  { id: 5, name: "钱农户", role: "farmer", email: "qian@farm.com", status: "inactive", joinDate: "2024-02-15", transactions: 12, credit: 85 },
  { id: 6, name: "孙买家", role: "buyer", email: "sun@buyer.com", status: "pending", joinDate: "2024-11-07", transactions: 0, credit: 0 },
];

const pendingApprovals = [
  { id: 1, type: "product", title: "有机苹果 - 待审核", user: "张农户", time: "2小时前", status: "pending" },
  { id: 2, type: "certification", title: "绿色食品认证申请", user: "李农户", time: "5小时前", status: "pending" },
  { id: 3, type: "loan", title: "农业生产贷 ¥50万", user: "王农户", time: "1天前", status: "pending" },
  { id: 4, type: "expert", title: "农业专家认证", user: "刘博士", time: "2天前", status: "pending" },
];

const systemStats = [
  { label: "总用户数", value: "8,456", change: "+12%", icon: Users, color: "#00D6C2" },
  { label: "交易总额", value: "¥1,234万", change: "+25%", icon: TrendingUp, color: "#18FF74" },
  { label: "贷款总额", value: "¥5,678万", change: "+18%", icon: Briefcase, color: "#FFB800" },
  { label: "活跃专家", value: "234", change: "+8%", icon: GraduationCap, color: "#A78BFA" },
];

const roleConfig: Record<string, { name: string; color: string; icon: any }> = {
  farmer: { name: "农户", color: "#18FF74", icon: Package },
  buyer: { name: "买家", color: "#00D6C2", icon: Users },
  bank: { name: "银行", color: "#FFB800", icon: Building2 },
  expert: { name: "专家", color: "#A78BFA", icon: GraduationCap },
  admin: { name: "管理员", color: "#FF6B9D", icon: Shield },
};

export default function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"users" | "approvals" | "analytics">("users");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleApprove = (id: number) => {
    toast.success("已批准申请");
  };

  const handleReject = (id: number) => {
    toast.error("已拒绝申请");
  };

  const handleDeleteUser = (id: number) => {
    toast.success("用户已删除");
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    toast.success(`用户状态已更新为 ${newStatus === "active" ? "激活" : "停用"}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B9D] to-[#FFB800]">
              管理中心·Admin Panel
            </h2>
            <p className="text-white/60">系统管理·数据监控·用户审核</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-lg bg-[#FF6B9D]/20 border border-[#FF6B9D]/30">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#FF6B9D]" />
                <span className="text-white">管理员权限</span>
              </div>
            </div>
          </div>
        </motion.div>

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
                className="glass-morphism rounded-2xl p-6"
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
                      background: stat.change.startsWith('+') ? '#18FF7420' : '#FF256620',
                      color: stat.change.startsWith('+') ? '#18FF74' : '#FF2566'
                    }}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-mono mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 border-b border-white/10">
          {[
            { id: "users", label: "用户管理", icon: Users },
            { id: "approvals", label: "审批中心", icon: FileText },
            { id: "analytics", label: "数据分析", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                className={`px-6 py-3 flex items-center gap-2 transition-all relative ${
                  selectedTab === tab.id
                    ? "text-[#FF6B9D]"
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {selectedTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF6B9D] to-[#FFB800]"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* 用户管理 Tab */}
        {selectedTab === "users" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 搜索和筛选 */}
            <div className="glass-morphism rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索用户名或邮箱..."
                    className="pl-12 h-12 bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedRole(null)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedRole === null
                        ? "bg-gradient-to-r from-[#FF6B9D] to-[#FFB800] text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    全部
                  </button>
                  {Object.entries(roleConfig).map(([role, config]) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                        selectedRole === role
                          ? "text-white"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                      style={{
                        background: selectedRole === role ? `${config.color}40` : undefined,
                        border: selectedRole === role ? `1px solid ${config.color}60` : undefined
                      }}
                    >
                      {config.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 用户列表 */}
            <div className="glass-morphism rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm text-white/60">用户</th>
                      <th className="px-6 py-4 text-left text-sm text-white/60">角色</th>
                      <th className="px-6 py-4 text-left text-sm text-white/60">状态</th>
                      <th className="px-6 py-4 text-left text-sm text-white/60">交易次数</th>
                      <th className="px-6 py-4 text-left text-sm text-white/60">信用分</th>
                      <th className="px-6 py-4 text-left text-sm text-white/60">加入日期</th>
                      <th className="px-6 py-4 text-right text-sm text-white/60">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, i) => {
                      const config = roleConfig[user.role];
                      const Icon = config.icon;
                      return (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-white mb-1">{user.name}</div>
                              <div className="text-sm text-white/40">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div 
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                              style={{
                                background: `${config.color}20`,
                                color: config.color,
                                border: `1px solid ${config.color}40`
                              }}
                            >
                              <Icon className="w-4 h-4" />
                              {config.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                              user.status === "active" ? "bg-[#18FF74]/20 text-[#18FF74]" :
                              user.status === "inactive" ? "bg-white/20 text-white/60" :
                              "bg-[#FFB800]/20 text-[#FFB800]"
                            }`}>
                              {user.status === "active" && <CheckCircle className="w-3 h-3" />}
                              {user.status === "inactive" && <XCircle className="w-3 h-3" />}
                              {user.status === "pending" && <Clock className="w-3 h-3" />}
                              {user.status === "active" ? "活跃" : user.status === "inactive" ? "停用" : "待审"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white">{user.transactions}</td>
                          <td className="px-6 py-4">
                            <span 
                              className="font-mono"
                              style={{
                                color: user.credit >= 95 ? '#18FF74' : user.credit >= 85 ? '#FFB800' : '#FF2566'
                              }}
                            >
                              {user.credit}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white/60 text-sm">{user.joinDate}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleToggleStatus(user.id, user.status)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#00D6C2]"
                              >
                                {user.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#FFB800]"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#FF2566]"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* 审批中心 Tab */}
        {selectedTab === "approvals" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {pendingApprovals.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-morphism rounded-2xl p-6 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      item.type === "product" ? "bg-[#18FF74]/20" :
                      item.type === "certification" ? "bg-[#00D6C2]/20" :
                      item.type === "loan" ? "bg-[#FFB800]/20" :
                      "bg-[#A78BFA]/20"
                    }`}>
                      {item.type === "product" && <Package className="w-6 h-6 text-[#18FF74]" />}
                      {item.type === "certification" && <Shield className="w-6 h-6 text-[#00D6C2]" />}
                      {item.type === "loan" && <Briefcase className="w-6 h-6 text-[#FFB800]" />}
                      {item.type === "expert" && <GraduationCap className="w-6 h-6 text-[#A78BFA]" />}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-white mb-1">{item.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <span>申请人: {item.user}</span>
                        <span>·</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleApprove(item.id)}
                      className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white hover:opacity-90"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      批准
                    </Button>
                    <Button
                      onClick={() => handleReject(item.id)}
                      variant="outline"
                      className="border-white/20 text-white/80 hover:bg-white/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      拒绝
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 数据分析 Tab */}
        {selectedTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism rounded-2xl p-8"
          >
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-[#FF6B9D]" />
              <h3 className="text-white mb-2">数据分析模块</h3>
              <p className="text-white/60">完整的数据分析和可视化功能正在开发中...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
