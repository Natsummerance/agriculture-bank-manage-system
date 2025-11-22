import { useState } from "react";
import { motion } from "motion/react";
import { Settings, Save, RefreshCw, Database, Bell, Shield } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const configSchema = z.object({
  siteName: z.string().min(1, "请输入站点名称"),
  maintenanceMode: z.boolean(),
  maxUploadSize: z.coerce.number().positive(),
  smsEnabled: z.boolean(),
  emailEnabled: z.boolean(),
});

export default function AdminSystemConfig() {
  const form = useZodForm(configSchema, {
    defaultValues: {
      siteName: "AgriVerse 农业产品融销平台",
      maintenanceMode: false,
      maxUploadSize: 10,
      smsEnabled: true,
      emailEnabled: true,
    },
  });

  const handleSave = form.handleSubmit((values) => {
    toast.success("系统配置已保存");
    // TODO: 调用后端API保存配置
  });

  const handleClearCache = () => {
    toast.success("缓存已清理");
    // TODO: 调用后端API清理缓存
  };

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
              系统配置
            </h2>
            <p className="text-sm text-white/60">
              管理系统基本设置和功能开关
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("profile", "overview")}
          >
            返回
          </Button>
        </motion.div>

        {/* 配置表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-8 space-y-6"
        >
          <Form {...form}>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-[#00D6C2]" />
                <h3 className="text-lg">基本设置</h3>
              </div>

              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>站点名称</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入站点名称" {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxUploadSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最大上传文件大小（MB）</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} className="bg-white/5 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3 mb-4 pt-4 border-t border-white/10">
                <Shield className="w-5 h-5 text-[#18FF74]" />
                <h3 className="text-lg">功能开关</h3>
              </div>

              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>维护模式</FormLabel>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 rounded border-white/30"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smsEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      SMS短信服务
                    </FormLabel>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 rounded border-white/30"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>邮件服务</FormLabel>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 rounded border-white/30"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存配置
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearCache}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  清理缓存
                </Button>
              </div>
            </form>
          </Form>
        </motion.section>
      </div>
    </div>
  );
}

