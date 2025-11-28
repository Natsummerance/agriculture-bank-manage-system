import { useState } from "react";
import { motion } from "motion/react";
import { Truck, Package } from "lucide-react";
import { useParams } from "react-router-dom";
import { useFarmerOrderStore } from "../../../stores/farmerOrderStore";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const shipSchema = z.object({
  logisticsCompany: z.string().min(1, "请选择快递公司"),
  trackingNumber: z.string().min(1, "请输入运单号"),
});

const logisticsCompanies = [
  "顺丰速运",
  "中通快递",
  "圆通速递",
  "申通快递",
  "韵达快递",
  "德邦快递",
  "京东物流",
  "其他",
];

export default function FarmerOrderShip() {
  const { id } = useParams<{ id: string }>();
  const { orders, updateOrder } = useFarmerOrderStore();
  const form = useZodForm(shipSchema);
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

  const handleShip = form.handleSubmit((values) => {
    updateOrder(order.id, {
      logisticsCompany: values.logisticsCompany,
      trackingNumber: values.trackingNumber,
      status: "shipped",
      shippedAt: new Date().toISOString(),
    });
    toast.success("发货成功！");
    navigateToSubRoute("trade", "order-detail", { id: order.id });
  });

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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              填写物流信息
            </h2>
            <p className="text-sm text-white/60">
              订单编号：{order.id}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("trade", "order-detail", { id: order.id })}
          >
            返回订单详情
          </Button>
        </motion.div>

        {/* 订单信息预览 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5 text-[#00D6C2]" />
            <h3 className="text-lg">订单商品</h3>
          </div>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-white/80">{item.name}</span>
                <span className="text-white/60">x{item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-white/60">订单总额</span>
            <span className="text-xl font-semibold text-[#18FF74]">
              ¥{order.totalAmount.toLocaleString()}
            </span>
          </div>
        </motion.section>

        {/* 发货表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-5 h-5 text-[#18FF74]" />
            <h3 className="text-lg">物流信息</h3>
          </div>

          <Form {...form}>
            <form onSubmit={handleShip} className="space-y-4">
              <FormField
                control={form.control}
                name="logisticsCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>快递公司</FormLabel>
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

              <FormField
                control={form.control}
                name="trackingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>运单号</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入运单号"
                        {...field}
                        className="bg-white/5 border-white/10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  确认发货
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigateToSubRoute("trade", "order-detail", { id: order.id })}
                >
                  取消
                </Button>
              </div>
            </form>
          </Form>
        </motion.section>
      </div>
    </div>
  );
}
