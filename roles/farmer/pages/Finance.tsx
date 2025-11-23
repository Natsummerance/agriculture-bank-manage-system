import { z } from "zod";
import { motion } from "motion/react";
import { DollarSign, FileText, Calendar, CreditCard, Upload, AlertCircle } from "lucide-react";
import { useZodForm } from "../../../hooks/useZodForm";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { useBankProductStore } from "../../../stores/bankProductStore";
import { FileUploader } from "../../../components/common/FileUploader";
import { useFinancingStore } from "../../../stores/financingStore";
import { useRole } from "../../../contexts/RoleContext";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const financeSchema = z.object({
  amount: z.coerce.number().positive("申请金额必须大于0"),
  term: z.string().min(1, "请输入期限，如12个月"),
  purpose: z.string().min(5, "请至少填写5个字的资金用途"),
  collateral: z.string().optional(),
  repayMethod: z.string().min(1, "请选择还款方式"),
  landProofUrl: z.string().optional(),
});

export default function FarmerFinance() {
  const form = useZodForm(financeSchema);
  const { products } = useBankProductStore();
  const minLoanAmount = products.length ? Math.min(...products.map((p) => p.minAmount)) : 200000;
  const { userProfile } = useRole();
  const { createFromFarmer } = useFinancingStore();

  const handleSubmit = form.handleSubmit((values) => {
    if (values.amount < minLoanAmount) {
      toast.info("申请金额低于银行最低额度，已为你进入智能拼单匹配流程");
      navigateToSubRoute("finance", `match?amount=${values.amount}`);
      return;
    }
    if (!userProfile) {
      toast.error("未找到当前农户信息，请重新登录后再试");
      return;
    }
    try {
      const financing = createFromFarmer({
        farmerId: userProfile.id,
        amount: values.amount,
        termMonths: parseInt(values.term, 10) || 12,
        purpose: values.purpose,
      });
      toast.success("融资申请已提交成功！");
      form.reset();
      navigateToSubRoute("finance", `detail?id=${financing.id}`);
    } catch (error) {
      toast.error("提交失败，请稍后重试");
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
              融资申请
            </h2>
            <p className="text-sm text-white/60">
              填写融资申请信息，系统将自动匹配最适合的银行产品
            </p>
          </div>
        </motion.div>

        {/* 提示信息 */}
        {minLoanAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl glass-morphism border border-amber-400/30 bg-amber-400/10 p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-white/90 font-semibold mb-1">银行最低审批额度</p>
              <p className="text-xs text-white/60">
                当前银行最低审批额度为 ¥{minLoanAmount.toLocaleString()}。如果申请金额低于此额度，系统将自动引导你进入智能拼单匹配流程。
              </p>
            </div>
          </motion.div>
        )}

        {/* 申请表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 md:p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-[#18FF74] to-[#00D6C2] rounded-full" />
            <h3 className="text-lg">基本信息</h3>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#18FF74]" />
                        申请金额（元）
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1000"
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder-white/40"
                          placeholder="请输入申请金额"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#00D6C2]" />
                        期限
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white/5 border-white/10 text-white placeholder-white/40"
                          placeholder="如：12个月"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="repayMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#18FF74]" />
                      还款方式
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder-white/40"
                        placeholder="如：等额本息 / 等额本金 / 按季还息"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#00D6C2]" />
                      资金用途
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder-white/40"
                        placeholder="请详细说明资金用途，如：购买农机设备、扩大种植面积、建设仓储设施等..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                  <Upload className="w-4 h-4 text-[#18FF74]" />
                  地块证明/资产证明
                </label>
                <FileUploader
                  label=""
                  accept=".jpg,.jpeg,.png,.pdf"
                  type="pdf"
                  onUploaded={(file) => {
                    form.setValue("landProofUrl", file.url);
                    toast.success("文件上传成功");
                  }}
                />
                <p className="mt-2 text-xs text-white/40">
                  支持上传地块权属证明、经营权证书等资料，文件大小建议不超过 10MB
                </p>
              </div>

              <FormField
                control={form.control}
                name="collateral"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>抵押物（可选）</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder-white/40"
                        placeholder="如：农业机械、仓储房产等"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="flex-1 border-white/20 bg-white/5 hover:bg-white/10"
                >
                  重置
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:opacity-90"
                >
                  提交申请
                </Button>
              </div>
            </form>
          </Form>
        </motion.section>
      </div>
    </div>
  );
}

