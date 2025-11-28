import React, { useEffect } from "react";
import { motion } from "motion/react";
import { FileText } from "lucide-react";
import {
  useBuyerOrderStore,
  type OrderStatus,
  type RefundStatus,
  type RefundHistoryItem,
} from "../../../stores/buyerOrderStore";
import { FilterPanel } from "../../../components/common/FilterPanel";
import { DateRangePicker } from "../../../components/common/DateRangePicker";
import { Button } from "../../../components/ui/button";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { z } from "zod";
import { useZodForm } from "../../../hooks/useZodForm";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../../../components/ui/dialog";

const statusOptions: { label: string; value: OrderStatus | "all" }[] = [
  { label: "全部", value: "all" },
  { label: "待支付", value: "pending" },
  { label: "已支付", value: "paid" },
  { label: "待发货", value: "to-ship" },
  { label: "已发货", value: "shipped" },
  { label: "已完成", value: "completed" },
  { label: "退款中", value: "refunding" },
];

const statusLabel: Record<OrderStatus, string> = {
  pending: "待支付",
  paid: "已支付",
  "to-ship": "待发货",
  shipped: "已发货",
  completed: "已完成",
  refunding: "退款中",
  refunded: "已退款",
  cancelled: "已取消",
};

const checkoutSchema = z.object({
  shippingName: z.string().min(1, "请输入收货人姓名"),
  shippingPhone: z
    .string()
    .min(1, "请输入手机号")
    .regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
  shippingAddress: z.string().min(5, "请输入详细收货地址"),
  paymentMethod: z.string().min(1, "请选择支付方式"),
});

const refundSchema = z.object({
  refundReason: z.string().min(5, "请填写至少5个字的退款原因"),
});

const refundStatusLabel: Record<RefundStatus, string> = {
  pending: "待卖家处理",
  approved: "卖家已同意，退款处理中",
  rejected: "卖家已拒绝，可申请平台仲裁",
  escalated: "已申请平台仲裁，等待平台处理",
  success: "平台已判定退款成功",
  failed: "平台已判定退款失败",
};

