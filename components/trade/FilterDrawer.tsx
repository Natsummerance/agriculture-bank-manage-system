import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, Filter, RotateCcw } from "lucide-react";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { toast } from "sonner@2.0.3";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  locations: string[];
  certifications: string[];
  sortBy: 'sales' | 'price-low' | 'price-high' | 'rating' | 'newest';
  inStockOnly: boolean;
  organicOnly: boolean;
}

const categories = [
  { id: 'vegetable', name: '蔬菜', icon: '🥬' },
  { id: 'fruit', name: '水果', icon: '🍎' },
  { id: 'grain', name: '粮油', icon: '🌾' },
  { id: 'meat', name: '肉禽蛋', icon: '🥚' },
  { id: 'seafood', name: '水产', icon: '🐟' },
  { id: 'gift', name: '礼盒', icon: '🎁' },
];

const locations = [
  '山东', '河北', '河南', '陕西', '云南', '新疆', '黑龙江', '四川'
];

const certifications = [
  { id: 'organic', name: '有机认证', color: '#18FF74' },
  { id: 'green', name: '绿色食品', color: '#00D6C2' },
  { id: 'geo', name: '地理标志', color: '#FFD700' },
];

const sortOptions = [
  { id: 'sales', name: '销量优先' },
  { id: 'price-low', name: '价格由低到高' },
  { id: 'price-high', name: '价格由高到低' },
  { id: 'rating', name: '评分最高' },
  { id: 'newest', name: '最新上架' },
];

export default function FilterDrawer({ isOpen, onClose, onApply }: FilterDrawerProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 500],
    categories: [],
    locations: [],
    certifications: [],
    sortBy: 'sales',
    inStockOnly: false,
    organicOnly: false,
  });

  const handleReset = () => {
    setFilters({
      priceRange: [0, 500],
      categories: [],
      locations: [],
      certifications: [],
      sortBy: 'sales',
      inStockOnly: false,
      organicOnly: false,
    });
    toast.success("筛选条件已重置");
  };

  const handleApply = () => {
    onApply(filters);
    toast.success("筛选条件已应用");
    onClose();
  };

  const toggleCategory = (id: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter(c => c !== id)
        : [...prev.categories, id]
    }));
  };

  const toggleLocation = (location: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  const toggleCertification = (id: string) => {
    setFilters(prev => ({
      ...prev,
      certifications: prev.certifications.includes(id)
        ? prev.certifications.filter(c => c !== id)
        : [...prev.certifications, id]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* 筛选面板 */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md glass-morphism border-l border-[#00D6C2]/20 z-50 flex flex-col"
          >
            {/* 头部 */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20">
                    <Filter className="w-6 h-6 text-[#00D6C2]" />
                  </div>
                  <div>
                    <h3>筛选条件</h3>
                    <p className="text-sm text-white/60">自定义您的搜索结果</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 价格区间 */}
              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                  价格区间
                </h4>
                <div className="space-y-4">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                    min={0}
                    max={500}
                    step={10}
                    className="mb-2"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <div className="px-4 py-2 rounded-lg bg-white/5">
                      ¥{filters.priceRange[0]}
                    </div>
                    <span className="text-white/40">-</span>
                    <div className="px-4 py-2 rounded-lg bg-white/5">
                      ¥{filters.priceRange[1]}
                    </div>
                  </div>
                </div>
              </div>

              {/* 商品分类 */}
              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                  商品分类
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        filters.categories.includes(cat.id)
                          ? 'bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 border-2 border-[#00D6C2]'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs">{cat.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 产地筛选 */}
              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                  产地筛选
                </h4>
                <div className="flex flex-wrap gap-2">
                  {locations.map((location) => (
                    <motion.button
                      key={location}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleLocation(location)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        filters.locations.includes(location)
                          ? 'bg-gradient-to-br from-[#00D6C2] to-[#18FF74] text-white'
                          : 'bg-white/5 text-white/80'
                      }`}
                    >
                      {location}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 认证标准 */}
              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                  认证标准
                </h4>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <motion.button
                      key={cert.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleCertification(cert.id)}
                      className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                        filters.certifications.includes(cert.id)
                          ? 'bg-white/10 border-2'
                          : 'bg-white/5 border border-white/10'
                      }`}
                      style={{
                        borderColor: filters.certifications.includes(cert.id) ? cert.color : undefined
                      }}
                    >
                      <span className="text-white/90">{cert.name}</span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          filters.certifications.includes(cert.id) ? 'border-white' : 'border-white/30'
                        }`}
                        style={{
                          backgroundColor: filters.certifications.includes(cert.id) ? cert.color : 'transparent'
                        }}
                      >
                        {filters.certifications.includes(cert.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-white"
                          />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 排序方式 */}
              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                  排序方式
                </h4>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFilters({ ...filters, sortBy: option.id as any })}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        filters.sortBy === option.id
                          ? 'bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 border-2 border-[#00D6C2] text-white'
                          : 'bg-white/5 text-white/80'
                      }`}
                    >
                      {option.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 快捷开关 */}
              <div>
                <h4 className="mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                  快捷选项
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-white/90">仅显示有货</span>
                    <Switch
                      checked={filters.inStockOnly}
                      onCheckedChange={(checked) => setFilters({ ...filters, inStockOnly: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="text-white/90">仅显示有机</span>
                    <Switch
                      checked={filters.organicOnly}
                      onCheckedChange={(checked) => setFilters({ ...filters, organicOnly: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 底部操作 */}
            <div className="p-6 border-t border-white/10">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  重置
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white flex items-center justify-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  应用筛选
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
