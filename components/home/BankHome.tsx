import { motion } from "motion/react";
import { CheckCircle, Plus, BarChart2, FileText, Clock, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const loanApplications = [
  { id: 1, farmer: "张三", amount: "¥500,000", type: "农业生产贷", status: "pending", time: "2小时前", credit: 98 },
  { id: 2, farmer: "李四", amount: "¥300,000", type: "设备采购贷", status: "pending", time: "5小时前", credit: 92 },
  { id: 3, farmer: "王五", amount: "¥800,000", type: "土地流转贷", status: "review", time: "1天前", credit: 95 },
];

const stats = [
  { label: "待审批", value: "15", change: "+3", color: "#00D6C2", icon: Clock },
  { label: "已批准", value: "234", change: "+12", color: "#18FF74", icon: CheckCircle },
  { label: "贷款总额", value: "¥5,678万", change: "+18%", color: "#FFE600", icon: DollarSign },
  { label: "逾期率", value: "0.8%", change: "-0.2%", color: "#FF7A9C", icon: AlertTriangle },
];

export function BankHome() {
  const handleApproveLoans = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-loan-approve'));
  };

  const handlePublishProduct = () => {
    toast.success("发布金融产品功能开发中...");
  };

  const handleApprove = (id: number) => {
    toast.success(`已批准贷款申请 #${id}`);
  };

  const handleDownloadDocs = () => {
    toast.success("资料包下载中...");
  };

  const handleGoToData = () => {
    const event = new CustomEvent('navigate-tab', { detail: { tab: 'trade' } });
    window.dispatchEvent(event);
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
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
            资本星云·Bank Universe
          </h2>
          <p className="text-white/60">金融赋能，助农兴农</p>
        </motion.div>

        {/* 顶部双FAB按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Button
              onClick={handleApproveLoans}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90 shadow-lg flex items-center gap-3"
              style={{ boxShadow: "0 8px 24px rgba(0, 214, 194, 0.4)" }}
            >
              <CheckCircle className="w-6 h-6" />
              审批贷款
            </Button>
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <Button
              onClick={handlePublishProduct}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:opacity-90 shadow-lg flex items-center gap-3"
              style={{ boxShadow: "0 8px 24px rgba(24, 255, 116, 0.4)" }}
            >
              <Plus className="w-6 h-6" />
              发布产品
            </Button>
          </motion.div>
        </div>

        {/* 数据统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-morphism rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${stat.color}20`,
                      border: `1px solid ${stat.color}40`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <span
                    className="text-sm px-2 py-1 rounded-full"
                    style={{
                      background: stat.change.startsWith('+') || stat.change.startsWith('-') && stat.label === "逾期率" ? '#18FF7420' : '#FF256620',
                      color: stat.change.startsWith('+') || stat.change.startsWith('-') && stat.label === "逾期率" ? '#18FF74' : '#FF2566',
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

        {/* 贷款申请队列 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-morphism rounded-2xl p-8 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white mb-2">贷款申请队列</h3>
              <p className="text-sm text-white/60">AI风控评估，智能审批建议</p>
            </div>
            <Button
              onClick={handleDownloadDocs}
              variant="outline"
              className="border-[#00D6C2]/40 text-[#00D6C2] hover:bg-[#00D6C2]/10"
            >
              <FileText className="w-4 h-4 mr-2" />
              下载资料包
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-sm text-white/60">申请人</th>
                  <th className="px-4 py-3 text-left text-sm text-white/60">贷款类型</th>
                  <th className="px-4 py-3 text-left text-sm text-white/60">金额</th>
                  <th className="px-4 py-3 text-left text-sm text-white/60">信用分</th>
                  <th className="px-4 py-3 text-left text-sm text-white/60">状态</th>
                  <th className="px-4 py-3 text-left text-sm text-white/60">时间</th>
                  <th className="px-4 py-3 text-right text-sm text-white/60">操作</th>
                </tr>
              </thead>
              <tbody>
                {loanApplications.map((app, i) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-4 text-white">{app.farmer}</td>
                    <td className="px-4 py-4 text-white/80">{app.type}</td>
                    <td className="px-4 py-4">
                      <span className="text-[#FFE600]">{app.amount}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span 
                        className="font-mono"
                        style={{
                          color: app.credit >= 95 ? '#18FF74' : app.credit >= 90 ? '#00D6C2' : '#FFE600'
                        }}
                      >
                        {app.credit}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        app.status === 'pending' ? 'bg-[#FFE600]/20 text-[#FFE600]' :
                        app.status === 'review' ? 'bg-[#00D6C2]/20 text-[#00D6C2]' :
                        'bg-[#18FF74]/20 text-[#18FF74]'
                      }`}>
                        {app.status === 'pending' ? '待审批' : app.status === 'review' ? '审核中' : '已批准'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/60 text-sm">{app.time}</td>
                    <td className="px-4 py-4 text-right">
                      <Button
                        onClick={() => handleApprove(app.id)}
                        size="sm"
                        className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        审批
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* 底部主按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleGoToData}
            className="h-16 px-12 rounded-2xl text-lg bg-gradient-to-r from-[#00D6C2] via-[#18FF74] to-[#00D6C2] text-black hover:opacity-90 shadow-xl"
            style={{ boxShadow: "0 12px 32px rgba(0, 214, 194, 0.5)" }}
          >
            <BarChart2 className="w-6 h-6 mr-3" />
            前往资本数据
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
