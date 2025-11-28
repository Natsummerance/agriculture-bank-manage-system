import { motion } from "motion/react";
import { useState } from "react";
import {
  User,
  TrendingUp,
  Award,
  MapPin,
  Settings,
  Shield,
  Bell,
  CreditCard,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { 
  EditProfileDialog, 
  NotificationSettingsDialog, 
  WalletDialog, 
  PrivacySettingsDialog 
} from "./profile/ProfileSettingsDialogs";
import { AddressDialog, Address } from "./profile/AddressDialog";
import { RoleSpecificProfile } from "./profile/RoleSpecificProfile";
import { useRole } from "../contexts/RoleContext";

const defaultUserMeta = {
  level: "VIP会员",
  contribution: 8850,
  certifications: ["有机认证", "绿色食品", "地理标志"],
};

const stats = [
  { label: "融资额度", value: "50万", icon: CreditCard, color: "#00D6C2" },
  { label: "交易订单", value: "156", icon: TrendingUp, color: "#18FF74" },
  { label: "信用评分", value: "98", icon: Award, color: "#FFD700" },
  { label: "专家咨询", value: "23", icon: User, color: "#FF2566" },
];

const radarData = [
  { label: "交易活跃度", value: 85, max: 100 },
  { label: "信用评分", value: 98, max: 100 },
  { label: "产品质量", value: 92, max: 100 },
  { label: "服务响应", value: 88, max: 100 },
  { label: "用户评价", value: 95, max: 100 },
  { label: "合规程度", value: 100, max: 100 },
];

const recentActivities = [
  { id: 1, type: "finance", desc: "农业生产贷申请已通过", time: "2小时前", status: "success" },
  { id: 2, type: "trade", desc: "有机蔬菜礼盒订单已发货", time: "5小时前", status: "processing" },
  { id: 3, type: "expert", desc: "与张教授视频咨询已完成", time: "1天前", status: "completed" },
  { id: 4, type: "cert", desc: "有机认证年审通过", time: "2天前", status: "success" },
];

const initialAddresses: Address[] = [
  { id: 1, name: "张三", phone: "138****5678", address: "山东省寿光市洛城街道阳光农场", isDefault: true },
  { id: 2, name: "李四", phone: "139****8765", address: "河北省廊坊市广阳区绿野农场", isDefault: false },
];

export function ProfilePage() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { userProfile, role } = useRole();

  const displayName = userProfile?.name || "未命名用户";
  const displayAvatar =
    userProfile?.avatar ||
    (role === "farmer"
      ? "👨‍🌾"
      : role === "buyer"
      ? "🛒"
      : role === "bank"
      ? "🏦"
      : role === "expert"
      ? "👨‍🔬"
      : role === "admin"
      ? "⚙️"
      : "👤");

  const handleSaveAddress = (address: Address) => {
    if (address.id) {
      // 编辑现有地址
      setAddresses(prev => prev.map(addr => 
        addr.id === address.id ? address : addr
      ));
    } else {
      // 添加新地址
      const newAddress = {
        ...address,
        id: Math.max(...addresses.map(a => a.id || 0), 0) + 1
      };
      setAddresses(prev => [...prev, newAddress]);
    }
    setEditingAddress(null);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressDialogOpen(true);
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    toast.success("地址已删除");
  };

  return (
    <>
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
            我的宇宙·My Universe
          </h2>
          <p className="text-white/60">数字身份·数据驾驶舱</p>
        </motion.div>

        {/* 用户信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-8"
        >
          <div className="flex items-start gap-6">
            {/* NFT 头像 */}
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#00D6C2] to-[#18FF74] p-1">
                <div className="w-full h-full rounded-xl bg-[#121726] flex items-center justify-center text-6xl">
                  {displayAvatar}
                </div>
              </div>
              <motion.div
                className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-xs text-white"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                NFT
              </motion.div>
            </motion.div>

            {/* 用户信息 */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="mb-2">{displayName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#00D6C2]/20 to-[#18FF74]/20 text-[#00D6C2] text-sm">
                      {defaultUserMeta.level}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-white/60">
                      <Award className="w-4 h-4 text-[#FFD700]" />
                      <span>贡献值: {defaultUserMeta.contribution}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditDialogOpen(true)}
                  className="px-4 py-2 rounded-lg border border-[#00D6C2] text-[#00D6C2] flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  编辑资料
                </motion.button>
              </div>

              {/* 认证徽章 */}
              <div className="flex gap-2 mb-4">
                {defaultUserMeta.certifications.map((cert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-3 py-1 rounded-full bg-white/5 border border-[#18FF74]/30 text-sm text-[#18FF74] flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3" />
                    {cert}
                  </motion.div>
                ))}
              </div>

              {/* 快捷操作 */}
              <div className="flex gap-3">
                {[
                  { icon: Bell, label: "消息通知", count: 3, onClick: () => setNotificationDialogOpen(true) },
                  { icon: CreditCard, label: "我的钱包", count: 0, onClick: () => setWalletDialogOpen(true) },
                  { icon: Shield, label: "隐私设置", count: 0, onClick: () => setPrivacyDialogOpen(true) },
                ].map((action, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.onClick}
                    className="relative px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                    {action.count > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF2566] text-xs flex items-center justify-center"
                      >
                        {action.count}
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 数据统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-morphism rounded-xl p-6 text-center"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3" style={{ color: stat.color }} />
              <div className="text-2xl font-mono mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* 数据驾驶舱 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 贡献度雷达图 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-morphism rounded-2xl p-6"
          >
            <h4 className="mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              贡献度雷达
            </h4>

            <div className="relative w-full aspect-square max-w-sm mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* 背景六边形网格 */}
                {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
                  <polygon
                    key={i}
                    points={radarData.map((_, index) => {
                      const angle = (Math.PI * 2 * index) / radarData.length - Math.PI / 2;
                      const x = 100 + Math.cos(angle) * 80 * scale;
                      const y = 100 + Math.sin(angle) * 80 * scale;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="rgba(0, 214, 194, 0.1)"
                    strokeWidth="1"
                  />
                ))}

                {/* 轴线 */}
                {radarData.map((_, index) => {
                  const angle = (Math.PI * 2 * index) / radarData.length - Math.PI / 2;
                  const x = 100 + Math.cos(angle) * 80;
                  const y = 100 + Math.sin(angle) * 80;
                  return (
                    <line
                      key={index}
                      x1="100"
                      y1="100"
                      x2={x}
                      y2={y}
                      stroke="rgba(0, 214, 194, 0.2)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* 数据多边形 */}
                <motion.polygon
                  points={radarData.map((item, index) => {
                    const angle = (Math.PI * 2 * index) / radarData.length - Math.PI / 2;
                    const value = (item.value / item.max) * 80;
                    const x = 100 + Math.cos(angle) * value;
                    const y = 100 + Math.sin(angle) * value;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="rgba(0, 214, 194, 0.2)"
                  stroke="#00D6C2"
                  strokeWidth="2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />

                {/* 数据点 */}
                {radarData.map((item, index) => {
                  const angle = (Math.PI * 2 * index) / radarData.length - Math.PI / 2;
                  const value = (item.value / item.max) * 80;
                  const x = 100 + Math.cos(angle) * value;
                  const y = 100 + Math.sin(angle) * value;
                  return (
                    <motion.circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#18FF74"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    />
                  );
                })}
              </svg>

              {/* 标签 */}
              <div className="absolute inset-0">
                {radarData.map((item, index) => {
                  const angle = (Math.PI * 2 * index) / radarData.length - Math.PI / 2;
                  const x = 50 + Math.cos(angle) * 55;
                  const y = 50 + Math.sin(angle) * 55;
                  return (
                    <div
                      key={index}
                      className="absolute text-xs text-white/80 whitespace-nowrap"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {item.label}
                      <div className="text-[#00D6C2] font-mono text-center">{item.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* 最近活动 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-morphism rounded-2xl p-6"
          >
            <h4 className="mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              最近活动
            </h4>

            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.status === 'success' ? 'bg-[#18FF74]/20' :
                    activity.status === 'processing' ? 'bg-[#00D6C2]/20' :
                    'bg-white/20'
                  }`}>
                    {activity.type === 'finance' ? '💰' :
                     activity.type === 'trade' ? '🛒' :
                     activity.type === 'expert' ? '👨‍🏫' : '🏆'}
                  </div>
                  <div className="flex-1">
                    <div className="text-white/90 mb-1">{activity.desc}</div>
                    <div className="text-xs text-white/40">{activity.time}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-[#18FF74]' :
                    activity.status === 'processing' ? 'bg-[#00D6C2]' :
                    'bg-white/40'
                  }`} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 地址管理 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              收货地址
            </h4>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingAddress(null);
                setAddressDialogOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加地址
            </motion.button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((addr, i) => (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -2 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10 relative"
              >
                {addr.isDefault && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-xs text-white">
                    默认
                  </div>
                )}
                
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-[#00D6C2] flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white">{addr.name}</span>
                      <span className="text-white/60 text-sm">{addr.phone}</span>
                    </div>
                    <div className="text-sm text-white/60">{addr.address}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEditAddress(addr)}
                    className="flex items-center gap-1 text-xs text-[#00D6C2] hover:underline"
                  >
                    <Edit className="w-3 h-3" />
                    编辑
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addr.id && handleDeleteAddress(addr.id)}
                    className="flex items-center gap-1 text-xs text-white/60 hover:text-[#FF2566]"
                  >
                    <Trash2 className="w-3 h-3" />
                    删除
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 角色特定配置 */}
        <RoleSpecificProfile />
      </div>

      {/* 设置对话框 */}
      <EditProfileDialog isOpen={editDialogOpen} onClose={() => setEditDialogOpen(false)} />
      <NotificationSettingsDialog isOpen={notificationDialogOpen} onClose={() => setNotificationDialogOpen(false)} />
      <WalletDialog isOpen={walletDialogOpen} onClose={() => setWalletDialogOpen(false)} />
      <PrivacySettingsDialog isOpen={privacyDialogOpen} onClose={() => setPrivacyDialogOpen(false)} />
      <AddressDialog 
        isOpen={addressDialogOpen} 
        onClose={() => {
          setAddressDialogOpen(false);
          setEditingAddress(null);
        }}
        address={editingAddress}
        onSave={handleSaveAddress}
      />
    </div>
    </>
  );
}