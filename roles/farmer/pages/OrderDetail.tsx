import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Package, Truck, MapPin, User, Phone, Calendar } from "lucide-react";
import { useFarmerOrderStore } from "../../../stores/farmerOrderStore";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function FarmerOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { orders } = useFarmerOrderStore();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/60">未找到对应的订单</p>
        </div>
      </div>
    );
  }

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
              返回列表
            </Button>
            {order.status === "to-ship" && (
              <Button
                onClick={() => navigateToSubRoute("trade", "ship", { id: order.id })}
                className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
              >
                立即发货
              </Button>
            )}
          </div>
        </motion.div>

        {/* 订单信息 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {/* 订单商品 */}
          <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-[#00D6C2]" />
              <h3 className="text-lg">订单商品</h3>
            </div>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5"
                >
                  <div>
                    <div className="text-white font-semibold">{item.name}</div>
                    <div className="text-sm text-white/60">
                      规格：{item.spec} · 数量：{item.quantity}
                    </div>
                  </div>
                  <div className="text-[#00D6C2] font-semibold">
                    ¥{item.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-lg font-semibold text-white">订单总额</span>
              <span className="text-2xl font-semibold text-[#18FF74]">
                ¥{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 收货信息 */}
          <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-[#18FF74]" />
              <h3 className="text-lg">收货信息</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-white/60" />
                <span className="text-white">{order.buyerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white/60" />
                <span className="text-white">{order.buyerPhone}</span>
              </div>
              <div className="text-white/80 mt-2">
                {order.shippingAddress}
              </div>
            </div>

            {/* 物流信息 */}
            {order.logisticsCompany && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="w-5 h-5 text-[#00D6C2]" />
                  <h4 className="text-base">物流信息</h4>
                </div>
                <div className="text-sm text-white/80">
                  <div>快递公司：{order.logisticsCompany}</div>
                  <div>运单号：{order.trackingNumber}</div>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* 订单状态时间线 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-[#00D6C2]" />
            <h3 className="text-lg">订单状态</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white">订单已创建</span>
              <span className="text-sm text-white/60 ml-auto">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
            {order.status === "shipped" && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-white">订单已发货</span>
                <span className="text-sm text-white/60 ml-auto">
                  {order.shippedAt ? new Date(order.shippedAt).toLocaleString() : "待确认"}
                </span>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

