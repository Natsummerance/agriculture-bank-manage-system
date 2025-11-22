import { motion } from "motion/react";
import { ClipboardList } from "lucide-react";
import { z } from "zod";
import { useZodForm } from "../../../hooks/useZodForm";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

const demandSchema = z.object({
  title: z.string().min(3, "请输入至少 3 个字的标题"),
  quantity: z.string().min(1, "请输入采购数量"),
  budget: z.string().optional(),
  location: z.string().min(2, "请输入发货/到货区域"),
  description: z.string().min(10, "请详细描述你的采购需求，至少 10 个字"),
});

export default function BuyerDemand() {
  const form = useZodForm(demandSchema);

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D6C2]/40 to-[#18FF74]/20 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-[#18FF74]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
              发布求购
            </h2>
            <p className="text-xs text-white/60">
              将你的采购需求广播给平台农户，后续可在此基础上接入报价与撮合逻辑（当前为前端占位）。
            </p>
          </div>
        </motion.div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((values) => {
                console.log("mock demand submit", values);
                toast.success("已提交求购需求（前端模拟），后续可接入真实撮合接口");
                form.reset();
              })}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>需求标题</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：长期采购东北稻花香大米" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>采购数量</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：20 吨 / 月" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>预算（选填）</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：不高于 5000 元 / 吨" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>到货/发货区域</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：上海 / 华东区域" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>详细需求说明</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="请尽可能详细说明品类、质量标准、交货周期等，为后续智能撮合打好基础。"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2 flex justify-end">
                <Button type="submit" className="px-6">
                  提交求购
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

