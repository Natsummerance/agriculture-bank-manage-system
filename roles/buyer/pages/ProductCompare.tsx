import { useState } from "react";
import { motion } from "motion/react";
import { X, ShoppingCart, Star, MapPin, Package } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useCartStore } from "../../../stores/cartStore";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const mockCompareProducts = [
  {
    id: "p1",
    name: "东北优选稻花香大米 5kg",
    price: 89.9,
    image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg",
    origin: "黑龙江五常",
    rating: 4.8,
    sales: 1230,
    stock: 100,
    farmer: "张农户",
  },
  {
    id: "p2",
    name: "生态散养土鸡蛋 30枚装",
    price: 59.9,
    image: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg",
    origin: "山东潍坊",
    rating: 4.9,
    sales: 890,
    stock: 80,
    farmer: "李农户",
  },
];

export default function ProductCompare() {
  const [products, setProducts] = useState(mockCompareProducts);
  const add = useCartStore((s) => s.add);

  const handleRemove = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("已移除对比");
  };

  const handleAddToCart = (product: typeof mockCompareProducts[0]) => {
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

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-white/60 mb-2">暂无对比商品</p>
            <Button
              onClick={() => navigateToSubRoute("trade", "list")}
              className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
            >
              去选购商品
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
              商品对比
            </h2>
            <p className="text-sm text-white/60">
              对比商品信息，选择最适合的商品
            </p>
          </div>
        </motion.div>

        {/* 对比表格 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-white/60 font-normal">对比项</th>
                  {products.map((product, index) => (
                    <th key={product.id} className="p-4 text-center relative">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3"
                      >
                        <button
                          onClick={() => handleRemove(product.id)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center"
                        >
                          <X className="w-4 h-4 text-white/60" />
                        </button>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                        <div className="font-semibold text-white">{product.name}</div>
                      </motion.div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white/60">价格</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <span className="text-2xl font-semibold text-[#00D6C2]">¥{product.price}</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white/60">评分</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white/60">销量</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center text-white/80">
                      {product.sales}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white/60">产地</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-white/80">
                        <MapPin className="w-4 h-4 text-[#00D6C2]" />
                        {product.origin}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white/60">农户</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center text-white/80">
                      {product.farmer}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-white/60">操作</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        加入购物车
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

