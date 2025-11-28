import { useEffect } from "react";
import { motion } from "motion/react";
import { Package, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useAdminAuditStore } from "../../../stores/adminAuditStore";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const mockProducts = [
  {
    id: "ap1",
    name: "东北稻花香大米 5kg",
    farmerName: "张农户",
    submittedAt: "2025-03-01 09:30",
    status: "pending" as const,
  },
  {
    id: "ap2",
    name: "有机苹果 10kg",
    farmerName: "李果农",
    submittedAt: "2025-03-02 14:20",
    status: "pending" as const,
  },
];

export default function AdminProductAudit() {
  const { productAudits, setProductAudits, updateProductStatus } = useAdminAuditStore();

  useEffect(() => {
    if (productAudits.length === 0) {
      setProductAudits(mockProducts);
    }
  }, [productAudits.length, setProductAudits]);

  const handleApprove = (id: string) => {
    updateProductStatus(id, "approved");
    toast.success("商品已通过审核");
  };

  const handleReject = (id: string) => {
    updateProductStatus(id, "rejected");
    toast.success("商品已拒绝");
  };

  const pendingCount = productAudits.filter((p) => p.status === "pending").length;

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
              商品审核
            </h2>
            <p className="text-sm text-white/60">
              审核农户提交的商品信息，确保内容合规
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
            <h3 className="text-lg">待审核商品</h3>
          </div>

          {productAudits.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无待审核商品</p>
            </div>
          ) : (
            <div className="space-y-3">
              {productAudits.map((p, index) => {
                const statusConfig = {
                  pending: { label: "待审核", color: "text-amber-400", bg: "bg-amber-400/20", icon: Clock },
                  approved: { label: "已通过", color: "text-emerald-400", bg: "bg-emerald-400/20", icon: CheckCircle2 },
                  rejected: { label: "已拒绝", color: "text-red-400", bg: "bg-red-400/20", icon: XCircle },
                };
                const status = statusConfig[p.status];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Package className="w-5 h-5 text-[#9D4EDD]" />
                          <h4 className="text-lg font-semibold text-white">{p.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${status.color} ${status.bg}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="text-sm text-white/60 space-y-1">
                          <div>农户：{p.farmerName}</div>
                          <div>提交时间：{p.submittedAt}</div>
                        </div>
                      </div>
                      {p.status === "pending" && (
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            onClick={() => handleApprove(p.id)}
                            className="bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D] text-white hover:opacity-90"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            通过
                          </Button>
                          <Button
                            onClick={() => handleReject(p.id)}
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
