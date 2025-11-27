import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, MapPin, User, Phone, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface AddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  address?: Address | null;
  onSave: (address: Address) => void;
}

export interface Address {
  id?: number;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export function AddressDialog({ isOpen, onClose, address, onSave }: AddressDialogProps) {
  const [formData, setFormData] = useState<Address>(
    address || {
      name: "",
      phone: "",
      address: "",
      isDefault: false,
    }
  );

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("请填写完整信息");
      return;
    }

    // 验证手机号
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("请输入正确的手机号");
      return;
    }

    onSave(formData);
    toast.success(address ? "地址更新成功" : "地址添加成功");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0A0F1E]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-[#00D6C2]/10"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#00D6C2]" />
                {address ? "编辑地址" : "添加地址"}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* 表单 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white/80 mb-2 block">
                  收货人 *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入收货人姓名"
                    className="bg-white/5 border-white/10 pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-white/80 mb-2 block">
                  手机号 *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="请输入手机号"
                    maxLength={11}
                    className="bg-white/5 border-white/10 pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-white/80 mb-2 block">
                  详细地址 *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="省市区街道门牌号等"
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#00D6C2]/50 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-white/90">设为默认地址</span>
                <Switch
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-3 rounded-lg border border-white/10 text-white/80 hover:bg-white/5"
              >
                取消
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
