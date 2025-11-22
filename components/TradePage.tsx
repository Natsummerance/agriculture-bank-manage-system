import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ShoppingCart, Heart, Star, MapPin, Package, Search, Filter, Lock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BlockchainExplorer } from "./blockchain/BlockchainExplorer";
import FilterDrawer, { FilterOptions } from "./trade/FilterDrawer";
import PublishDemandPage from "./demand/PublishDemandPage";

const products = [
  {
    id: 1,
    name: "有机时令蔬菜礼盒",
    price: 128,
    originalPrice: 158,
    seller: "阳光农场",
    location: "山东寿光",
    rating: 4.9,
    sales: 2340,
    image: "https://images.unsplash.com/photo-1657288089316-c0350003ca49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZhcm18ZW58MXx8fHwxNzYxODk2MjU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["有机认证", "当日采摘"]
  },
  {
    id: 2,
    name: "新鲜水果组合装",
    price: 88,
    originalPrice: 108,
    seller: "果香园",
    location: "陕西延安",
    rating: 4.8,
    sales: 1890,
    image: "https://images.unsplash.com/photo-1556011284-54aa6466d402?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0cyUyMG1hcmtldHxlbnwxfHx8fDE3NjE4ODA0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["产地直发", "精选品质"]
  },
  {
    id: 3,
    name: "东北五常大米 10kg",
    price: 168,
    originalPrice: 198,
    seller: "稻香米业",
    location: "黑龙江五常",
    rating: 5.0,
    sales: 5670,
    image: "https://images.unsplash.com/photo-1670922757779-9472463fe234?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMHJpY2UlMjBmaWVsZHxlbnwxfHx8fDE3NjE4OTYyNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["地理标志", "新米上市"]
  },
  {
    id: 4,
    name: "农家土特产礼包",
    price: 258,
    originalPrice: 298,
    seller: "乡里乡亲",
    location: "云南丽江",
    rating: 4.7,
    sales: 980,
    image: "https://images.unsplash.com/photo-1761124503418-6235c6c20329?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBwcm9kdWN0cyUyMGhhcnZlc3R8ZW58MXx8fHwxNzYxODk2MjU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["精品礼盒", "助农扶贫"]
  },
  {
    id: 5,
    name: "有机时令蔬菜礼盒",
    price: 128,
    originalPrice: 158,
    seller: "阳光农场",
    location: "山东寿光",
    rating: 4.9,
    sales: 2340,
    image: "https://images.unsplash.com/photo-1657288089316-c0350003ca49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZhcm18ZW58MXx8fHwxNzYxODk2MjU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["有机认证", "当日采摘"]
  },
  {
    id: 6,
    name: "新鲜水果组合装",
    price: 88,
    originalPrice: 108,
    seller: "果香园",
    location: "陕西延安",
    rating: 4.8,
    sales: 1890,
    image: "https://images.unsplash.com/photo-1556011284-54aa6466d402?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0cyUyMG1hcmtldHxlbnwxfHx8fDE3NjE4ODA0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["产地直发", "精选品质"]
  },
];

const categories = [
  { id: 1, name: "蔬菜", icon: "🥬", color: "#18FF74" },
  { id: 2, name: "水果", icon: "🍎", color: "#FF2566" },
  { id: 3, name: "粮油", icon: "🌾", color: "#FFD700" },
  { id: 4, name: "肉禽蛋", icon: "🥚", color: "#00D6C2" },
  { id: 5, name: "水产", icon: "🐟", color: "#4F9EFF" },
  { id: 6, name: "礼盒", icon: "🎁", color: "#FF2566" },
];

