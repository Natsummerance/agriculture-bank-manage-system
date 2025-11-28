import { useState } from "react";
import { motion } from "motion/react";
import { User, Award, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

interface ExpertApplication {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialty: string;
  qualification: string;
  experience: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

const mockApplications: ExpertApplication[] = [
  {
    id: "1",
    name: "王教授",
    phone: "138****1234",
    email: "wang@example.com",
    specialty: "水稻种植",
    qualification: "农业博士，20年种植经验",
    experience: "曾在多个农业科研院所工作",
    status: "pending",
    submittedAt: "2025-03-01 10:00",
  },
  {
    id: "2",
    name: "李专家",
    phone: "139****5678",
    email: "li@example.com",
    specialty: "果树栽培",
    qualification: "高级农艺师",
    experience: "10年果树种植指导经验",
    status: "pending",
    submittedAt: "2025-03-02 14:30",
  },
];

export default function AdminExpertAudit() {
  const [applications, setApplications] = useState<ExpertApplication[]>(mockApplications);

  const handleApprove = (id: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "approved" as const } : a))
    );
    toast.success("已批准专家申请");
  };

  const handleReject = (id: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "rejected" as const } : a))
    );
    toast.success("已拒绝专家申请");
  };

  const pendingCount = applications.filter((a) => a.status === "pending").length;

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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              专家资质审核
            </h2>
            <p className="text-sm text-white/60">
              审核专家申请，验证资质和认证状态
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="text-sm px-3 py-1 rounded-full bg-amber-400/20 text-amber-400">
              {pendingCount} 个待审核申请
            </div>
          )}
        </motion.div>

        {/* 申请列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {applications.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无专家申请</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app, index) => {
                const statusConfig = {
                  pending: { label: "待审核", color: "text-amber-400", bg: "bg-amber-400/20", icon: Clock },
                  approved: { label: "已通过", color: "text-emerald-400", bg: "bg-emerald-400/20", icon: CheckCircle2 },
                  rejected: { label: "已拒绝", color: "text-red-400", bg: "bg-red-400/20", icon: XCircle },
                };
                const status = statusConfig[app.status];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <User className="w-5 h-5 text-[#00D6C2]" />
                          <span className="text-xl font-semibold text-white">{app.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${status.color} ${status.bg}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="text-sm text-white/60 space-y-1 mb-3">
                          <div>联系方式：{app.phone} · {app.email}</div>
                          <div>专业领域：{app.specialty}</div>
                          <div>资质：{app.qualification}</div>
                          <div>经验：{app.experience}</div>
                          <div>申请时间：{app.submittedAt}</div>
                        </div>
                      </div>
                      {app.status === "pending" && (
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            onClick={() => handleApprove(app.id)}
                            className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            批准
                          </Button>
                          <Button
                            onClick={() => handleReject(app.id)}
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            拒绝
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

