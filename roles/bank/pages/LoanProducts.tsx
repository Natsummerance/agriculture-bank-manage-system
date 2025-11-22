import { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, Plus, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { useBankProductStore } from "../../../stores/bankProductStore";
import { Button } from "../../../components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
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
import * as React from "react";

const productSchema = z.object({
  name: z.string().min(1, "请输入产品名称"),
  rate: z.coerce.number().positive("利率必须大于0"),
  minAmount: z.coerce.number().positive("最小金额必须大于0"),
  maxAmount: z.coerce.number().positive("最大金额必须大于0"),
  termMonths: z.coerce.number().int().positive("期限必须为正整数"),
});

export default function BankLoanProducts() {
  const { products, addProduct } = useBankProductStore();
  const [open, setOpen] = React.useState(false);
  const form = useZodForm(productSchema);

  const onSubmit = form.handleSubmit((values) => {
    addProduct(values);
    toast.success("贷款产品已创建");
    setOpen(false);
    form.reset();
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF8C00]">
              贷款产品管理
            </h2>
            <p className="text-sm text-white/60">
              配置和管理银行贷款产品，设置利率、额度与期限
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                新建产品
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0F1E] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>新增贷款产品</DialogTitle>
                <DialogDescription>配置利率、额度范围与期限</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form className="space-y-4" onSubmit={onSubmit}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>产品名称</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>年利率（%）</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>最小金额（元）</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>最大金额（元）</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="termMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>期限（月）</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="如：12" {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black hover:opacity-90"
                    >
                      保存
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* 产品列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#FFD700] to-[#FF8C00] rounded-full" />
            <h3 className="text-lg">产品列表</h3>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 mb-2">暂无产品</p>
              <p className="text-sm text-white/40">请先创建贷款产品</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{p.name}</h4>
                        <div className="text-sm text-white/60">产品ID: {p.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-[#FFD700]">{p.rate}%</div>
                      <div className="text-xs text-white/60">年利率</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/80">
                      <DollarSign className="w-4 h-4 text-[#FFD700]" />
                      <span>
                        金额区间：¥{p.minAmount.toLocaleString()} - ¥{p.maxAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="w-4 h-4 text-[#FF8C00]" />
                      <span>期限：{p.termMonths} 个月</span>
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
