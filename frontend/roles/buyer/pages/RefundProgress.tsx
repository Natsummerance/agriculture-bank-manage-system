import { useState } from "react";
import { motion } from "motion/react";
import { Package, Clock, CheckCircle2, XCircle, FileText, DollarSign } from "lucide-react";
import { useBuyerOrderStore } from "../../../stores/buyerOrderStore";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const refundStatusSteps = [
  { key: "applied", label: "申请退款", icon: FileText, color: "text-blue-400" },
  { key: "pending", label: "商家审核", icon: Clock, color: "text-amber-400" },
  { key: "approved", label: "审核通过", icon: CheckCircle2, color: "text-emerald-400" },
  { key: "refunded", label: "退款成功", icon: DollarSign, color: "text-[#00D6C2]" },
];

export default function RefundProgress() {
  const { orders } = useBuyerOrderStore();
  const refundOrders = orders.filter((o) => o.status === "refunding" && o.refundStatus);

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
              退款进度追踪
            </h2>
            <p className="text-sm text-white/60">
              查看退款申请的处理进度
            </p>
          </div>
        </motion.div>

        {/* 退款列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {refundOrders.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 mb-2">暂无退款申请</p>
            </div>
          ) : (
            refundOrders.map((order, index) => {
              const currentStepIndex = refundStatusSteps.findIndex(
                (s) => s.key === order.refundStatus
              );
              const currentStep = refundStatusSteps[currentStepIndex] || refundStatusSteps[0];

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-6"
                >
                  {/* 订单信息 */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-[#00D6C2]" />
                        <span className="font-semibold text-white">订单号：{order.id}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.refundStatus === "refunded"
                            ? "bg-emerald-400/20 text-emerald-400"
                            : order.refundStatus === "approved"
                            ? "bg-blue-400/20 text-blue-400"
                            : "bg-amber-400/20 text-amber-400"
                        }`}>
                          {currentStep.label}
                        </span>
                      </div>
                      <div className="text-sm text-white/60 space-y-1 pl-8">
                        <div>退款金额：¥{order.totalAmount.toFixed(2)}</div>
                        <div>申请时间：{new Date(order.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToSubRoute("trade", `order/detail?id=${order.id}`)}
                    >
                      查看详情
                    </Button>
                  </div>

                  {/* 进度条 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {refundStatusSteps.map((step, stepIndex) => {
                        const StepIcon = step.icon;
                        const isActive = stepIndex <= currentStepIndex;
                        const isCurrent = stepIndex === currentStepIndex;

                        return (
                          <div key={step.key} className="flex-1 flex flex-col items-center">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                                isActive
                                  ? "border-[#00D6C2] bg-[#00D6C2]/20"
                                  : "border-white/20 bg-white/5"
                              }`}
                            >
                              <StepIcon
                                className={`w-6 h-6 ${
                                  isActive ? "text-[#00D6C2]" : "text-white/40"
                                }`}
                              />
                            </div>
                            <div
                              className={`text-xs mt-2 text-center ${
                                isActive ? "text-white" : "text-white/40"
                              }`}
                            >
                              {step.label}
                            </div>
                            {isCurrent && order.refundHistory && order.refundHistory.length > 0 && (
                              <div className="text-xs text-white/60 mt-1 text-center">
                                {order.refundHistory[order.refundHistory.length - 1]?.action}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="relative h-1 bg-white/10 rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStepIndex + 1) / refundStatusSteps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] rounded-full"
                      />
                    </div>
                  </div>

                  {/* 退款历史 */}
                  {order.refundHistory && order.refundHistory.length > 0 && (
                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <div className="text-sm text-white/60 mb-2">处理记录</div>
                      {order.refundHistory.map((history, historyIndex) => (
                        <div
                          key={historyIndex}
                          className="text-xs text-white/60 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00D6C2]" />
                          <span>{history.action}</span>
                          <span className="text-white/40">
                            {new Date(history.at).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </motion.section>
      </div>
    </div>
  );
}

