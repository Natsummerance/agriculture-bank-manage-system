import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Tag } from "lucide-react";
import { useCartStore } from "../../../stores/cartStore";
import { SearchBar, FilterPanel } from "../../../components/common";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

const mockProducts = [
  {
    id: "p1",
    name: "东北优选稻花香大米 5kg",
    price: 89.9,
    image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg",
    category: "rice",
    origin: "黑龙江五常",
    stock: 100,
    tag: "热销",
  },
  {
    id: "p2",
    name: "生态散养土鸡蛋 30枚装",
    price: 59.9,
    image: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg",
    category: "egg",
    origin: "山东潍坊",
    stock: 80,
    tag: "优选农户",
  },
  {
    id: "p3",
    name: "新鲜赣南脐橙 10斤装",
    price: 79.0,
    image: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg",
    category: "fruit",
    origin: "江西赣州",
    stock: 200,
    tag: "产地直发",
  },
];

export default function BuyerProductList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const add = useCartStore((s) => s.add);

  const filtered = useMemo(() => {
    return mockProducts.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.origin.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  const handleAddToCart = (id: string) => {
    const product = mockProducts.find((p) => p.id === id);
    if (!product) return;
    add({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      stock: product.stock,
      origin: product.origin,
    });
    toast.success("已加入购物车");
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <p className="text-xs text-white/50 uppercase tracking-[0.2em]">
            AgriMarket · 精选农产品
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
            买好货 · 从源头直达你的仓库
          </h2>
          <p className="text-sm text-white/60 max-w-2xl">
            支持按品类与产地搜索，全程追溯农户信息，后续可对接溯源与优惠券系统。
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchBar value={search} onChange={setSearch} placeholder="搜索农产品、产地或关键词..." />
          <FilterPanel
            title="类别"
            value={category}
            onChange={setCategory}
            options={[
              { label: "全部", value: "all" },
              { label: "大米", value: "rice" },
              { label: "蛋类", value: "egg" },
              { label: "水果", value: "fruit" },
            ]}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {filtered.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex flex-col backdrop-blur-xl"
            >
              <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }}>
                <div className="absolute left-3 top-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-[10px] text-emerald-300 border border-emerald-400/40">
                  <Tag className="w-3 h-3" />
                  {p.tag}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <div className="text-xs text-white/60">{p.origin}</div>
                <div className="font-semibold text-white text-sm line-clamp-2">{p.name}</div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-lg text-emerald-400 font-bold">¥{p.price.toFixed(2)}</span>
                  <Button size="sm" onClick={() => handleAddToCart(p.id)}>
                    加入购物车
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

