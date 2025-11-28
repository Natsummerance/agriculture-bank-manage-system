import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calculator, DollarSign, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { useZodForm } from "../../../hooks/useZodForm";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { toast } from "sonner";

const schema = z.object({
  principal: z.coerce.number().positive("剩余本金必须大于0"),
  rate: z.coerce.number().positive("年利率必须大于0"),
  remainingMonths: z.coerce.number().positive("剩余期数必须大于0"),
});

export default function FinanceEarlyRepay() {
  const form = useZodForm(schema, {
    defaultValues: {
      principal: 100000,
      rate: 5.5,
      remainingMonths: 12,
    },
  });
  const [result, setResult] = useState<{
    penalty: number;
    interestSaved: number;
    totalPayable: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = form.handleSubmit(async (values) => {
    setIsCalculating(true);
    // 模拟计算延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    const { principal, rate, remainingMonths } = values;
    const monthlyRate = rate / 100 / 12;
    const interestRemaining = principal * monthlyRate * remainingMonths;
    const penalty = principal * 0.01; // 假设 1% 补偿金
    const interestSaved = interestRemaining - penalty;
    const totalPayable = principal + penalty;

    setResult({
      penalty,
      interestSaved: Math.max(0, interestSaved),
      totalPayable,
    });
    setIsCalculating(false);
    toast.success("试算完成");
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
              提前还款试算
            </h2>
            <p className="text-sm text-white/60">
              根据当前剩余本金、年利率与剩余期数，模拟提前一次性结清时的补偿金与节省利息
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("finance", "list")}
            className="border-white/20 bg-white/5 hover:bg-white/10"
          >
            返回列表
          </Button>
        </motion.div>

        {/* 试算表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 md:p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-5 h-5 text-[#18FF74]" />
            <h3 className="text-lg">输入参数</h3>
          </div>

          <Form {...form}>
            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="principal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#18FF74]" />
                        剩余本金（元）
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1000"
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder-white/40"
                          placeholder="请输入剩余本金"
                        />
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
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder-white/40"
                          placeholder="如：5.5"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remainingMonths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>剩余期数（月）</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder-white/40"
                          placeholder="如：12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isCalculating}
                className="w-full bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:opacity-90 disabled:opacity-50"
              >
                {isCalculating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full"
                    />
                    计算中...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    开始试算
                  </>
                )}
              </Button>
            </form>
          </Form>
        </motion.section>

        {/* 试算结果 */}
        <AnimatePresence>
          {result && (
            <motion.section
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="rounded-2xl glass-morphism border border-[#00D6C2]/30 bg-gradient-to-br from-[#00D6C2]/10 to-[#18FF74]/10 p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-[#00D6C2]" />
                <h3 className="text-lg">试算结果</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl border border-white/20 bg-white/5 p-4"
                >
                  <div className="text-sm text-white/60 mb-2">提前还款总额</div>
                  <div className="text-2xl font-semibold text-[#18FF74]">
                    ¥{result.totalPayable.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    本金 + 补偿金
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4"
                >
                  <div className="text-sm text-white/60 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    预计补偿金
                  </div>
                  <div className="text-2xl font-semibold text-amber-400">
                    ¥{result.penalty.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    提前还款补偿（1%）
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4"
                >
                  <div className="text-sm text-white/60 mb-2 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                    预计节省利息
                  </div>
                  <div className="text-2xl font-semibold text-emerald-400">
                    ¥{result.interestSaved.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    相比按期还款节省
                  </div>
                </motion.div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                <div className="text-sm text-white/60 mb-2">说明</div>
                <ul className="text-sm text-white/80 space-y-1 list-disc list-inside">
                  <li>以上计算结果仅供参考，具体金额以银行实际测算为准</li>
                  <li>提前还款可能需要支付一定比例的补偿金</li>
                  <li>建议在还款前联系银行确认具体还款金额</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    form.reset();
                  }}
                  className="flex-1 border-white/20 bg-white/5 hover:bg-white/10"
                >
                  重新试算
                </Button>
                <Button
                  onClick={() => {
                    toast.success("已跳转到还款页面");
                    navigateToSubRoute("finance", "repay");
                  }}
                  className="flex-1 bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:opacity-90"
                >
                  前往还款
                </Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* 提示信息 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-morphism border border-amber-400/30 bg-amber-400/10 p-6 flex items-start gap-4"
        >
          <AlertCircle className="w-6 h-6 text-amber-400 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-white mb-2">温馨提示</div>
            <ul className="text-sm text-white/80 space-y-1 list-disc list-inside">
              <li>提前还款试算结果仅供参考，实际金额以银行最终测算为准</li>
              <li>不同银行对提前还款的补偿金政策可能不同</li>
              <li>建议提前联系银行了解具体的提前还款流程和费用</li>
            </ul>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
