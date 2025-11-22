import { motion } from "motion/react";
import { Plus, DollarSign, ShoppingCart, MessageCircle, Eye, TrendingUp, Package, Award } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useFarmerPublish } from "../../../hooks/useFarmerPublish";
import { useFarmerFinance } from "../../../hooks/useFarmerFinance";

const buyerDemands = [
  { id: 1, buyer: "李老板", product: "有机苹果", quantity: "500kg", price: "¥8/kg", time: "2小时前", urgent: true },
  { id: 2, buyer: "王经理", product: "大棚蔬菜", quantity: "1000kg", price: "¥5/kg", time: "5小时前", urgent: false },
  { id: 3, buyer: "张总", product: "优质稻米", quantity: "2000kg", price: "¥6/kg", time: "1天前", urgent: true },
];

const stats = [
  { label: "本月销售额", value: "¥125,600", change: "+23%", color: "#18FF74", icon: TrendingUp },
  { label: "商品上架", value: "12", change: "+3", color: "#00D6C2", icon: Package },
  { label: "待处理订单", value: "8", change: "+2", color: "#FFE600", icon: ShoppingCart },
  { label: "信用评分", value: "98", change: "+5", color: "#FF7A9C", icon: Award },
];

export default function FarmerHomePage() {
  const navigate = useNavigate();
  const { openPublishDialog } = useFarmerPublish();
  const { openFinanceCalc } = useFarmerFinance();

  const handlePublishProduct = () => {
    openPublishDialog();
  };

  const handleApplyFinance = () => {
    openFinanceCalc();
  };

  const handleViewDemand = (demandId: number) => {
    toast.success(`查看需求 #${demandId}`);
  };

  const handleContactBuyer = () => {
    toast.success("联系买家 - 打开IM窗口");
  };

  const handleGoToMarket = () => {
    navigate('/farmer/trade');
  };

  return (
    <div className="pt-24 pb-4 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 欢迎区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
            田心星云·Farmer Universe
          </h2>
          <p className="text-white/60">种植智慧，收获未来</p>
        </motion.div>

        {/* 顶部双FAB按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Button
              onClick={handlePublishProduct}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:opacity-90 shadow-lg flex items-center gap-3"
              style={{ boxShadow: "0 8px 24px rgba(24, 255, 116, 0.4)" }}
            >
              <Plus className="w-6 h-6" />
              发布商品
            </Button>
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <Button
              onClick={handleApplyFinance}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90 shadow-lg flex items-center gap-3"
              style={{ boxShadow: "0 8px 24px rgba(0, 214, 194, 0.4)" }}
            >
              <DollarSign className="w-6 h-6" />
              申请融资
            </Button>
          </motion.div>
        </div>

        {/* 数据统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-morphism rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${stat.color}20`,
                      border: `1px solid ${stat.color}40`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <span
                    className="text-sm px-2 py-1 rounded-full"
                    style={{
                      background: stat.change.startsWith('+') ? '#18FF7420' : '#FF256620',
                      color: stat.change.startsWith('+') ? '#18FF74' : '#FF2566',
                    }}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-mono mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* 买家需求列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-morphism rounded-2xl p-8 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white mb-2">买家需求·实时匹配</h3>
              <p className="text-sm text-white/60">AI智能推荐，精准匹配您的产品</p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-[#18FF74]/20 border border-[#18FF74]/30">
              <span className="text-[#18FF74]">🔥 热门需求</span>
            </div>
          </div>

          <div className="space-y-4">
            {buyerDemands.map((demand, i) => (
              <motion.div
                key={demand.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white">{demand.product}</h4>
                    {demand.urgent && (
                      <span className="px-2 py-1 rounded-full bg-[#FF2566]/20 text-[#FF2566] text-xs">
                        紧急
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span>买家: {demand.buyer}</span>
                    <span>·</span>
                    <span>数量: {demand.quantity}</span>
                    <span>·</span>
                    <span className="text-[#18FF74]">{demand.price}</span>
                    <span>·</span>
                    <span>{demand.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleViewDemand(demand.id)}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white/80 hover:bg-white/10"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    查看
                  </Button>
                  <Button
                    onClick={handleContactBuyer}
                    size="sm"
                    className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    联系
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 查看更多按钮 */}
          <div className="mt-6 text-center">
            <Button
              onClick={handleGoToMarket}
              variant="outline"
              className="px-8 border-[#18FF74]/40 text-[#18FF74] hover:bg-[#18FF74]/10"
            >
              查看更多需求 →
            </Button>
          </div>
        </motion.div>

        {/* 底部主按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleGoToMarket}
            className="h-16 px-12 rounded-2xl bg-gradient-to-r from-[#18FF74] via-[#00D6C2] to-[#18FF74] bg-[length:200%_100%] text-black hover:bg-[position:100%_0] shadow-lg text-lg"
            style={{ 
              boxShadow: "0 12px 32px rgba(24, 255, 116, 0.5)",
              animation: "shimmer 3s linear infinite"
            }}
          >
            <ShoppingCart className="w-6 h-6 mr-3" />
            前往田心市场
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
