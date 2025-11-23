import { useFarmerProductStore } from "../../../stores/farmerProductStore";
import { useMemo } from "react";
import { motion } from "motion/react";
import { Eye, Heart, Share2, TrendingUp, Package } from "lucide-react";
import { StatsCard, SimpleLineChart } from "../../../components/common";

const mockTrend = [
  { name: "近5天前", value: 20 },
  { name: "近4天前", value: 35 },
  { name: "近3天前", value: 42 },
  { name: "近2天前", value: 38 },
  { name: "昨天", value: 50 },
  { name: "今天", value: 60 },
];

export default function ProductDashboard() {
  const { products } = useFarmerProductStore();

  const stats = useMemo(() => {
    const totalView = products.reduce((sum, p) => sum + (p.viewCount ?? 0), 0);
    const totalFav = products.reduce((sum, p) => sum + (p.favoriteCount ?? 0), 0);
    const totalShare = products.reduce((sum, p) => sum + (p.shareCount ?? 0), 0);
    const avgView = products.length > 0 ? Math.round(totalView / products.length) : 0;
    const topProduct = products.reduce((max, p) => 
      (p.viewCount ?? 0) > (max.viewCount ?? 0) ? p : max, 
      products[0] || { name: "暂无", viewCount: 0 }
    );

    return { totalView, totalFav, totalShare, avgView, topProduct };
  }, [products]);

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              商品数据看板
            </h2>
            <p className="text-sm text-white/60">
              查看商品浏览、收藏、分享等数据统计
            </p>
          </div>
        </motion.div>

        {/* 核心指标 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              icon={<Eye className="w-6 h-6 text-[#18FF74]" />}
              title="总浏览量"
              value={stats.totalView.toString()}
              subtitle="累计被买家查看的次数"
            />
            <StatsCard
              icon={<Heart className="w-6 h-6 text-[#FF6B9D]" />}
              title="总收藏数"
              value={stats.totalFav.toString()}
              subtitle="被加入收藏的次数"
            />
            <StatsCard
              icon={<Share2 className="w-6 h-6 text-[#00D6C2]" />}
              title="总分享数"
              value={stats.totalShare.toString()}
              subtitle="被分享至外部渠道的次数"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-amber-400" />}
              title="平均浏览量"
              value={stats.avgView.toString()}
              subtitle="单个商品平均浏览量"
            />
          </div>
        </motion.section>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 浏览趋势 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#18FF74] to-[#00D6C2] rounded-full" />
              <h3 className="text-lg">近7日浏览趋势</h3>
            </div>
            <SimpleLineChart data={mockTrend} />
          </motion.section>

          {/* 热门商品 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#18FF74] to-[#00D6C2] rounded-full" />
              <h3 className="text-lg">热门商品TOP5</h3>
            </div>
            <div className="space-y-3">
              {products
                .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
                .slice(0, 5)
                .map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#18FF74] to-[#00D6C2] flex items-center justify-center text-sm font-semibold text-black">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{product.name}</div>
                        <div className="text-xs text-white/60">
                          浏览 {product.viewCount ?? 0} · 收藏 {product.favoriteCount ?? 0} · 分享 {product.shareCount ?? 0}
                        </div>
                      </div>
                    </div>
                    <Package className="w-5 h-5 text-white/40" />
                  </motion.div>
                ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}


