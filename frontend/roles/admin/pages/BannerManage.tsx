import { useState } from "react";
import { motion } from "motion/react";
import { Image as ImageIcon, Plus, Edit2, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
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
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  order: number;
  enabled: boolean;
}

const bannerSchema = z.object({
  title: z.string().min(1, "请输入标题"),
  image: z.string().url("请输入有效的图片URL"),
  link: z.string().url("请输入有效的链接URL").optional(),
});

const mockBanners: Banner[] = [
  {
    id: "1",
    title: "春季农产品大促销",
    image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg",
    link: "/trade/products",
    order: 1,
    enabled: true,
  },
  {
    id: "2",
    title: "新用户注册送优惠券",
    image: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg",
    link: "/register",
    order: 2,
    enabled: true,
  },
];

export default function AdminBannerManage() {
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const form = useZodForm(bannerSchema);

  const handleSubmit = form.handleSubmit((values) => {
    if (editingId) {
      setBanners((prev) =>
        prev.map((b) => (b.id === editingId ? { ...b, ...values } : b))
      );
      toast.success("轮播图已更新");
    } else {
      const newBanner: Banner = {
        id: Date.now().toString(),
        ...values,
        order: banners.length + 1,
        enabled: true,
      };
      setBanners((prev) => [...prev, newBanner]);
      toast.success("轮播图已添加");
    }
    setOpen(false);
    setEditingId(null);
    form.reset();
  });

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id);
    form.reset({
      title: banner.title,
      image: banner.image,
      link: banner.link,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    toast.success("轮播图已删除");
  };

  const handleToggle = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
    toast.success("状态已更新");
  };

  const handleMove = (id: string, direction: "up" | "down") => {
    const index = banners.findIndex((b) => b.id === id);
    if (direction === "up" && index > 0) {
      const newBanners = [...banners];
      [newBanners[index - 1], newBanners[index]] = [newBanners[index], newBanners[index - 1]];
      setBanners(newBanners);
    } else if (direction === "down" && index < banners.length - 1) {
      const newBanners = [...banners];
      [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
      setBanners(newBanners);
    }
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
              首页轮播图管理
            </h2>
            <p className="text-sm text-white/60">
              管理首页轮播图，设置展示顺序和链接
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D] text-white hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                新增轮播图
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0F1E] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>{editingId ? "编辑轮播图" : "新增轮播图"}</DialogTitle>
                <DialogDescription>设置轮播图信息</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>标题</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>图片URL</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>跳转链接（可选）</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D] text-white hover:opacity-90"
                    >
                      保存
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* 轮播图列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#9D4EDD] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">轮播图列表</h3>
          </div>

          {banners.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无轮播图</p>
            </div>
          ) : (
            <div className="space-y-3">
              {banners.map((banner, index) => (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-20 rounded-lg overflow-hidden bg-white/5">
                      <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white mb-1">{banner.title}</div>
                      <div className="text-sm text-white/60">{banner.link || "无跳转链接"}</div>
                      <div className="text-xs text-white/40 mt-1">排序：{banner.order}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMove(banner.id, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMove(banner.id, "down")}
                        disabled={index === banners.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggle(banner.id)}
                        className={banner.enabled ? "" : "opacity-50"}
                      >
                        {banner.enabled ? "启用" : "禁用"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(banner)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(banner.id)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

