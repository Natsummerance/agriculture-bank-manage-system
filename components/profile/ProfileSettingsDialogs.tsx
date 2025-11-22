import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Camera,
  Save,
  Bell,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Wallet,
  TrendingUp,
  Download,
  Upload
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// 编辑资料对话框
export function EditProfileDialog({ isOpen, onClose }: DialogProps) {
  const [formData, setFormData] = useState({
    name: "张农户",
    phone: "138****5678",
    email: "farmer@agriverse.com",
    location: "山东省寿光市洛城街道",
    bio: "专注有机蔬菜种植，致力于绿色农业发展"
  });

  const handleSave = () => {
    toast.success("资料更新成功！");
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg glass-morphism rounded-2xl p-6"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#00D6C2]" />
                编辑资料
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

            {/* 头像上传 */}
            <div className="flex flex-col items-center mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer"
              >
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00D6C2] to-[#18FF74] p-1">
                  <div className="w-full h-full rounded-xl bg-[#121726] flex items-center justify-center text-5xl">
                    👨‍🌾
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center"
                >
                  <Camera className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>
              <p className="text-sm text-white/60 mt-2">点击更换头像</p>
            </div>

            {/* 表单 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white/80 mb-2 block">姓名</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-white/80 mb-2 block">手机号</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-white/80 mb-2 block">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-white/80 mb-2 block">所在地</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-white/80 mb-2 block">个人简介</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-white/5 border-white/10"
                  rows={3}
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

// 消息通知设置对话框
export function NotificationSettingsDialog({ isOpen, onClose }: DialogProps) {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    expertReplies: true,
    financeApproval: true,
    systemNotice: false,
    promotions: false,
    email: true,
    sms: false,
    push: true
  });

  const handleSave = () => {
    toast.success("通知设置已保存");
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg glass-morphism rounded-2xl p-6"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#00D6C2]" />
                消息通知
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

            {/* 通知类型 */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm text-white/80 mb-4">通知类型</h4>
                <div className="space-y-3">
                  {[
                    { key: 'orderUpdates', label: '订单更新' },
                    { key: 'expertReplies', label: '专家回复' },
                    { key: 'financeApproval', label: '金融审批' },
                    { key: 'systemNotice', label: '系统公告' },
                    { key: 'promotions', label: '营销活动' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-white/80">{item.label}</span>
                      <Switch
                        checked={settings[item.key as keyof typeof settings] as boolean}
                        onCheckedChange={(checked) => setSettings({ ...settings, [item.key]: checked })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm text-white/80 mb-4">通知方式</h4>
                <div className="space-y-3">
                  {[
                    { key: 'push', label: '应用推送', icon: Bell },
                    { key: 'email', label: '邮件通知', icon: Mail },
                    { key: 'sms', label: '短信通知', icon: Phone }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-[#00D6C2]" />
                        <span className="text-white/80">{item.label}</span>
                      </div>
                      <Switch
                        checked={settings[item.key as keyof typeof settings] as boolean}
                        onCheckedChange={(checked) => setSettings({ ...settings, [item.key]: checked })}
                      />
                    </div>
                  ))}
                </div>
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

// 我的钱包对话框
export function WalletDialog({ isOpen, onClose }: DialogProps) {
  const walletData = {
    balance: 12580.50,
    frozen: 0,
    income: 85600,
    expense: 73019.50
  };

  const transactions = [
    { id: 1, type: 'income', desc: '有机蔬菜销售收入', amount: 5800, date: '2025-11-01' },
    { id: 2, type: 'expense', desc: '种子采购支出', amount: -1200, date: '2025-10-28' },
    { id: 3, type: 'income', desc: '政府补贴到账', amount: 3000, date: '2025-10-25' },
    { id: 4, type: 'expense', desc: '设备租赁费用', amount: -800, date: '2025-10-20' }
  ];

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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-morphism rounded-2xl p-6"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#00D6C2]" />
                我的钱包
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

            {/* 余额卡片 */}
            <div className="glass-morphism rounded-xl p-6 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 rounded-full blur-3xl" />
              <div className="relative">
                <div className="text-sm text-white/60 mb-2">账户余额</div>
                <div className="text-4xl font-mono text-white mb-6">
                  ¥ {walletData.balance.toFixed(2)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-white/40 mb-1">累计收入</div>
                    <div className="font-mono text-[#18FF74]">¥ {walletData.income.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">累计支出</div>
                    <div className="font-mono text-[#FF2566]">¥ {walletData.expense.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { 
                  icon: Upload, 
                  label: '充值', 
                  color: '#00D6C2',
                  onClick: () => {
                    const amount = prompt("请输入充值金额（元）:");
                    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                      toast.success(`充值成功！金额：¥${amount}`);
                    } else if (amount) {
                      toast.error("请输入有效金额");
                    }
                  }
                },
                { 
                  icon: Download, 
                  label: '提现', 
                  color: '#18FF74',
                  onClick: () => {
                    const amount = prompt("请输入提现金额（元）:");
                    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
                      toast.success(`提现申请已提交！金额：¥${amount}，预计1-3个工作日到账`);
                    } else if (amount) {
                      toast.error("请输入有效金额");
                    }
                  }
                },
                { 
                  icon: TrendingUp, 
                  label: '账单', 
                  color: '#FFD700',
                  onClick: () => toast.info("正在查看交易账单明细...")
                },
                { 
                  icon: CreditCard, 
                  label: '银行卡', 
                  color: '#FF2566',
                  onClick: () => toast.info("银行卡管理：当前已绑定1张卡片")
                }
              ].map((action, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.onClick}
                  className="p-4 rounded-lg glass-morphism flex flex-col items-center gap-2"
                >
                  <action.icon className="w-6 h-6" style={{ color: action.color }} />
                  <span className="text-sm text-white/80">{action.label}</span>
                </motion.button>
              ))}
            </div>

            {/* 交易记录 */}
            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                交易记录
              </h4>
              <div className="space-y-3">
                {transactions.map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg glass-morphism"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'income' ? 'bg-[#18FF74]/20' : 'bg-[#FF2566]/20'
                      }`}>
                        {tx.type === 'income' ? (
                          <TrendingUp className="w-5 h-5 text-[#18FF74]" />
                        ) : (
                          <Download className="w-5 h-5 text-[#FF2566]" />
                        )}
                      </div>
                      <div>
                        <div className="text-white/90 mb-1">{tx.desc}</div>
                        <div className="text-xs text-white/40">{tx.date}</div>
                      </div>
                    </div>
                    <div className={`font-mono ${
                      tx.type === 'income' ? 'text-[#18FF74]' : 'text-[#FF2566]'
                    }`}>
                      {tx.amount > 0 ? '+' : ''}¥{Math.abs(tx.amount)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 隐私设置对话框
export function PrivacySettingsDialog({ isOpen, onClose }: DialogProps) {
  const [settings, setSettings] = useState({
    profileVisible: true,
    activityVisible: false,
    allowMessages: true,
    showOnlineStatus: true,
    dataCollection: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    toast.success("隐私设置已保存");
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg glass-morphism rounded-2xl p-6"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#00D6C2]" />
                隐私设置
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

            {/* 隐私选项 */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm text-white/80 mb-4">隐私控制</h4>
                <div className="space-y-3">
                  {[
                    { key: 'profileVisible', label: '公开个人资料', desc: '允许其他用户查看你的基本信息' },
                    { key: 'activityVisible', label: '显示活动状态', desc: '显示你的最近活动和动态' },
                    { key: 'allowMessages', label: '接收私信', desc: '允许其他用户给你发送私信' },
                    { key: 'showOnlineStatus', label: '显示在线状态', desc: '让好友知道你是否在线' },
                    { key: 'dataCollection', label: '数据收集', desc: '允许收集匿名使用数据以改进服务' }
                  ].map((item) => (
                    <div key={item.key} className="p-4 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/90">{item.label}</span>
                        <Switch
                          checked={settings[item.key as keyof typeof settings]}
                          onCheckedChange={(checked) => setSettings({ ...settings, [item.key]: checked })}
                        />
                      </div>
                      <p className="text-xs text-white/50">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm text-white/80 mb-4">修改密码</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="oldPassword" className="text-white/80 mb-2 block">当前密码</Label>
                    <div className="relative">
                      <Input
                        id="oldPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="请输入当前密码"
                        className="bg-white/5 border-white/10 pr-10"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-white/80 mb-2 block">新密码</Label>
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="请输入新密码"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast.success("密码修改成功")}
                    className="w-full py-2 rounded-lg border border-[#00D6C2] text-[#00D6C2] hover:bg-[#00D6C2]/10 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    更新密码
                  </motion.button>
                </div>
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
