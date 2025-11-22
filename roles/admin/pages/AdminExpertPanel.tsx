import { useState } from "react";
import { motion } from "motion/react";
import { 
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Star
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { StatsCard } from "../../../components/common/StatsCard";
import { toast } from "sonner";

const mockExperts = [
  {
    id: 1,
    name: "张教授",
    field: "水稻种植",
    status: "approved",
    rating: 4.9,
    consultations: 1230,
    createdAt: "2025-01-15",
  },
  {
    id: 2,
    name: "李专家",
    field: "果树管理",
    status: "pending",
    rating: 4.8,
    consultations: 980,
    createdAt: "2025-02-20",
  },
];

export default function AdminExpertPanel() {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = {
    totalExperts: mockExperts.length,
    approvedExperts: mockExperts.filter((e) => e.status === "approved").length,
    pendingExperts: mockExperts.filter((e) => e.status === "pending").length,
    totalConsultations: mockExperts.reduce((sum, e) => sum + e.consultations, 0),
  };

  const handleApprove = (expertId: number) => {
    toast.success(`已批准专家 #${expertId}`);
  };

  const handleReject = (expertId: number) => {
    toast.success(`已拒绝专家 #${expertId}`);
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D]">
              控制智库·专家管理
            </h2>
            <p className="text-sm text-white/60">
              管理专家资质审核，查看专家信息，审核专家申请。
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
              <div className="w-1 h-6 bg-gradient-to-b from-[#9D4EDD] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">专家概览</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<Users className="w-6 h-6 text-[#00D6C2]" />}
              title="专家总数"
              value={stats.totalExperts.toString()}
              subtitle="所有专家"
            />
            <StatsCard
              icon={<CheckCircle2 className="w-6 h-6 text-[#18FF74]" />}
              title="已认证"
              value={stats.approvedExperts.toString()}
              subtitle="已通过审核"
            />
            <StatsCard
              icon={<Clock className="w-6 h-6 text-amber-400" />}
              title="待审核"
              value={stats.pendingExperts.toString()}
              subtitle="待处理申请"
            />
            <StatsCard
              icon={<Star className="w-6 h-6 text-emerald-400" />}
              title="累计咨询"
              value={stats.totalConsultations.toString()}
              subtitle="总咨询次数"
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
              placeholder="搜索专家..."
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
        </motion.div>

        {/* 专家列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#9D4EDD] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">专家列表</h3>
          </div>
          <div className="space-y-3">
            {mockExperts.map((expert, index) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9D4EDD] to-[#FF6B9D] flex items-center justify-center text-xl">
                      {expert.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg">{expert.name}</div>
                      <div className="text-sm text-white/60">{expert.field}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>{expert.rating}</span>
                        <span>·</span>
                        <span>{expert.consultations} 次咨询</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    expert.status === "approved" 
                      ? "text-emerald-400 bg-emerald-400/20" 
                      : "text-amber-400 bg-amber-400/20"
                  }`}>
                    {expert.status === "approved" ? "已认证" : "待审核"}
                  </span>
                </div>
                {expert.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(expert.id)}
                      className="flex-1 bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D] text-white hover:opacity-90"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      批准
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(expert.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      拒绝
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

