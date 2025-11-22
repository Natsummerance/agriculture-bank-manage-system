import { useState } from "react";
import { motion } from "motion/react";
import { Truck, Package, CheckSquare } from "lucide-react";
import { useFarmerOrderStore } from "../../../stores/farmerOrderStore";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const batchShipSchema = z.object({
  logisticsCompany: z.string().min(1, "请选择快递公司"),
});

const logisticsCompanies = [
  "顺丰速运",
  "中通快递",
  "圆通速递",
  "申通快递",
  "韵达快递",
  "德邦快递",
  "京东物流",
];

export default function FarmerOrderBatchShip() {
  const { orders, updateOrder } = useFarmerOrderStore();
  const form = useZodForm(batchShipSchema);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [trackingNumbers, setTrackingNumbers] = useState<Record<string, string>>({});

  const toShipOrders = orders.filter((o) => o.status === "to-ship");

  const toggleOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleBatchShip = form.handleSubmit((values) => {
    if (selectedOrders.size === 0) {
      toast.error("请至少选择一个订单");
      return;
    }

    selectedOrders.forEach((orderId) => {
      const trackingNumber = trackingNumbers[orderId];
      if (!trackingNumber) {
        toast.error(`订单 ${orderId} 缺少运单号`);
        return;
      }
      updateOrder(orderId, {
        logisticsCompany: values.logisticsCompany,
        trackingNumber,
        status: "shipped",
        shippedAt: new Date().toISOString(),
      });
    });

    toast.success(`已批量发货 ${selectedOrders.size} 个订单`);
    navigateToSubRoute("trade", "orders");
  });

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
              批量发货
            </h2>
            <p className="text-sm text-white/60">
              选择多个订单，统一填写物流信息并批量发货
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("trade", "orders")}
          >
            返回订单列表
          </Button>
        </motion.div>

        {/* 批量发货表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-5 h-5 text-[#00D6C2]" />
            <h3 className="text-lg">统一物流信息</h3>
          </div>

          <Form {...form}>
            <form onSubmit={handleBatchShip} className="space-y-4">
              <FormField
                control={form.control}
                name="logisticsCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>快递公司（统一）</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                      >
                        <option value="">请选择快递公司</option>
                        {logisticsCompanies.map((company) => (
                          <option key={company} value={company}>
                            {company}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </motion.section>

        {/* 订单列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">待发货订单</h3>
            </div>
            <div className="text-sm text-white/60">
              已选择 {selectedOrders.size} / {toShipOrders.length} 个订单
            </div>
          </div>

          {toShipOrders.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无待发货订单</p>
            </div>
          ) : (
            <div className="space-y-3">
              {toShipOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-2xl glass-morphism border p-6 ${
                    selectedOrders.has(order.id)
                      ? "border-[#00D6C2] bg-[#00D6C2]/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleOrder(order.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 ${
                        selectedOrders.has(order.id)
                          ? "border-[#00D6C2] bg-[#00D6C2]"
                          : "border-white/30"
                      }`}
                    >
                      {selectedOrders.has(order.id) && (
                        <CheckSquare className="w-4 h-4 text-black" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-white">订单 {order.id}</div>
                        <div className="text-[#18FF74] font-semibold">
                          ¥{order.totalAmount.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-white/60 mb-3">
                        买家：{order.buyerName} · {order.items.length} 件商品
                      </div>
                      {selectedOrders.has(order.id) && (
                        <Input
                          placeholder="请输入运单号"
                          value={trackingNumbers[order.id] || ""}
                          onChange={(e) =>
                            setTrackingNumbers({
                              ...trackingNumbers,
                              [order.id]: e.target.value,
                            })
                          }
                          className="bg-white/5 border-white/10 mt-2"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {selectedOrders.size > 0 && (
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleBatchShip}
                className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
              >
                <Truck className="w-4 h-4 mr-2" />
                批量发货 ({selectedOrders.size} 个订单)
              </Button>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
