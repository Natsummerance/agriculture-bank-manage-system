import { useEffect } from "react";
import { motion } from "motion/react";
import { FileText, Video, Image, MessageSquare, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useAdminAuditStore } from "../../../stores/adminAuditStore";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

const mockContents = [
  {
    id: "ac1",
    title: "水稻高产栽培技术要点",
    author: "王专家",
    type: "article" as const,
    submittedAt: "2025-03-01 08:00",
    status: "pending" as const,
  },
  {
    id: "ac2",
    title: "果树修剪技巧视频教程",
    author: "李专家",
    type: "video" as const,
    submittedAt: "2025-03-02 10:30",
    status: "pending" as const,
  },
];

const typeIcons = {
  article: FileText,
  video: Video,
  image: Image,
  qa: MessageSquare,
};

const typeLabels = {
  article: "文章",
  video: "视频",
  image: "图片",
  qa: "问答",
};

export default function AdminContentAudit() {
  const { contentAudits, setContentAudits, updateContentStatus } = useAdminAuditStore();

  useEffect(() => {
    if (contentAudits.length === 0) {
      setContentAudits(mockContents);
    }
  }, [contentAudits.length, setContentAudits]);

  const handleApprove = (id: string) => {
    updateContentStatus(id, "approved");
    toast.success("内容已通过审核");
  };

  const handleReject = (id: string) => {
    updateContentStatus(id, "rejected");
    toast.success("内容已拒绝");
  };

  const pendingCount = contentAudits.filter((c) => c.status === "pending").length;

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
              内容审核
            </h2>
            <p className="text-sm text-white/60">
              审核专家发布的文章、视频等知识内容
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="text-sm px-3 py-1 rounded-full bg-[#FF6B9D]/20 text-[#FF6B9D]">
              {pendingCount} 个待审核
            </div>
          )}
        </motion.div>

        {/* 审核列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#9D4EDD] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">待审核内容</h3>
          </div>

          {contentAudits.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无待审核内容</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contentAudits.map((c, index) => {
                const statusConfig = {
                  pending: { label: "待审核", color: "text-amber-400", bg: "bg-amber-400/20", icon: Clock },
                  approved: { label: "已通过", color: "text-emerald-400", bg: "bg-emerald-400/20", icon: CheckCircle2 },
                  rejected: { label: "已拒绝", color: "text-red-400", bg: "bg-red-400/20", icon: XCircle },
                };
                const status = statusConfig[c.status];
                const StatusIcon = status.icon;
                const TypeIcon = typeIcons[c.type];

                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <TypeIcon className="w-5 h-5 text-[#9D4EDD]" />
                          <h4 className="text-lg font-semibold text-white">{c.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${status.color} ${status.bg}`}>
                            {status.label}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">
                            {typeLabels[c.type]}
                          </span>
                        </div>
                        <div className="text-sm text-white/60 space-y-1">
                          <div>作者：{c.author}</div>
                          <div>提交时间：{c.submittedAt}</div>
                        </div>
                      </div>
                      {c.status === "pending" && (
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            onClick={() => handleApprove(c.id)}
                            className="bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D] text-white hover:opacity-90"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            通过
                          </Button>
                          <Button
                            onClick={() => handleReject(c.id)}
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
