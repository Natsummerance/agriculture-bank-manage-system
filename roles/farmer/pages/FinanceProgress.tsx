import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Clock, FileText, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";
import { useFinancingStore } from "../../../stores/financingStore";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { StatsCard } from "../../../components/common/StatsCard";

type StepStatus = "completed" | "active" | "pending";

interface Step {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
  date?: string;
}

const getStepsFromStatus = (status: string): Step[] => {
  const allSteps: Omit<Step, "status">[] = [
    { id: 1, title: "提交申请", description: "融资申请已提交，等待银行审核" },
    { id: 2, title: "银行审批中", description: "银行正在审核你的融资申请" },
    { id: 3, title: "审批通过", description: "融资申请已通过银行审批" },
    { id: 4, title: "合同签署", description: "签署电子合同，确认融资条款" },
    { id: 5, title: "放款", description: "银行已放款，资金已到账" },
    { id: 6, title: "还款中", description: "按照还款计划进行还款" },
    { id: 7, title: "已结清", description: "所有款项已还清" },
  ];

  const statusMap: Record<string, number> = {
    applied: 1,
    reviewing: 2,
    approved: 3,
    rejected: 0,
    signed: 4,
    disbursed: 5,
    repaying: 6,
    settled: 7,
  };

  const currentStep = statusMap[status] || 0;

  return allSteps.map((step, index) => {
    let stepStatus: StepStatus = "pending";
    if (index + 1 < currentStep) {
      stepStatus = "completed";
    } else if (index + 1 === currentStep) {
      stepStatus = "active";
    }

    return {
      ...step,
      status: stepStatus,
      date: stepStatus === "completed" ? new Date().toLocaleDateString() : undefined,
    };
  });
};

export default function FinanceProgress() {
  const { list } = useFinancingStore();
  const [selectedFinancingId, setSelectedFinancingId] = useState<string | null>(
    list.length > 0 ? list[0].id : null
  );

  const financing = selectedFinancingId ? list.find((f) => f.id === selectedFinancingId) : null;
  const steps = financing ? getStepsFromStatus(financing.status) : [];

  useEffect(() => {
    if (list.length > 0 && !selectedFinancingId) {
      setSelectedFinancingId(list[0].id);
    }
  }, [list, selectedFinancingId]);

  if (!financing) {
    return (
      <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60 mb-2">暂无融资记录</p>
            <Button
              onClick={() => navigateToSubRoute("finance", "apply")}
              className="mt-4 bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:opacity-90"
            >
              立即申请融资
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeStep = steps.findIndex((s) => s.status === "active");
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progressPercent = (completedCount / steps.length) * 100;

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
              融资审批进度
            </h2>
            <p className="text-sm text-white/60">
              实时跟踪融资申请的审批进度和状态
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("finance", `detail?id=${financing.id}`)}
              className="border-white/20 bg-white/5 hover:bg-white/10"
            >
              查看详情
            </Button>
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("finance", "list")}
              className="border-white/20 bg-white/5 hover:bg-white/10"
            >
              返回列表
            </Button>
          </div>
        </motion.div>

        {/* 融资信息卡片 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm text-white/60 mb-1">融资编号</div>
              <div className="text-lg font-mono text-white">{financing.id}</div>
            </div>
            <div>
              <div className="text-sm text-white/60 mb-1">申请金额</div>
              <div className="text-2xl font-semibold text-[#18FF74]">
                ¥{financing.amount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-white/60 mb-1">当前状态</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00D6C2] animate-pulse" />
                <span className="text-lg text-[#00D6C2] font-semibold">
                  {steps[activeStep]?.title || "未知"}
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 进度条 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-[#18FF74] to-[#00D6C2] rounded-full" />
              <h3 className="text-lg">审批进度</h3>
            </div>
            <div className="text-sm text-white/60">
              {completedCount} / {steps.length} 步骤已完成
            </div>
          </div>

          {/* 进度条 */}
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-[#18FF74] to-[#00D6C2] rounded-full"
            />
          </div>

          {/* 步骤时间线 */}
          <div className="relative pt-6">
            {steps.map((step, index) => {
              const isActive = step.status === "active";
              const isCompleted = step.status === "completed";
              const isLast = index === steps.length - 1;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="relative flex gap-4 pb-8"
                >
                  {/* 连接线 */}
                  {!isLast && (
                    <div className="absolute left-6 top-12 w-0.5 h-full bg-white/10">
                      {isCompleted && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "100%" }}
                          transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                          className="w-full bg-gradient-to-b from-[#18FF74] to-[#00D6C2]"
                        />
                      )}
                    </div>
                  )}

                  {/* 步骤图标 */}
                  <div className="relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-gradient-to-br from-[#18FF74] to-[#00D6C2]"
                          : isActive
                          ? "bg-[#00D6C2]/20 border-2 border-[#00D6C2]"
                          : "bg-white/5 border-2 border-white/10"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-black" />
                      ) : isActive ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Clock className="w-6 h-6 text-[#00D6C2]" />
                        </motion.div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-white/20" />
                      )}
                    </motion.div>
                  </div>

                  {/* 步骤内容 */}
                  <div className="flex-1 pt-1">
                    <motion.div
                      className={`mb-1 ${
                        isActive || isCompleted ? "text-white" : "text-white/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg">{step.title}</span>
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs px-2 py-0.5 rounded-full bg-[#00D6C2]/20 text-[#00D6C2]"
                          >
                            进行中
                          </motion.span>
                        )}
                      </div>
                      <p className="text-sm text-white/60">{step.description}</p>
                      {step.date && (
                        <p className="text-xs text-white/40 mt-1">完成时间：{step.date}</p>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* 预计时间提示 */}
        {activeStep >= 0 && activeStep < steps.length && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl glass-morphism border border-amber-400/30 bg-amber-400/10 p-6 flex items-start gap-4"
          >
            <AlertCircle className="w-6 h-6 text-amber-400 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-white mb-1">预计完成时间</div>
              <div className="text-sm text-white/80">
                当前步骤预计在 1-3 个工作日内完成，请耐心等待。审批通过后，系统将第一时间通知你。
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
