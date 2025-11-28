import { useState } from "react";
import { motion } from "motion/react";
import { Settings, Users, ToggleLeft, ToggleRight, Percent, Target } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";

const grayReleaseSchema = z.object({
  featureName: z.string().min(1, "请输入功能名称"),
  description: z.string().min(1, "请输入功能描述"),
  releasePercent: z.coerce.number().min(0).max(100),
  targetUsers: z.enum(["all", "new", "vip"]),
  enabled: z.boolean(),
});

interface GrayFeature {
  id: string;
  name: string;
  description: string;
  releasePercent: number;
  targetUsers: "all" | "new" | "vip";
  enabled: boolean;
  createdAt: string;
}

const mockFeatures: GrayFeature[] = [
  {
    id: "1",
    name: "新支付方式",
    description: "测试新的支付接口",
    releasePercent: 20,
    targetUsers: "new",
    enabled: true,
    createdAt: "2025-03-01",
  },
];

export default function AdminGrayRelease() {
  const [features, setFeatures] = useState<GrayFeature[]>(mockFeatures);
  const [open, setOpen] = useState(false);
  const form = useZodForm(grayReleaseSchema, {
    defaultValues: {
      featureName: "",
      description: "",
      releasePercent: 10,
      targetUsers: "all",
      enabled: false,
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    const newFeature: GrayFeature = {
      id: Date.now().toString(),
      name: values.featureName,
      description: values.description,
      releasePercent: values.releasePercent,
      targetUsers: values.targetUsers,
      enabled: values.enabled,
      createdAt: new Date().toLocaleDateString(),
    };
    setFeatures((prev) => [...prev, newFeature]);
    toast.success("灰度功能已创建");
    setOpen(false);
    form.reset();
  });

  const handleToggle = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
    toast.success("状态已更新");
  };

  const targetUserLabels = {
    all: "全部用户",
    new: "新用户",
    vip: "VIP用户",
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D]">
              灰度发布
            </h2>
            <p className="text-sm text-white/60">
              控制新功能的发布比例，逐步开放给用户
            </p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D] text-white hover:opacity-90"
          >
            <Settings className="w-4 h-4 mr-2" />
            创建灰度功能
          </Button>
        </motion.div>

        {/* 灰度功能列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#9D4EDD] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">灰度功能列表</h3>
          </div>

          {features.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无灰度功能</p>
            </div>
          ) : (
            <div className="space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`rounded-2xl glass-morphism border p-6 ${
                    feature.enabled
                      ? "border-[#9D4EDD]/50 bg-[#9D4EDD]/10"
                      : "border-white/10 bg-white/5 opacity-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-5 h-5 text-[#9D4EDD]" />
                        <span className="font-semibold text-white">{feature.name}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">
                          {targetUserLabels[feature.targetUsers]}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-3">{feature.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-[#FF6B9D]" />
                          <span className="text-white/60">发布比例：</span>
                          <span className="text-white font-semibold">{feature.releasePercent}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#9D4EDD]" />
                          <span className="text-white/60">创建时间：</span>
                          <span className="text-white">{feature.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle(feature.id)}
                      className="ml-4"
                    >
                      {feature.enabled ? (
                        <ToggleRight className="w-10 h-10 text-[#9D4EDD]" />
                      ) : (
                        <ToggleLeft className="w-10 h-10 text-white/40" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* 创建对话框 */}
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl bg-[#0A0F1E]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-[#00D6C2]/10 p-6 w-full max-w-2xl max-h-[calc(100vh-4rem)] space-y-4 overflow-y-auto"
            >
              <h3 className="text-xl font-semibold text-white mb-4">创建灰度功能</h3>
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="featureName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>功能名称</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10" />
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
                        <FormLabel>功能描述</FormLabel>
                        <FormControl>
                          <textarea
                            rows={3}
                            {...field}
                            className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="releasePercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>发布比例（%）</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="bg-white/5 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetUsers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>目标用户</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full bg-white/5 border-white/10 rounded-md p-2">
                              <option value="all">全部用户</option>
                              <option value="new">新用户</option>
                              <option value="vip">VIP用户</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      className="flex-1"
                    >
                      取消
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D] text-white hover:opacity-90"
                    >
                      创建
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