export default function BuyerOrders() {
  const {
    orders,
    filterStatus,
    setFilterStatus,
    dateRange,
    setDateRange,
    loading,
    loadOrders,
    updateStatus,
    cancelOrder,
    updateOrder,
    setRefundStatus,
    appendRefundHistory,
  } = useBuyerOrderStore();

  // 加载订单列表
  useEffect(() => {
    loadOrders(filterStatus === 'all' ? undefined : filterStatus);
  }, [filterStatus]);

  const checkoutForm = useZodForm(checkoutSchema);
  const refundForm = useZodForm(refundSchema);
  const [activeOrderId, setActiveOrderId] = React.useState<string | null>(null);
  const [timelineOrderId, setTimelineOrderId] = React.useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const created = new Date(o.createdAt);
    let matchDate = true;
    if (dateRange?.from && dateRange.to) {
      matchDate = created >= dateRange.from && created <= dateRange.to;
    }
    return matchStatus && matchDate;
  });

  const handlePayClick = (id: string) => {
    setActiveOrderId(id);
    checkoutForm.reset();
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelOrder(id);
    } catch (error) {
      // 错误已在store中处理
    }
  };

  const handleConfirm = (id: string) => {
    updateStatus(id, "completed");
    toast.success("确认收货成功");
  };

  const handleRefundClick = (id: string) => {
    setActiveOrderId(id);
    refundForm.reset();
  };

  const openTimeline = (id: string) => {
    setTimelineOrderId(id);
  };

  const closeTimeline = () => {
    setTimelineOrderId(null);
  };

  const getTimeline = (orderId: string): RefundHistoryItem[] => {
    const order = orders.find((o) => o.id === orderId);
    return order?.refundHistory ?? [];
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D6C2]/40 to-[#18FF74]/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#18FF74]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
              订单中心
            </h2>
            <p className="text-xs text-white/60">
              查看所有历史订单，支持按状态与时间筛选，并在此完成支付、收货与退款操作。
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <FilterPanel
            title="订单状态"
            value={filterStatus}
            onChange={(v) => setFilterStatus(v as OrderStatus | "all")}
            options={statusOptions.map((o) => ({ label: o.label, value: o.value }))}
          />
          <DateRangePicker
            value={dateRange as DateRange | undefined}
            onChange={(range) => setDateRange(range)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-white/60">
            暂无订单记录，去「买好货」下单试试吧～
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((o, idx) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>订单号：{o.id}</span>
                  <span>{new Date(o.createdAt).toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  {o.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-white">{item.name}</span>
                      <span className="text-white/70">
                        x{item.quantity} ¥{item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/70">
                    状态：<span className="text-emerald-400">{statusLabel[o.status]}</span>
                    {o.refundStatus && (
                      <span className="ml-3 text-xs text-sky-400">
                        （退款：{refundStatusLabel[o.refundStatus]}）
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                  {o.status === "pending" && (
                    <>
                      <Dialog open={activeOrderId === o.id} onOpenChange={(open) => !open && setActiveOrderId(null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => handlePayClick(o.id)}>
                            支付
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-950 border-white/10 text-white">
                          <DialogHeader>
                            <DialogTitle>填写收货信息并支付</DialogTitle>
                            <DialogDescription>
                              请填写收货信息，后续可在订单详情中查看。
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...checkoutForm}>
                            <form
                              className="space-y-4"
                              onSubmit={checkoutForm.handleSubmit((values) => {
                                if (!activeOrderId) return;
                                updateOrder(activeOrderId, {
                                  shippingName: values.shippingName,
                                  shippingPhone: values.shippingPhone,
                                  shippingAddress: values.shippingAddress,
                                  paymentMethod: values.paymentMethod,
                                });
                                updateStatus(activeOrderId, "paid");
                                toast.success("支付成功（模拟）");
                                setActiveOrderId(null);
                              })}
                            >
                              <FormField
                                control={checkoutForm.control}
                                name="shippingName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>收货人姓名</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={checkoutForm.control}
                                name="shippingPhone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>手机号</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={checkoutForm.control}
                                name="shippingAddress"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>收货地址</FormLabel>
                                    <FormControl>
                                      <Textarea rows={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={checkoutForm.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>支付方式</FormLabel>
                                    <FormControl>
                                      <Input placeholder="微信支付 / 支付宝 / 银行卡" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter>
                                <Button type="submit" size="sm">
                                  确认支付
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancel(o.id)}
                                >
                                  取消订单
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  {o.status === "shipped" && (
                    <Button size="sm" onClick={() => handleConfirm(o.id)}>
                      确认收货
                    </Button>
                  )}
                  {o.status === "paid" && (
                    <Dialog open={activeOrderId === o.id} onOpenChange={(open) => !open && setActiveOrderId(null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => handleRefundClick(o.id)}>
                          申请退款
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-950 border-white/10 text-white">
                        <DialogHeader>
                          <DialogTitle>申请退款</DialogTitle>
                          <DialogDescription>请填写退款原因，平台与卖家将共同处理。</DialogDescription>
                        </DialogHeader>
                        <Form {...refundForm}>
                          <form
                            className="space-y-4"
                            onSubmit={refundForm.handleSubmit((values) => {
                              if (!activeOrderId) return;
                              updateOrder(activeOrderId, { refundReason: values.refundReason });
                              updateStatus(activeOrderId, "refunding");
                              setRefundStatus(activeOrderId, "pending");
                              appendRefundHistory(activeOrderId, {
                                actor: "buyer",
                                action: "发起退款申请",
                                note: values.refundReason,
                                at: new Date().toISOString(),
                              });
                              toast.success("已发起退款申请");
                              setActiveOrderId(null);
                            })}
                          >
                            <FormField
                              control={refundForm.control}
                              name="refundReason"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>退款原因</FormLabel>
                                  <FormControl>
                                    <Textarea rows={4} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <DialogFooter>
                              <Button type="submit" size="sm">
                                提交申请
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}
                  {o.refundStatus && (
                    <Dialog open={timelineOrderId === o.id} onOpenChange={(open) => !open && closeTimeline()}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => openTimeline(o.id)}>
                          查看退款进度
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-950 border-white/10 text-white max-h-[70vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>退款进度</DialogTitle>
                          <DialogDescription>展示该订单退款处理的完整时间线。</DialogDescription>
                        </DialogHeader>
                        <div className="mt-2 space-y-3 text-sm">
                          {getTimeline(o.id).length === 0 ? (
                            <div className="text-white/60">暂无详细记录。</div>
                          ) : (
                            getTimeline(o.id).map((h, idx) => (
                              <div
                                key={idx}
                                className="border-l border-emerald-400/40 pl-3 relative"
                              >
                                <div className="w-2 h-2 rounded-full bg-emerald-400 absolute -left-1 top-1" />
                                <div className="text-xs text-white/60">
                                  {new Date(h.at).toLocaleString()} · {h.actor === "buyer"
                                    ? "买家"
                                    : h.actor === "farmer"
                                    ? "卖家"
                                    : "平台"}
                                </div>
                                <div className="text-white mt-0.5">{h.action}</div>
                                {h.note && <div className="text-xs text-white/70 mt-0.5">备注：{h.note}</div>}
                              </div>
                            ))
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

