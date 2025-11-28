import { useState } from "react";
import { motion } from "motion/react";
import { Calculator, TrendingUp, Award, AlertTriangle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { StatsCard } from "../../../components/common/StatsCard";

const scoringSchema = z.object({
  creditHistory: z.coerce.number().min(0).max(100),
  income: z.coerce.number().min(0),
  assets: z.coerce.number().min(0),
  debtRatio: z.coerce.number().min(0).max(100),
  industryExperience: z.coerce.number().min(0).max(100),
});

export default function BankScoringCard() {
  const form = useZodForm(scoringSchema);
  const [score, setScore] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high" | null>(null);

  const calculateScore = form.handleSubmit((values) => {
    // 简化的评分算法
    const creditScore = values.creditHistory * 0.3;
    const incomeScore = Math.min(values.income / 10000, 50) * 0.2;
    const assetScore = Math.min(values.assets / 100000, 30) * 0.2;
    const debtScore = (100 - values.debtRatio) * 0.15;
    const experienceScore = values.industryExperience * 0.15;

    const totalScore = creditScore + incomeScore + assetScore + debtScore + experienceScore;
    setScore(Math.round(totalScore));

    if (totalScore >= 80) {
      setRiskLevel("low");
    } else if (totalScore >= 60) {
      setRiskLevel("medium");
    } else {
      setRiskLevel("high");
    }

    toast.success("评分计算完成");
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
              信用评分卡
            </h2>
            <p className="text-sm text-white/60">
              基于多维度指标计算农户信用评分
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("finance", "approval/list")}
          >
            返回审批列表
          </Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 评分表单 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="w-5 h-5 text-[#00D6C2]" />
              <h3 className="text-lg">评分指标</h3>
            </div>
            <Form {...form}>
              <form onSubmit={calculateScore} className="space-y-4">
                <FormField
                  control={form.control}
                  name="creditHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>信用历史（0-100分）</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="请输入信用历史评分" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>年收入（元）</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="请输入年收入" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>资产总额（元）</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="请输入资产总额" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="debtRatio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>负债率（0-100%）</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="请输入负债率" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industryExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>行业经验（0-100分）</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="请输入行业经验评分" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                >
                  计算评分
                </Button>
              </form>
            </Form>
          </motion.section>

          {/* 评分结果 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {score !== null ? (
              <>
                <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 text-center">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74] mb-2">
                    {score}
                  </div>
                  <div className="text-white/60 mb-4">综合信用评分</div>
                  <div
                    className={`inline-block px-4 py-2 rounded-full ${
                      riskLevel === "low"
                        ? "bg-emerald-400/20 text-emerald-400"
                        : riskLevel === "medium"
                        ? "bg-amber-400/20 text-amber-400"
                        : "bg-red-400/20 text-red-400"
                    }`}
                  >
                    {riskLevel === "low"
                      ? "低风险"
                      : riskLevel === "medium"
                      ? "中风险"
                      : "高风险"}
                  </div>
                </div>
                <div className="grid gap-4">
                  <StatsCard
                    icon={<TrendingUp className="w-6 h-6 text-[#00D6C2]" />}
                    title="建议额度"
                    value={`¥${(score * 1000).toLocaleString()}`}
                    subtitle="基于评分推荐"
                  />
                  <StatsCard
                    icon={<Award className="w-6 h-6 text-[#18FF74]" />}
                    title="风险等级"
                    value={riskLevel === "low" ? "低" : riskLevel === "medium" ? "中" : "高"}
                    subtitle="信用评估结果"
                  />
                </div>
              </>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
                <Calculator className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/60">请填写评分指标并计算</p>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}

