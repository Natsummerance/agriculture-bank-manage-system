import { useState } from "react";
import { motion } from "motion/react";
import { FileText, ArrowLeft, Save } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { RichTextEditor } from "../../../components/common/RichTextEditor";

const articleSchema = z.object({
  title: z.string().min(1, "请输入标题"),
  summary: z.string().min(10, "请至少填写 10 个字的摘要"),
  content: z.string().min(50, "请至少填写 50 个字的内容"),
  tags: z.string().optional(),
});

export default function ExpertArticleEdit() {
  const form = useZodForm(articleSchema);
  const [isDraft, setIsDraft] = useState(false);

  const handleSubmit = form.handleSubmit((values) => {
    if (isDraft) {
      toast.success("草稿已保存");
    } else {
      toast.success("文章已发布");
      navigateToSubRoute("expert", "knowledge/list");
    }
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
              发布文章
            </h2>
            <p className="text-sm text-white/60">
              分享你的专业知识和经验
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("expert", "knowledge/list")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <Button
              onClick={() => {
                setIsDraft(true);
                handleSubmit();
              }}
              variant="outline"
            >
              保存草稿
            </Button>
            <Button
              onClick={() => {
                setIsDraft(false);
                handleSubmit();
              }}
              className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-2" />
              发布文章
            </Button>
          </div>
        </motion.div>

        {/* 编辑表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-8 space-y-6"
        >
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      文章标题
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="请输入文章标题" {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>摘要</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="简要描述文章内容..."
                        rows={3}
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
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签（可选，用逗号分隔）</FormLabel>
                    <FormControl>
                      <Input placeholder="如：水稻,病虫害,防治" {...field} className="bg-white/5 border-white/10" />
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
                    <FormLabel>正文内容</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="请输入文章正文内容..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </motion.section>
      </div>
    </div>
  );
}

