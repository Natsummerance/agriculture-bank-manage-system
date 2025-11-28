import { motion } from "motion/react";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { useRole } from "../../../contexts/RoleContext";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const profileSchema = z.object({
  name: z.string().min(1, "请输入姓名"),
  email: z.string().email("请输入有效的邮箱地址").optional(),
  phone: z.string().min(11, "请输入11位手机号").optional(),
  address: z.string().optional(),
  bio: z.string().max(200, "个人简介不能超过200字").optional(),
});

export default function BuyerProfileEdit() {
  const { userProfile, setUserProfile } = useRole();
  const form = useZodForm(profileSchema, {
    defaultValues: {
      name: userProfile?.name || "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "",
      address: "",
      bio: "",
    },
  });

  const handleSave = form.handleSubmit((values) => {
    setUserProfile({
      ...userProfile!,
      ...values,
    });
    toast.success("资料已保存");
    navigateToSubRoute("profile", "overview");
  });

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
              编辑资料
            </h2>
            <p className="text-sm text-white/60">更新你的个人信息和联系方式</p>
          </div>
          <Button variant="outline" onClick={() => navigateToSubRoute("profile", "overview")}>
            返回
          </Button>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-8 space-y-6"
        >
          <Form {...form}>
            <form onSubmit={handleSave} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      姓名
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="请输入姓名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      邮箱
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="请输入邮箱地址" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      手机号
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="请输入11位手机号" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      地址
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="请输入地址" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>个人简介</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="请输入个人简介（最多200字）"
                        {...field}
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                >
                  保存修改
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigateToSubRoute("profile", "overview")}
                >
                  取消
                </Button>
              </div>
            </form>
          </Form>
        </motion.section>
      </div>
    </div>
  );
}

