import { useBuyerOrderStore, type RefundStatus } from "../../../stores/buyerOrderStore";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

const farmerVisibleStatuses: RefundStatus[] = ["pending", "approved", "rejected"];

export default function FarmerRefunds() {
  const { orders, setRefundStatus, updateStatus, appendRefundHistory } = useBuyerOrderStore();

  const refundOrders = orders.filter(
    (o) => o.status === "refunding" && o.refundStatus && farmerVisibleStatuses.includes(o.refundStatus),
  );

  const handleApprove = (id: string) => {
    setRefundStatus(id, "approved");
    updateStatus(id, "refunded");
    appendRefundHistory(id, {
      actor: "farmer",
      action: "同意退款",
      at: new Date().toISOString(),
    });
    toast.success("已同意退款，订单将退款给买家（模拟）");
  };

  const handleReject = (id: string) => {
    setRefundStatus(id, "rejected");
    appendRefundHistory(id, {
      actor: "farmer",
      action: "拒绝退款",
      at: new Date().toISOString(),
    });
    toast.success("已拒绝退款申请");
  };

  return (
    <div className="p-6 space-y-4 text-white">
      <h1 className="text-xl font-semibold">退款审核</h1>
      {refundOrders.length === 0 ? (
        <div className="text-white/60">当前没有需要处理的退款申请。</div>
      ) : (
        <div className="space-y-3 text-sm">
          {refundOrders.map((o) => (
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
                {o.refundStatus === "pending" && (
                  <>
                    <Button size="sm" onClick={() => handleApprove(o.id)}>
                      同意退款
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(o.id)}>
                      拒绝退款
                    </Button>
                  </>
                )}
                {o.refundStatus === "approved" && (
                  <span className="text-emerald-400 text-xs">已同意退款，等待平台处理</span>
                )}
                {o.refundStatus === "rejected" && (
                  <span className="text-amber-400 text-xs">已拒绝退款，可能进入平台仲裁</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


