import { useState } from "react";
import { motion } from "motion/react";
import { 
  DollarSign,
  Package,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Calendar
} from "lucide-react";
import { useBankProductStore } from "../../../stores/bankProductStore";
import { StatsCard } from "../../../components/common/StatsCard";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const productSchema = z.object({
  name: z.string().min(1, "请输入产品名称"),
  rate: z.coerce.number().positive("利率必须大于0"),
  minAmount: z.coerce.number().positive("最小金额必须大于0"),
  maxAmount: z.coerce.number().positive("最大金额必须大于0"),
  termMonths: z.coerce.number().int().positive("期限必须为正整数"),
});

export default function BankFinancePanel() {
  const { products, addProduct, updateProduct, removeProduct } = useBankProductStore();
  const [activeTab, setActiveTab] = useState<"products" | "create">("products");
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const form = useZodForm(productSchema);

  const stats = {
    totalProducts: products.length,
    totalLoans: 0, // TODO: 从融资数据统计
    totalAmount: products.reduce((sum, p) => sum + p.maxAmount, 0),
    avgRate: products.length > 0 
      ? (products.reduce((sum, p) => sum + p.rate, 0) / products.length).toFixed(2)
      : "0.00",
  };

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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF8C00]">
              资本审批·产品中心
            </h2>
            <p className="text-sm text-white/60">
              管理贷款产品配置，设置利率、期限、额度区间。
            </p>
          </div>
          <Button
            onClick={() => setActiveTab("create")}
            className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            新增产品
          </Button>
        </motion.div>

        {/* 统计卡片 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">产品概览</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<Package className="w-6 h-6 text-[#00D6C2]" />}
              title="产品总数"
              value={stats.totalProducts.toString()}
              subtitle="在售贷款产品"
            />
            <StatsCard
              icon={<DollarSign className="w-6 h-6 text-[#18FF74]" />}
              title="总授信额度"
              value={`¥${(stats.totalAmount / 10000).toFixed(0)}万`}
              subtitle="所有产品最大额度"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-amber-400" />}
              title="平均利率"
              value={`${stats.avgRate}%`}
              subtitle="所有产品平均年化利率"
            />
            <StatsCard
              icon={<DollarSign className="w-6 h-6 text-emerald-400" />}
              title="累计放款"
              value="0笔"
              subtitle="TODO: 接入真实数据"
            />
          </div>
        </motion.section>

        {/* 产品列表 */}
        {activeTab === "products" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#FFD700] to-[#FF8C00] rounded-full" />
              <h3 className="text-lg">贷款产品列表</h3>
            </div>
            {products.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/60 mb-2">暂无贷款产品</p>
                <Button
                  onClick={() => setActiveTab("create")}
                  className="mt-4 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  创建第一个产品
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-[#00D6C2]" />
                        <div className="text-xl font-semibold text-white">{product.name}</div>
                      </div>
                      <div className="text-sm text-white/60 space-y-1">
                        <div>利率：{product.rate}% / 年</div>
                        <div>
                          额度：¥{product.minAmount.toLocaleString()} - ¥{product.maxAmount.toLocaleString()}
                        </div>
                        <div>期限：{product.termMonths} 个月</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProduct(product.id);
                          form.reset({
                            name: product.name,
                            rate: product.rate,
                            minAmount: product.minAmount,
                            maxAmount: product.maxAmount,
                            termMonths: product.termMonths,
                          });
                          setActiveTab("create");
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(`确定要删除产品"${product.name}"吗？`)) {
                            removeProduct(product.id);
                            toast.success("已删除产品");
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* 创建/编辑产品 */}
        {activeTab === "create" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#FFD700] to-[#FF8C00] rounded-full" />
                <h3 className="text-lg">{editingProduct ? "编辑贷款产品" : "创建贷款产品"}</h3>
              </div>
              <Button
                onClick={() => {
                  setActiveTab("products");
                  setEditingProduct(null);
                  form.reset();
                }}
                variant="outline"
                size="sm"
              >
                返回产品列表
              </Button>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => {
                  if (editingProduct) {
                    updateProduct(editingProduct, values);
                    toast.success("产品已更新");
                  } else {
                    addProduct(values);
                    toast.success("贷款产品已创建");
                  }
                  setActiveTab("products");
                  setEditingProduct(null);
                  form.reset();
                })}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>产品名称</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white/5 border-white/10" placeholder="如：农业生产贷" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>年利率（%）</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} className="bg-white/5 border-white/10" placeholder="如：3.85" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="termMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>期限（月）</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-white/5 border-white/10" placeholder="如：12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>最小金额（元）</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-white/5 border-white/10" placeholder="如：100000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>最大金额（元）</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="bg-white/5 border-white/10" placeholder="如：5000000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {editingProduct ? "更新产品" : "创建产品"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setActiveTab("products");
                      setEditingProduct(null);
                      form.reset();
                    }}
                  >
                    取消
                  </Button>
                </div>
              </form>
            </Form>
          </motion.section>
        )}
      </div>
    </div>
  );
}

