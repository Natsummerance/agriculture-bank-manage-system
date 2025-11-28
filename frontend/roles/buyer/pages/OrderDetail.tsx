import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Package, Truck, MapPin, User, Phone, Calendar, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useBuyerOrderStore } from "../../../stores/buyerOrderStore";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { toast } from "sonner";

export default function BuyerOrderDetail() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const { orders, loadOrders, updateStatus, cancelOrder } = useBuyerOrderStore();
  const order = orderId ? orders.find((o) => o.id === orderId) : null;

  useEffect(() => {
    if (!order && orderId) {
      loadOrders();
    }
  }, [orderId, order, loadOrders]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60 mb-2">未找到对应的订单</p>
            <Button
              onClick={() => navigateToSubRoute("trade", "orders")}
              variant="outline"
              className="mt-4"
            >
              返回列表
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleCancel = async () => {
    if (window.confirm("确定要取消这个订单吗？")) {
      try {
        await cancelOrder(order.id);
        toast.success("订单已取消");
      } catch (error) {
        toast.error("取消订单失败");
      }
    }
  };

  const handleConfirmReceipt = async () => {
    if (window.confirm("确认已收到商品吗？")) {
      try {
        await updateStatus(order.id, "completed");
        toast.success("已确认收货");
      } catch (error) {
        toast.error("确认收货失败");
      }
    }
  };

  const statusLabel: Record<string, string> = {
    pending: "待支付",
    paid: "已支付",
    "to-ship": "待发货",
    shipped: "已发货",
    completed: "已完成",
    refunding: "退款中",
    refunded: "已退款",
    cancelled: "已取消",
  };

  const statusColor: Record<string, string> = {
    pending: "text-amber-400",
    paid: "text-blue-400",
    "to-ship": "text-cyan-400",
    shipped: "text-purple-400",
    completed: "text-emerald-400",
    refunding: "text-orange-400",
    refunded: "text-gray-400",
    cancelled: "text-red-400",
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
              订单详情
            </h2>
            <p className="text-sm text-white/60">
              订单编号：{order.id} · 创建时间：{new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("trade", "orders")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回列表
            </Button>
            {order.status === "pending" && (
              <Button
                variant="destructive"
                onClick={handleCancel}
              >
                取消订单
              </Button>
            )}
            {order.status === "shipped" && (
              <Button
                onClick={handleConfirmReceipt}
                className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                确认收货
              </Button>
            )}
          </div>
        </motion.div>

        {/* 订单状态 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">订单状态</p>
              <p className={`text-lg font-semibold ${statusColor[order.status] || "text-white"}`}>
                {statusLabel[order.status] || order.status}
              </p>
            </div>
            {order.refundStatus && (
              <div>
                <p className="text-sm text-white/60 mb-1">退款状态</p>
                <p className="text-lg font-semibold text-orange-400">
                  {order.refundStatus === "pending" && "退款中"}
                  {order.refundStatus === "approved" && "已同意退款"}
                  {order.refundStatus === "rejected" && "已拒绝退款"}
                  {order.refundStatus === "success" && "退款成功"}
                  {order.refundStatus === "failed" && "退款失败"}
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* 商品信息 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">商品信息</h3>
          </div>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-white/60">
                      数量：{item.quantity} · 单价：¥{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-[#18FF74]">
                    ¥{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-lg font-semibold text-white">订单总额</span>
            <span className="text-2xl font-bold text-[#18FF74]">¥{order.totalAmount.toFixed(2)}</span>
          </div>
        </motion.section>

        {/* 收货信息 */}
        {order.shippingAddress && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">收货信息</h3>
            </div>
            <div className="space-y-2 text-sm">
              {order.shippingName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-white/60" />
                  <span className="text-white/80">收货人：{order.shippingName}</span>
                </div>
              )}
              {order.shippingPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-white/60" />
                  <span className="text-white/80">联系电话：{order.shippingPhone}</span>
                </div>
              )}
              {order.shippingAddress && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white/60" />
                  <span className="text-white/80">收货地址：{order.shippingAddress}</span>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* 支付信息 */}
        {order.paymentMethod && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">支付信息</h3>
            </div>
            <p className="text-sm text-white/80">支付方式：{order.paymentMethod}</p>
          </motion.section>
        )}
      </div>
    </div>
  );
}

