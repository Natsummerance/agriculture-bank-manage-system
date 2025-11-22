import { useState } from "react";
import { motion } from "motion/react";
import { MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const feedbackSchema = z.object({
  type: z.string().min(1, "请选择反馈类型"),
  title: z.string().min(1, "请输入标题"),
  content: z.string().min(10, "请至少填写10个字的反馈内容"),
  contact: z.string().optional(),
});

const feedbackTypes = [
  "功能建议",
  " bug 反馈",
  "使用问题",
  "其他",
];

interface FeedbackItem {
  id: string;
  type: string;
  title: string;
  content: string;
  status: "pending" | "processing" | "resolved";
  createdAt: string;
}

export default function FarmerFeedback() {
  const form = useZodForm(feedbackSchema);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  const handleSubmit = form.handleSubmit((values) => {
    const newFeedback: FeedbackItem = {
      id: Date.now().toString(),
      type: values.type,
      title: values.title,
      content: values.content,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setFeedbacks((prev) => [newFeedback, ...prev]);
    toast.success("反馈已提交，我们会尽快处理");
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              反馈中心
            </h2>
            <p className="text-sm text-white/60">
              提交你的建议、问题或反馈，帮助我们改进产品
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("profile", "overview")}
          >
            返回
          </Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 提交反馈表单 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-5 h-5 text-[#00D6C2]" />
              <h3 className="text-lg">提交反馈</h3>
            </div>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>反馈类型</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                        >
                          <option value="">请选择反馈类型</option>
                          {feedbackTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
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
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>标题</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入反馈标题" {...field} />
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
                      <FormLabel>反馈内容</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="请详细描述你的反馈内容..."
                          rows={6}
                          {...field}
                          className="bg-white/5 border-white/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>联系方式（可选）</FormLabel>
                      <FormControl>
                        <Input placeholder="手机号或邮箱" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  提交反馈
                </Button>
              </form>
            </Form>
          </motion.section>

          {/* 反馈历史 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">我的反馈</h3>
            </div>
            {feedbacks.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/60">暂无反馈记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {feedbacks.map((feedback) => (
                  <motion.div
                    key={feedback.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">{feedback.type}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          feedback.status === "resolved"
                            ? "text-emerald-400 bg-emerald-400/20"
                            : feedback.status === "processing"
                            ? "text-blue-400 bg-blue-400/20"
                            : "text-amber-400 bg-amber-400/20"
                        }`}
                      >
                        {feedback.status === "resolved"
                          ? "已解决"
                          : feedback.status === "processing"
                          ? "处理中"
                          : "待处理"}
                      </span>
                    </div>
                    <div className="font-semibold text-white">{feedback.title}</div>
                    <div className="text-sm text-white/70 line-clamp-2">{feedback.content}</div>
                    <div className="text-xs text-white/50">
                      {new Date(feedback.createdAt).toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
