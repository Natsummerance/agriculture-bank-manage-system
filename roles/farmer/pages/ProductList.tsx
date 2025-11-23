import { useState } from "react";
import { motion } from "motion/react";
import { BarChart3, Package, Plus } from "lucide-react";
import { useFarmerProductStore } from "../../../stores/farmerProductStore";
import { SearchBar, FilterPanel, RichTextEditor } from "../../../components/common";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(1, "请输入商品名称"),
  category: z.string().min(1, "请输入类别"),
  price: z.coerce.number().positive("价格必须大于0"),
  stock: z.coerce.number().int().nonnegative("库存不能为负"),
  origin: z.string().min(1, "请输入产地"),
  description: z.string().optional(),
});

export default function FarmerProductList() {
  const { products, addProduct, toggleStatus } = useFarmerProductStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const form = useZodForm(productSchema);

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.origin.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" || p.status === status;
    return matchSearch && matchStatus;
  });

  const onSubmit = form.handleSubmit((values) => {
    addProduct(values);
    toast.success("商品已发布（本地模拟）");
    setOpen(false);
    form.reset();
  });

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              商品中心·在售管理
            </h2>
            <p className="text-xs text-white/60">
              统一管理农场所有在售商品，支持快速上/下架与图文详情编辑。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("trade", "dashboard")}
              className="border-[#18FF74]/30 text-[#18FF74] hover:bg-[#18FF74]/10"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              数据看板
            </Button>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="搜索商品名称或产地..."
            />
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <FilterPanel
            title="状态"
            value={status}
            onChange={setStatus}
            options={[
              { label: "全部", value: "all" },
              { label: "已上架", value: "on" },
              { label: "已下架", value: "off" },
            ]}
            extra={
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">发布商品</Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-950 border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle>发布新商品</DialogTitle>
                    <DialogDescription>
                      填写商品基础信息，后续可在后台进一步完善。
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form className="space-y-4" onSubmit={onSubmit}>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>商品名称</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>类别</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="如：大米 / 水果 / 蔬菜..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>单价（元）</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>库存</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="origin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>产地</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="如：黑龙江五常"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>图文详情</FormLabel>
                            <FormControl>
                              <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" size="sm">
                          发布
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            }
          />
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center"
          >
            <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60 mb-2">暂无商品</p>
            <p className="text-sm text-white/40 mb-6">点击下方按钮发布第一个商品</p>
            <Button
              onClick={() => navigateToSubRoute("trade", "publish")}
              className="bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              发布商品
            </Button>
          </motion.div>
        ) : (
          <div className="mt-4 space-y-3">
            {filtered.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="flex items-center justify-between rounded-2xl glass-morphism border border-white/10 bg-white/5 p-4"
              >
                <div>
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-xs text-white/50 mt-1">
                    类别：{p.category} · 产地：{p.origin}
                  </div>
                  <div className="mt-1 text-sm text-white/70">
                    价格：
                    <span className="text-emerald-400 font-mono">
                      ¥{p.price.toFixed(2)}
                    </span>{" "}
                    · 库存：{p.stock}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full border border-white/20 text-white/70">
                    {p.status === "on" ? "已上架" : "已下架"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toggleStatus(p.id);
                      toast.success(
                        p.status === "on" ? "已下架" : "已上架",
                      );
                    }}
                  >
                    {p.status === "on" ? "下架" : "上架"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

