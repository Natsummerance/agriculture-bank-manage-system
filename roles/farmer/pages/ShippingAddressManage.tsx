import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { ArrowLeft } from "lucide-react";

interface ShippingAddress {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

const addressSchema = z.object({
  name: z.string().min(1, "请输入收货人姓名"),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
  province: z.string().min(1, "请输入省份"),
  city: z.string().min(1, "请输入城市"),
  district: z.string().min(1, "请输入区县"),
  detail: z.string().min(1, "请输入详细地址"),
});

const mockAddresses: ShippingAddress[] = [
  {
    id: "1",
    name: "张农户",
    phone: "13800138000",
    province: "黑龙江省",
    city: "哈尔滨市",
    district: "五常市",
    detail: "五常镇农业园区1号",
    isDefault: true,
  },
];

export default function ShippingAddressManage() {
  const [addresses, setAddresses] = useState<ShippingAddress[]>(mockAddresses);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const form = useZodForm(addressSchema);

  const handleSubmit = form.handleSubmit((values) => {
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...values } : a))
      );
      toast.success("地址已更新");
    } else {
      const newAddress: ShippingAddress = {
        id: Date.now().toString(),
        ...values,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddress]);
      toast.success("地址已添加");
    }
    setOpen(false);
    setEditingId(null);
    form.reset();
  });

  const handleEdit = (address: ShippingAddress) => {
    setEditingId(address.id);
    form.reset({
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail: address.detail,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("地址已删除");
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    toast.success("已设为默认地址");
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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateToSubRoute("profile", "overview")}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
                发货地址管理
              </h2>
              <p className="text-sm text-white/60">
                管理你的发货地址，用于订单发货
              </p>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                新增地址
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0F1E] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>{editingId ? "编辑地址" : "新增地址"}</DialogTitle>
                <DialogDescription>填写发货地址信息</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>收货人姓名</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10" />
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
                        <FormLabel>手机号</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/5 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>省份</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white/5 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>城市</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white/5 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>区县</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white/5 border-white/10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="detail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>详细地址</FormLabel>
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
                      className="bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:opacity-90"
                    >
                      保存
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* 地址列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#18FF74] to-[#00D6C2] rounded-full" />
            <h3 className="text-lg">地址列表</h3>
          </div>

          {addresses.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 mb-2">暂无发货地址</p>
              <p className="text-sm text-white/40">添加第一个发货地址</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address, index) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`rounded-2xl glass-morphism border p-6 ${
                    address.isDefault
                      ? "border-[#18FF74]/50 bg-[#18FF74]/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-[#18FF74]" />
                        <span className="font-semibold text-white">{address.name}</span>
                        <span className="text-sm text-white/60">{address.phone}</span>
                        {address.isDefault && (
                          <span className="text-xs px-2 py-1 rounded-full bg-[#18FF74]/20 text-[#18FF74]">
                            默认
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-white/70 pl-8">
                        {address.province} {address.city} {address.district} {address.detail}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!address.isDefault && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetDefault(address.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          设为默认
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(address)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(address.id)}
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

