import { motion } from "motion/react";
import { Plus, CreditCard, ShoppingCart, Eye, Heart, TrendingDown, Package, Star } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const hotProducts = [
  { id: 1, name: "有机苹果礼盒", seller: "张农户", price: "¥88", original: "¥128", image: "🍎", rating: 4.9, sales: 1234 },
  { id: 2, name: "大棚草莓", seller: "李农场", price: "¥58", original: "¥78", image: "🍓", rating: 4.8, sales: 890 },
  { id: 3, name: "优质大米5kg", seller: "王合作社", price: "¥38", original: "¥48", image: "🌾", rating: 5.0, sales: 2340 },
];

const stats = [
  { label: "待付款订单", value: "2", change: "+1", color: "#FFE600", icon: ShoppingCart },
  { label: "待收货", value: "5", change: "+2", color: "#00D6C2", icon: Package },
  { label: "我的收藏", value: "45", change: "+8", color: "#FF7A9C", icon: Heart },
  { label: "积分余额", value: "1,280", change: "+120", color: "#18FF74", icon: Star },
];

export function BuyerHome() {
  const handlePublishDemand = () => {
    const event = new CustomEvent('navigate-tab', { detail: { tab: 'demand' } });
    window.dispatchEvent(event);
  };

  const handleInstallment = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-loan-apply'));
  };

  const handleAddToCart = (productId: number) => {
    toast.success(`商品已加入购物车 #${productId}`);
  };

  const handleBuyNow = (productId: number) => {
    toast.success(`立即购买商品 #${productId}`);
    window.dispatchEvent(new CustomEvent('navigate-to-checkout'));
  };

  const handleGoToCheckout = () => {
    const event = new CustomEvent('navigate-tab', { detail: { tab: 'cart' } });
    window.dispatchEvent(event);
  };

  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 欢迎区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FFE600] to-[#00D6C2]">
            购市星云·Buyer Universe
          </h2>
          <p className="text-white/60">智能采购，品质保障</p>
        </motion.div>

        {/* 顶部双FAB按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Button
              onClick={handlePublishDemand}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#FFE600] to-[#00D6C2] text-black hover:opacity-90 shadow-lg flex items-center gap-3"
              style={{ boxShadow: "0 8px 24px rgba(255, 230, 0, 0.4)" }}
            >
              <Plus className="w-6 h-6" />
              发布求购
            </Button>
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <Button
              onClick={handleInstallment}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#FFE600] text-black hover:opacity-90 shadow-lg flex items-center gap-3"
              style={{ boxShadow: "0 8px 24px rgba(0, 214, 194, 0.4)" }}
            >
              <CreditCard className="w-6 h-6" />
              分期购物
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

        {/* 热门商品列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-morphism rounded-2xl p-8 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white mb-2">热门商品·AI推荐</h3>
              <p className="text-sm text-white/60">根据您的浏览记录智能推荐</p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-[#FFE600]/20 border border-[#FFE600]/30">
              <span className="text-[#FFE600]">🔥 限时特惠</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFE600]/30 transition-all"
              >
                <div className="text-6xl mb-4 text-center">{product.image}</div>
                <h4 className="text-white mb-2">{product.name}</h4>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#FFE600] fill-[#FFE600]" />
                    <span className="text-[#FFE600] text-sm">{product.rating}</span>
                  </div>
                  <span className="text-white/40 text-sm">·</span>
                  <span className="text-white/60 text-sm">已售 {product.sales}</span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl text-[#FFE600]">{product.price}</span>
                  <span className="text-sm text-white/40 line-through">{product.original}</span>
                  <span className="ml-auto text-sm text-white/60">{product.seller}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    variant="outline"
                    className="flex-1 border-[#00D6C2]/40 text-[#00D6C2] hover:bg-[#00D6C2]/10"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    加购
                  </Button>
                  <Button
                    onClick={() => handleBuyNow(product.id)}
                    className="flex-1 bg-gradient-to-r from-[#FFE600] to-[#00D6C2] text-black hover:opacity-90"
                  >
                    立即购买
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 底部主按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleGoToCheckout}
            className="h-16 px-12 rounded-2xl text-lg bg-gradient-to-r from-[#FFE600] via-[#00D6C2] to-[#FFE600] text-black hover:opacity-90 shadow-xl"
            style={{ boxShadow: "0 12px 32px rgba(255, 230, 0, 0.5)" }}
          >
            <ShoppingCart className="w-6 h-6 mr-3" />
            前往购物车结账
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
