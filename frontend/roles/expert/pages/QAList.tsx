import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MessageSquare, User, Clock, CheckCircle2, DollarSign } from "lucide-react";
import { useExpertQAStore } from "../../../stores/expertQAStore";
import { useExpertIncomeStore } from "../../../stores/expertIncomeStore";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
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
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const answerSchema = z.object({
  answer: z.string().min(5, "请至少填写 5 个字的回答内容"),
});

const mockQuestions = [
  {
    id: "q1",
    title: "水稻纹枯病高发，如何防治？",
    content: "最近田里水稻纹枯病挺严重，用了常规药效果一般，有没有更好的综合方案？",
    farmerName: "张农户",
    reward: 50,
    createdAt: "2025-03-01 09:00",
    status: "pending" as const,
  },
  {
    id: "q2",
    title: "柑橘裂果原因是什么？",
    content: "赣南脐橙裂果比较多，想知道主要原因以及如何预防。",
    farmerName: "李果农",
    reward: 30,
    createdAt: "2025-03-01 11:30",
    status: "pending" as const,
  },
];

export default function ExpertQAList() {
  const { questions, setQuestions, answerQuestion, acceptAnswer } = useExpertQAStore();
  const { addQaEarning } = useExpertIncomeStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const form = useZodForm(answerSchema);

  useEffect(() => {
    if (questions.length === 0) {
      setQuestions(mockQuestions);
    }
  }, [questions.length, setQuestions]);

  const activeQuestion = questions.find((q) => q.id === activeId);

  const handleAnswer = form.handleSubmit((values) => {
    if (!activeQuestion) return;
    answerQuestion(activeQuestion.id, values.answer);
    addQaEarning(activeQuestion.reward);
    toast.success(`已回答问题，获得 ¥${activeQuestion.reward} 奖励`);
    setActiveId(null);
    form.reset();
  });

  const pendingCount = questions.filter((q) => q.status === "pending").length;

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
              问答中心
            </h2>
            <p className="text-sm text-white/60">
              回答农户问题，分享专业知识，获得奖励
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="text-sm px-3 py-1 rounded-full bg-[#FF6B9D]/20 text-[#FF6B9D]">
              {pendingCount} 个待回答
            </div>
          )}
        </motion.div>

        {/* 问题列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#A78BFA] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">待回答问题</h3>
          </div>

          {questions.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无待回答问题</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, index) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <MessageSquare className="w-5 h-5 text-[#A78BFA]" />
                        <h4 className="text-lg font-semibold text-white">{q.title}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-[#FF6B9D]/20 text-[#FF6B9D] flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          悬赏 ¥{q.reward}
                        </span>
                      </div>
                      <div className="text-white/80 mb-3">{q.content}</div>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {q.farmerName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {q.createdAt}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            q.status === "pending"
                              ? "bg-amber-400/20 text-amber-400"
                              : q.status === "answered"
                              ? "bg-blue-400/20 text-blue-400"
                              : "bg-emerald-400/20 text-emerald-400"
                          }`}
                        >
                          {q.status === "pending"
                            ? "待回答"
                            : q.status === "answered"
                            ? "已回答，待采纳"
                            : "已采纳"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {q.status === "pending" && (
                        <Dialog open={activeId === q.id} onOpenChange={(open) => !open && setActiveId(null)}>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => setActiveId(q.id)}
                              className="bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D] text-white hover:opacity-90"
                            >
                              回答
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#0A0F1E] border-white/10 text-white">
                            <DialogHeader>
                              <DialogTitle>回答问题</DialogTitle>
                              <DialogDescription>{q.title}</DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                              <form className="space-y-4" onSubmit={handleAnswer}>
                                <FormField
                                  control={form.control}
                                  name="answer"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>回答内容</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          rows={6}
                                          {...field}
                                          className="bg-white/5 border-white/10"
                                          placeholder="请详细回答农户的问题..."
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <DialogFooter>
                                  <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D] text-white hover:opacity-90"
                                  >
                                    提交回答
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      )}
                      {q.status === "answered" && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            acceptAnswer(q.id);
                            addQaEarning(q.reward);
                            toast.success("回答已被采纳，收益已入账");
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          标记采纳
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateToSubRoute("expert", `qa/detail?id=${q.id}`)}
                      >
                        查看详情
                      </Button>
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
