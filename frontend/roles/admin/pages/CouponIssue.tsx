import { useState } from "react";
import { motion } from "motion/react";
import { Gift, Plus, Users, Calendar, DollarSign, Target } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { DateRangePicker } from "../../../components/common/DateRangePicker";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

interface Coupon {
  id: string;
  name: string;
  type: "discount" | "cash";
  value: number;
  minAmount: number;
  totalCount: number;
  usedCount: number;
  validDate: { from: Date; to: Date };
  targetRole: "all" | "buyer" | "farmer";
  enabled: boolean;
}

const couponSchema = z.object({
  name: z.string().min(1, "请输入优惠券名称"),
  type: z.enum(["discount", "cash"]),
  value: z.coerce.number().positive("请输入有效的金额"),
  minAmount: z.coerce.number().min(0, "最低使用金额不能为负"),
  totalCount: z.coerce.number().positive("请输入有效的发放数量"),
  targetRole: z.enum(["all", "buyer", "farmer"]),
});

const mockCoupons: Coupon[] = [
  {
    id: "1",
    name: "新用户专享",
    type: "cash",
    value: 10,
    minAmount: 50,
    totalCount: 1000,
    usedCount: 234,
    validDate: { from: new Date("2025-03-01"), to: new Date("2025-03-31") },
    targetRole: "buyer",
    enabled: true,
  },
];

export default function AdminCouponIssue() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const form = useZodForm(couponSchema, {
    defaultValues: {
      name: "",
      type: "cash",
      value: 10,
      minAmount: 0,
      totalCount: 100,
      targetRole: "all",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("请选择有效期");
      return;
    }
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      ...values,
      usedCount: 0,
      validDate: { from: dateRange.from, to: dateRange.to },
      enabled: true,
    };
    setCoupons((prev) => [...prev, newCoupon]);
    toast.success("优惠券已创建");
    setOpen(false);
    form.reset();
    setDateRange(undefined);
  });

  const handleToggle = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
    toast.success("状态已更新");
  };

  const roleLabels = {
    all: "全部用户",
    buyer: "买家",
    farmer: "农户",
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D]">
              平台优惠券发放
            </h2>
            <p className="text-sm text-white/60">
              创建和管理平台优惠券，发放给用户
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D] text-white hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                创建优惠券
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0F1E] border-white/10 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>创建优惠券</DialogTitle>
                <DialogDescription>设置优惠券信息</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>优惠券名称</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>类型</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full bg-white/5 border-white/10 rounded-md p-2">
                              <option value="cash">现金券</option>
                              <option value="discount">折扣券</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{form.watch("type") === "cash" ? "面额（元）" : "折扣（%）"}</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="bg-white/5 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="minAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>最低使用金额（元）</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>发放数量</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>发放对象</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full bg-white/5 border-white/10 rounded-md p-2">
                            <option value="all">全部用户</option>
                            <option value="buyer">买家</option>
                            <option value="farmer">农户</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <label className="text-sm text-white/80 mb-2 block">有效期</label>
                    <DateRangePicker value={dateRange} onChange={setDateRange} />
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D] text-white hover:opacity-90"
                    >
                      创建
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* 优惠券列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#9D4EDD] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">优惠券列表</h3>
          </div>

          {coupons.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <Gift className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无优惠券</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`rounded-2xl glass-morphism border p-6 ${
                    coupon.enabled
                      ? "border-[#9D4EDD]/50 bg-[#9D4EDD]/10"
                      : "border-white/10 bg-white/5 opacity-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-5 h-5 text-[#9D4EDD]" />
                        <span className="font-semibold text-white">{coupon.name}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">
                          {roleLabels[coupon.targetRole]}
                        </span>
                      </div>
                      <div className="text-2xl font-semibold text-[#FF6B9D] mb-1">
                        {coupon.type === "cash" ? `¥${coupon.value}` : `${coupon.value}%`}
                      </div>
                      <div className="text-sm text-white/60">
                        满¥{coupon.minAmount}可用
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggle(coupon.id)}
                    >
                      {coupon.enabled ? "启用" : "禁用"}
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-white/60">
                      <span>发放数量</span>
                      <span>{coupon.totalCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/60">
                      <span>已使用</span>
                      <span>{coupon.usedCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-white/60">
                      <span>有效期</span>
                      <span>
                        {coupon.validDate.from.toLocaleDateString()} - {coupon.validDate.to.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

