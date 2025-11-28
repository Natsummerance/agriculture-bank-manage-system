import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRightCircle, CreditCard, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFinancingStore, type FinancingStatus } from "../../../stores/financingStore";
import { useRole } from "../../../contexts/RoleContext";
import { FilterPanel } from "../../../components/common/FilterPanel";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const statusOptions: { label: string; value: FinancingStatus | "all" }[] = [
  { label: "全部", value: "all" },
  { label: "申请中", value: "applied" },
  { label: "审批中", value: "reviewing" },
  { label: "已通过", value: "approved" },
  { label: "还款中", value: "repaying" },
  { label: "已结清", value: "settled" },
];

const statusLabel: Record<FinancingStatus, string> = {
  applied: "申请中",
  reviewing: "审批中",
  approved: "已通过",
  rejected: "已拒绝",
  signed: "已签约",
  disbursed: "已放款",
  repaying: "还款中",
  settled: "已结清",
};

export default function FinanceList() {
  const { userProfile } = useRole();
  const { list } = useFinancingStore();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<FinancingStatus | "all">("all");

  const financingList = useMemo(() => {
    if (!userProfile) return [];
    return list.filter((f) => f.farmerId === userProfile.id);
  }, [list, userProfile]);

  const filtered = financingList.filter((f) =>
    filterStatus === "all" ? true : f.status === filterStatus,
  );

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              我的融资·资金轨迹
            </h2>
            <p className="text-xs text-white/60">
              查看所有融资申请与进度，点击任意一条可进入详情和还款计划。
            </p>
          </div>
          <FilterPanel
            title="状态"
            value={filterStatus}
            onChange={(v) => setFilterStatus(v as FinancingStatus | "all")}
            options={statusOptions}
          />
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center"
          >
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60 mb-2">暂时还没有任何融资记录</p>
            <p className="text-sm text-white/40 mb-6">点击下方按钮提交第一笔融资申请</p>
            <Button
              onClick={() => navigateToSubRoute("finance", "apply")}
              className="bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              提交融资申请
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3 text-sm">
            {filtered.map((f, index) => (
              <motion.button
                key={f.id}
                onClick={() => navigate(`/farmer/finance/detail/${f.id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2, scale: 1.01 }}
                className="w-full text-left rounded-2xl glass-morphism border border-white/10 bg-white/5 p-4 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-[#00D6C2]" />
                    <div className="font-semibold text-white">
                      ¥{f.amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-white/60">
                    期限：{f.termMonths} 个月 · 创建时间：
                    {new Date(f.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400">
                    {statusLabel[f.status]}
                  </span>
                  <ArrowRightCircle className="w-4 h-4 text-emerald-400" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


