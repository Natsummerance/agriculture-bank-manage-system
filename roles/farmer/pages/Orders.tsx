import * as React from "react";
import { motion } from "motion/react";
import { Package, Truck, CheckCircle2, ShoppingBasket } from "lucide-react";
import { useFarmerOrderStore } from "../../../stores/farmerOrderStore";
import { Button } from "../../../components/ui/button";
import { navigateToTab } from "../../../utils/navigationEvents";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { toast } from "sonner";

const logisticsSchema = z.object({
  shippingCompany: z.string().min(1, "请输入快递公司"),
  trackingNumber: z.string().min(1, "请输入快递单号"),
});

export default function FarmerOrders() {
  const { orders, updateOrder, updateStatus } = useFarmerOrderStore();
  const [activeOrderId, setActiveOrderId] = React.useState<string | null>(null);
  const form = useZodForm(logisticsSchema);

  const handleShipClick = (id: string) => {
    setActiveOrderId(id);
    form.reset();
  };

  const handleComplete = (id: string) => {
    updateStatus(id, "completed");
    toast.success("已标记为已完成");
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              订单中心·发货管理
            </h2>
            <p className="text-xs text-white/60">
              集中查看所有买家订单，快速填写物流、跟踪发货进度。
            </p>
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center"
          >
            <ShoppingBasket className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60 mb-2">暂时还没有订单</p>
            <p className="text-sm text-white/40 mb-6">当有买家下单时，订单会显示在这里</p>
            <Button
              onClick={() => navigateToTab("trade")}
              variant="outline"
              className="border-[#18FF74]/40 text-[#18FF74] hover:bg-[#18FF74]/10"
            >
              去管理商品
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {orders.map((o, index) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>订单号：{o.id}</span>
                  <span>买家：{o.buyerName}</span>
                </div>
                <div className="space-y-1 text-sm text-white/80">
                  {o.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-1 text-xs text-white/60">
                    <span>合计金额：</span>
                    <span className="text-emerald-400 font-mono">
                      ¥{o.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm text-white/70 flex items-center gap-2">
                    状态：
                    <span className="flex items-center gap-1 text-emerald-400">
                      {o.status === "to-ship" && (
                        <Package className="w-4 h-4" />
                      )}
                      {o.status === "shipped" && <Truck className="w-4 h-4" />}
                      {o.status === "completed" && (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      {o.status === "to-ship"
                        ? "待发货"
                        : o.status === "shipped"
                        ? "已发货"
                        : "已完成"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {o.status === "to-ship" && (
                      <Dialog
                        open={activeOrderId === o.id}
                        onOpenChange={(open) =>
                          !open && setActiveOrderId(null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => handleShipClick(o.id)}
                          >
                            填写物流
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-950 border-white/10 text-white">
                          <DialogHeader>
                            <DialogTitle>填写物流信息</DialogTitle>
                            <DialogDescription>
                              请填写快递公司和运单号。
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...form}>
                            <form
                              className="space-y-4"
                              onSubmit={form.handleSubmit((values) => {
                                if (!activeOrderId) return;
                                updateOrder(activeOrderId, {
                                  shippingCompany: values.shippingCompany,
                                  trackingNumber: values.trackingNumber,
                                  status: "shipped",
                                });
                                toast.success("物流信息已提交");
                                setActiveOrderId(null);
                              })}
                            >
                              <FormField
                                control={form.control}
                                name="shippingCompany"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>快递公司</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
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
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter>
                                <Button type="submit" size="sm">
                                  提交
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    )}
                    {o.status === "shipped" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleComplete(o.id)}
                      >
                        标记完成
                      </Button>
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

