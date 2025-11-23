import { useBuyerOrderStore, type RefundStatus } from "../../../stores/buyerOrderStore";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

const adminFocusStatuses: RefundStatus[] = ["rejected", "escalated", "pending"];

export default function AdminRefundDisputes() {
  const { orders, setRefundStatus, updateStatus, appendRefundHistory } = useBuyerOrderStore();

  const disputeOrders = orders.filter(
    (o) => o.status === "refunding" && o.refundStatus && adminFocusStatuses.includes(o.refundStatus),
  );

  const handleDecision = (id: string, result: "success" | "failed") => {
    setRefundStatus(id, result);
    appendRefundHistory(id, {
      actor: "admin",
      action: result === "success" ? "平台仲裁：退款成功" : "平台仲裁：退款失败",
      at: new Date().toISOString(),
    });
    if (result === "success") {
      updateStatus(id, "refunded");
    }
    toast.success(result === "success" ? "已判定退款成功" : "已判定退款失败");
  };

  return (
    <div className="p-6 space-y-4 text-white">
      <h1 className="text-xl font-semibold">退款仲裁中心</h1>
      {disputeOrders.length === 0 ? (
        <div className="text-white/60">暂无需要平台仲裁的退款订单。</div>
      ) : (
        <div className="space-y-3 text-sm">
          {disputeOrders.map((o) => (
            <div
              key={o.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>订单号：{o.id}</span>
                <span>下单时间：{new Date(o.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-xs text-white/70">
                退款原因：{o.refundReason || "未填写"}
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button size="sm" onClick={() => handleDecision(o.id, "success")}>
                  判定退款成功
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDecision(o.id, "failed")}>
                  判定退款失败
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


