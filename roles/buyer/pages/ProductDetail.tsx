import { useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Heart, Share2, Star, Package, MapPin, Truck, Shield } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useCartStore } from "../../../stores/cartStore";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const mockProduct = {
  id: "p1",
  name: "东北优选稻花香大米 5kg",
  price: 89.9,
  originalPrice: 99.9,
  images: [
    "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg",
    "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg",
  ],
  category: "大米",
  origin: "黑龙江五常",
  stock: 100,
  sales: 1230,
  rating: 4.8,
  reviews: 256,
  farmer: {
    name: "张农户",
    rating: 4.9,
    verified: true,
  },
  description: "精选五常稻花香品种，采用传统种植工艺，米粒饱满，口感香甜。",
  details: [
    "产地：黑龙江五常",
    "品种：稻花香",
    "净重：5kg",
    "保质期：12个月",
    "储存方式：阴凉干燥处",
  ],
};

export default function ProductDetail() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id") || mockProduct.id;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const add = useCartStore((s) => s.add);

  const handleAddToCart = () => {
    add({
      productId: mockProduct.id,
      name: mockProduct.name,
      price: mockProduct.price,
      quantity,
      image: mockProduct.images[0],
      stock: mockProduct.stock,
      origin: mockProduct.origin,
    });
    toast.success(`已加入购物车 ${quantity} 件`);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "已取消收藏" : "已收藏");
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?id=${productId}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("分享链接已复制到剪贴板");
    } catch (err) {
      console.error("复制失败:", err);
      toast.error("复制失败，请手动复制链接");
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 商品信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-8 md:grid-cols-2"
        >
          {/* 图片区域 */}
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl glass-morphism border border-white/10 bg-white/5 overflow-hidden"
            >
              <img
                src={mockProduct.images[selectedImage]}
                alt={mockProduct.name}
                className="w-full h-[500px] object-cover"
              />
            </motion.div>
            <div className="flex gap-2">
              {mockProduct.images.map((img, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-[#00D6C2]"
                      : "border-white/10"
                  }`}
                >
                  <img src={img} alt={`${mockProduct.name} ${index + 1}`} className="w-20 h-20 object-cover" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* 商品详情 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-white mb-2">{mockProduct.name}</h1>
              <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                <span>销量：{mockProduct.sales}</span>
                <span>库存：{mockProduct.stock}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{mockProduct.rating}</span>
                  <span>({mockProduct.reviews}条评价)</span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-semibold text-[#00D6C2]">¥{mockProduct.price}</span>
              <span className="text-xl text-white/40 line-through">¥{mockProduct.originalPrice}</span>
              <span className="text-sm px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                限时优惠
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[#00D6C2]" />
                <span>产地：{mockProduct.origin}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-[#18FF74]" />
                <span>类别：{mockProduct.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>包邮</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>7天无理由退货</span>
              </div>
            </div>

            <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center">
                  {mockProduct.farmer.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-white">{mockProduct.farmer.name}</div>
                  <div className="text-xs text-white/60">
                    评分 {mockProduct.farmer.rating} · {mockProduct.farmer.verified ? "已认证" : "未认证"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">数量：</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(Math.min(mockProduct.stock, quantity + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                加入购物车
              </Button>
              <Button
                variant="outline"
                onClick={handleFavorite}
                className={isFavorite ? "border-[#FF6B9D] text-[#FF6B9D]" : ""}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-[#FF6B9D]" : ""}`} />
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* 商品详情 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">商品详情</h3>
          </div>
          <p className="text-white/80">{mockProduct.description}</p>
          <div className="space-y-2">
            {mockProduct.details.map((detail, index) => (
              <div key={index} className="text-sm text-white/60">
                · {detail}
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

