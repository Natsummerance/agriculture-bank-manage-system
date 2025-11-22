import { useState } from "react";
import { motion } from "motion/react";
import { DollarSign, MessageSquare, Calendar, Video, Save } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";

const priceSchema = z.object({
  qaPrice: z.coerce.number().min(0, "价格不能为负"),
  appointmentPrice: z.coerce.number().min(0, "价格不能为负"),
  videoPrice: z.coerce.number().min(0, "价格不能为负").optional(),
});

export default function ExpertServicePrice() {
  const form = useZodForm(priceSchema, {
    defaultValues: {
      qaPrice: 50,
      appointmentPrice: 200,
      videoPrice: 300,
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    toast.success("服务价格已更新");
    // TODO: 调用后端API保存价格
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D]">
              服务价格设置
            </h2>
            <p className="text-sm text-white/60">
              设置你的服务收费标准
            </p>
          </div>
        </motion.div>

        {/* 价格设置表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-[#A78BFA]" />
            <h3 className="text-lg">服务价格</h3>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="qaPrice"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 mb-2">
                      <MessageSquare className="w-5 h-5 text-[#A78BFA]" />
                      <FormLabel className="text-lg">问答服务价格</FormLabel>
                    </div>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60">¥</span>
                        <Input
                          type="number"
                          {...field}
                          className="bg-white/5 border-white/10 text-lg"
                          placeholder="50"
                        />
                        <span className="text-white/60">/ 次</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-white/40 mt-1">农户提问并采纳你的回答后获得</p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentPrice"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-[#FF6B9D]" />
                      <FormLabel className="text-lg">预约咨询价格</FormLabel>
                    </div>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60">¥</span>
                        <Input
                          type="number"
                          {...field}
                          className="bg-white/5 border-white/10 text-lg"
                          placeholder="200"
                        />
                        <span className="text-white/60">/ 次</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-white/40 mt-1">农户预约你的咨询服务后获得</p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoPrice"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 mb-2">
                      <Video className="w-5 h-5 text-emerald-400" />
                      <FormLabel className="text-lg">视频课程价格（可选）</FormLabel>
                    </div>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60">¥</span>
                        <Input
                          type="number"
                          {...field}
                          className="bg-white/5 border-white/10 text-lg"
                          placeholder="300"
                        />
                        <span className="text-white/60">/ 次</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-white/40 mt-1">农户购买你的视频课程后获得</p>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D] text-white hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                保存价格设置
              </Button>
            </form>
          </Form>
        </motion.section>

        {/* 价格说明 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#A78BFA] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">价格说明</h3>
          </div>
          <div className="text-sm text-white/60 space-y-2">
            <p>· 价格设置后，农户在提问或预约时会看到你的收费标准</p>
            <p>· 建议根据你的专业水平和市场行情合理定价</p>
            <p>· 价格可以随时调整，调整后对新订单生效</p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