export function TradePage() {
  const [cartCount, setCartCount] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const [showBlockchain, setShowBlockchain] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDemandForm, setShowDemandForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions | null>(null);

  const handleAddToCart = (productId: number) => {
    setCartCount(prev => prev + 1);
  };

  const handleLike = (productId: number) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("搜索:", searchQuery);
    }
  };

  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
            农商市场·AgriMarket
          </h2>
          <p className="text-white/60">助农电商·产地直达</p>
        </motion.div>

        {/* 搜索栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="max-w-2xl mx-auto glass-morphism rounded-full p-2 flex items-center gap-3">
            <Search className="w-5 h-5 text-white/40 ml-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索农产品..."
              className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white"
            >
              搜索
            </motion.button>
          </div>
        </motion.div>

        {/* 分类导航 */}
        <section className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-4">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex-shrink-0 px-6 py-3 rounded-full glass-morphism flex items-center gap-2 hover:border-[#00D6C2]/50 transition-colors"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span>{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* 商品瀑布流 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3>热销商品</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilter(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass-morphism hover:border-[#00D6C2]/50 transition-colors relative"
            >
              <Filter className="w-4 h-4" />
              筛选
              {filters && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF2566] flex items-center justify-center text-xs"
                >
                  ✓
                </motion.span>
              )}
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-morphism rounded-2xl overflow-hidden cursor-pointer group"
              >
                {/* 商品图片 */}
                <div className="relative aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* 标签 */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {product.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 rounded-full text-xs bg-[#00D6C2]/80 backdrop-blur-sm text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 收藏按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(product.id);
                    }}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Heart 
                      className={`w-5 h-5 transition-colors ${
                        likedProducts.has(product.id) 
                          ? 'fill-[#FF2566] text-[#FF2566]' 
                          : 'text-white'
                      }`}
                    />
                  </motion.button>
                </div>

                {/* 商品信息 */}
                <div className="p-6">
                  <h4 className="mb-2 line-clamp-2 group-hover:text-[#00D6C2] transition-colors">
                    {product.name}
                  </h4>

                  {/* 商家和位置 */}
                  <div className="flex items-center gap-2 mb-3 text-sm text-white/60">
                    <span>{product.seller}</span>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{product.location}</span>
                    </div>
                  </div>

                  {/* 评分和销量 */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                      <span className="text-[#FFD700] font-mono">{product.rating}</span>
                    </div>
                    <span className="text-white/60">已售 {product.sales}</span>
                  </div>

                  {/* 价格和购买 */}
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl text-[#FF2566] font-mono">¥{product.price}</span>
                        <span className="text-sm text-white/40 line-through">¥{product.originalPrice}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] flex items-center justify-center quantum-glow"
                    >
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 购物车悬浮按钮 */}
        {cartCount > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] flex items-center justify-center quantum-glow shadow-2xl"
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#FF2566] flex items-center justify-center text-white text-sm font-mono"
            >
              {cartCount}
            </motion.div>
          </motion.button>
        )}

        {/* 发布需求按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-8 left-8 flex flex-col gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDemandForm(true)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-white flex items-center gap-2 quantum-glow"
          >
            <Package className="w-5 h-5" />
            发布求购需求
          </motion.button>
          
          {/* G2 - 区块链订单追溯 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBlockchain(true)}
            className="px-6 py-3 rounded-full glass-morphism border border-[#18FF74]/30 text-white flex items-center gap-2"
          >
            <Lock className="w-5 h-5 text-[#18FF74]" />
            <span>订单存证</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#18FF74]/20 text-[#18FF74]">G2</span>
          </motion.button>
        </motion.div>

        {/* 筛选抽屉 */}
        <FilterDrawer
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          onApply={handleApplyFilters}
        />

        {/* 区块链存证弹窗 */}
        <AnimatePresence>
          {showBlockchain && (
            <BlockchainExplorer onClose={() => setShowBlockchain(false)} />
          )}
        </AnimatePresence>

        {/* 发布求购需求 */}
        <AnimatePresence>
          {showDemandForm && (
            <PublishDemandPage 
              onClose={() => setShowDemandForm(false)}
              onSuccess={() => setShowDemandForm(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
