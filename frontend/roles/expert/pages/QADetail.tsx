import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { MessageSquare, User, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { useExpertQAStore } from "../../../stores/expertQAStore";
import { useExpertIncomeStore } from "../../../stores/expertIncomeStore";

const answerSchema = z.object({
  answer: z.string().min(5, "请至少填写 5 个字的回答内容"),
});

export default function ExpertQADetail() {
  const { id } = useParams<{ id: string }>();
  const { questions, answerQuestion, acceptAnswer } = useExpertQAStore();
  const { addQaEarning } = useExpertIncomeStore();
  const form = useZodForm(answerSchema);

  const question = questions.find((q) => q.id === id) || {
    id: id || "",
    title: "示例问题",
    content: "这是一个示例问题内容",
    farmerName: "张农户",
    reward: 50,
    createdAt: new Date().toISOString(),
    status: "pending" as const,
    answer: "",
  };

  const handleAnswer = form.handleSubmit((values) => {
    if (!id) return;
    answerQuestion(id, values.answer);
    addQaEarning(question.reward);
    toast.success(`已回答问题，获得 ¥${question.reward} 奖励`);
    navigateToSubRoute("expert", "qa/list");
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
              问答详情
            </h2>
            <p className="text-sm text-white/60">
              查看问题详情并回答
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("expert", "qa/list")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回问答列表
          </Button>
        </motion.div>

        {/* 问题详情 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-[#00D6C2]" />
            <h3 className="text-lg">问题内容</h3>
            <span className="ml-auto text-sm px-2 py-1 rounded-full bg-[#18FF74]/20 text-[#18FF74]">
              悬赏 ¥{question.reward}
            </span>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white mb-3">{question.title}</h4>
            <p className="text-white/80 mb-4">{question.content}</p>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {question.farmerName}
              </div>
              <div>{new Date(question.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </motion.section>

        {/* 回答表单 */}
        {question.status === "pending" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <h3 className="text-lg mb-4">我的回答</h3>
            <Form {...form}>
              <form onSubmit={handleAnswer} className="space-y-4">
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>回答内容</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="请详细回答农户的问题..."
                          rows={8}
                          {...field}
                          className="bg-white/5 border-white/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                >
                  提交回答
                </Button>
              </form>
            </Form>
          </motion.section>
        )}

        {/* 已回答内容 */}
        {question.status === "answered" && question.answer && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl glass-morphism border border-[#00D6C2]/30 bg-[#00D6C2]/10 p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-[#00D6C2]" />
              <h3 className="text-lg">我的回答</h3>
            </div>
            <p className="text-white/90">{question.answer}</p>
          </motion.section>
        )}
      </div>
    </div>
  );
}

