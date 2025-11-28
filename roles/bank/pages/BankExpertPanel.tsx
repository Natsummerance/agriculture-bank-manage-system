import { useState } from "react";
import { motion } from "motion/react";
import { 
  Users,
  Search,
  Building2,
  MapPin,
  Phone,
  Mail,
  TrendingUp
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { StatsCard } from "../../../components/common/StatsCard";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { toast } from "sonner";

const mockClients = [
  {
    id: 1,
    name: "张三",
    type: "农户",
    location: "山东省寿光市",
    phone: "138****5678",
    email: "zhangsan@example.com",
    totalLoans: 3,
    totalAmount: 500000,
    status: "active",
  },
  {
    id: 2,
    name: "李四",
    type: "农户",
    location: "河北省廊坊市",
    phone: "139****8765",
    email: "lisi@example.com",
    totalLoans: 2,
    totalAmount: 300000,
    status: "active",
  },
];

export default function BankExpertPanel() {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = {
    totalClients: mockClients.length,
    activeClients: mockClients.filter((c) => c.status === "active").length,
    totalLoans: mockClients.reduce((sum, c) => sum + c.totalLoans, 0),
    totalAmount: mockClients.reduce((sum, c) => sum + c.totalAmount, 0),
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF8C00]">
              资本智库·客户经理
            </h2>
            <p className="text-sm text-white/60">
              管理客户关系，查看客户贷款记录，提供金融服务。
            </p>
          </div>
        </motion.div>

        {/* 统计卡片 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#FFD700] to-[#FF8C00] rounded-full" />
            <h3 className="text-lg">客户概览</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<Users className="w-6 h-6 text-[#00D6C2]" />}
              title="客户总数"
              value={stats.totalClients.toString()}
              subtitle="所有客户"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-[#18FF74]" />}
              title="活跃客户"
              value={stats.activeClients.toString()}
              subtitle="有在途贷款"
            />
            <StatsCard
              icon={<Building2 className="w-6 h-6 text-amber-400" />}
              title="累计贷款"
              value={stats.totalLoans.toString()}
              subtitle="所有贷款笔数"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
              title="累计放款"
              value={`¥${(stats.totalAmount / 10000).toFixed(1)}万`}
              subtitle="总放款金额"
            />
          </div>
        </motion.section>

        {/* 搜索栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索客户..."
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
        </motion.div>

        {/* 客户列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#FFD700] to-[#FF8C00] rounded-full" />
            <h3 className="text-lg">客户列表</h3>
          </div>
          <div className="space-y-3">
            {mockClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] flex items-center justify-center text-xl">
                      {client.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg">{client.name}</div>
                      <div className="text-sm text-white/60 flex items-center gap-2 mt-1">
                        <span>{client.type}</span>
                        <span>·</span>
                        <MapPin className="w-4 h-4" />
                        <span>{client.location}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    client.status === "active" 
                      ? "text-emerald-400 bg-emerald-400/20" 
                      : "text-gray-400 bg-gray-400/20"
                  }`}>
                    {client.status === "active" ? "活跃" : "休眠"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-white/60 mb-1">联系方式</div>
                    <div className="flex items-center gap-2 text-white">
                      <Phone className="w-4 h-4" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white mt-1">
                      <Mail className="w-4 h-4" />
                      <span>{client.email}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 mb-1">贷款统计</div>
                    <div className="text-white">
                      <div>贷款笔数：{client.totalLoans} 笔</div>
                      <div>累计金额：¥{(client.totalAmount / 10000).toFixed(1)}万</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      navigateToSubRoute("finance", `approval/list?clientId=${client.id}`);
                    }}
                  >
                    查看详情
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      if (client.phone) {
                        window.location.href = `tel:${client.phone}`;
                      } else {
                        toast.success(`正在打开与 ${client.name} 的聊天窗口...`);
                        // 实际项目中这里可以打开IM窗口
                        // navigateToSubRoute("chat", `client/${client.id}`);
                      }
                    }}
                  >
                    联系客户
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

