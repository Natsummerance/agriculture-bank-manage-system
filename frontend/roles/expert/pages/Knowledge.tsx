import { useState } from "react";
import { motion } from "motion/react";
import { FileText, Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const articleSchema = z.object({
  title: z.string().min(1, "请输入标题"),
  summary: z.string().min(10, "请至少填写 10 个字的摘要"),
});

interface Article {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
}

export default function ExpertKnowledge() {
  const form = useZodForm(articleSchema);
  const [articles, setArticles] = useState<Article[]>([]);

  const onSubmit = form.handleSubmit((values) => {
    setArticles((prev) => [
      {
        id: `art_${Date.now()}`,
        title: values.title,
        summary: values.summary,
        createdAt: new Date().toLocaleString(),
      },
      ...prev,
    ]);
    toast.success("文章已发布");
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D]">
              知识中心
            </h2>
            <p className="text-sm text-white/60">
              发布专业文章和知识内容，分享给农户
            </p>
          </div>
          <Button
            onClick={() => navigateToSubRoute("trade", "edit")}
            className="bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D] text-white hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            发布文章
          </Button>
        </motion.div>

        {/* 发布表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-[#A78BFA]" />
            <h3 className="text-lg">快速发布</h3>
          </div>
          <Form {...form}>
            <form className="space-y-4" onSubmit={onSubmit}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>文章标题</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10" placeholder="请输入文章标题" />
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
                        rows={4}
                        {...field}
                        className="bg-white/5 border-white/10"
                        placeholder="请简要描述文章内容..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D] text-white hover:opacity-90"
              >
                发布文章
              </Button>
            </form>
          </Form>
        </motion.section>

        {/* 文章列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#A78BFA] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">我的文章</h3>
            <span className="text-sm text-white/60">共 {articles.length} 篇</span>
          </div>

          {articles.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 mb-2">尚未发布任何文章</p>
              <p className="text-sm text-white/40">发布你的第一篇专业文章吧</p>
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((a, index) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-[#A78BFA]" />
                        <h4 className="text-lg font-semibold text-white">{a.title}</h4>
                      </div>
                      <div className="text-white/70 mb-2">{a.summary}</div>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <CalendarIcon className="w-3 h-3" />
                        {a.createdAt}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToSubRoute("trade", `detail?id=${a.id}`)}
                    >
                      查看详情
                    </Button>
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
