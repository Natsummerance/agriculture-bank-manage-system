import { useState } from "react";
import { motion } from "motion/react";
import { MessageCircle, DollarSign, Send, Image as ImageIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";

const questionSchema = z.object({
  title: z.string().min(5, "请至少输入5个字的标题"),
  content: z.string().min(10, "请至少输入10个字的问题描述"),
  reward: z.coerce.number().min(0, "悬赏金额不能为负").optional(),
  expertId: z.string().optional(),
});

export default function QuestionAsk() {
  const form = useZodForm(questionSchema, {
    defaultValues: {
      title: "",
      content: "",
      reward: 0,
      expertId: "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    toast.success("问题已提交，等待专家回答");
    form.reset();
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
              提问专家
            </h2>
            <p className="text-sm text-white/60">
              向专家提问，获取专业指导
            </p>
          </div>
        </motion.div>

        {/* 提问表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-5 h-5 text-[#18FF74]" />
            <h3 className="text-lg">问题信息</h3>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>问题标题</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10" placeholder="简要描述你的问题" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>问题描述</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        {...field}
                        className="bg-white/5 border-white/10"
                        placeholder="详细描述你的问题，包括具体情况、遇到的问题等..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#00D6C2]" />
                      悬赏金额（可选）
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60">¥</span>
                        <Input
                          type="number"
                          {...field}
                          className="bg-white/5 border-white/10"
                          placeholder="0"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-white/40 mt-1">设置悬赏金额可以提高问题被回答的优先级</p>
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  上传图片
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:opacity-90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  提交问题
                </Button>
              </div>
            </form>
          </Form>
        </motion.section>
      </div>
    </div>
  );
}

