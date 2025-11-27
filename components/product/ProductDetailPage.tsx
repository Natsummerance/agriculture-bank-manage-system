import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Share2, MapPin, Package, Shield, TrendingUp, MessageCircle, Star, ChevronLeft, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ConsultDialog from '../consult/ConsultDialog';

interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: 5;
  content: string;
  images: string[];
  time: string;
}

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: 'p1',
    name: '有机富硒苹果',
    price: 12.8,
    originalPrice: 18.0,
    stock: 9876,
    sold: 12543,
    origin: '陕西延安',
    rating: 4.9,
    reviewCount: 2341,
    images: [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800',
      'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=800',
    ],
    video: 'https://example.com/product-video.mp4',
    specs: {
      '产地': '陕西延安',
      '品种': '红富士',
      '规格': '75-80mm',
      '包装': '5kg/箱',
      '认证': '有机认证、富硒认证',
      '储存': '常温7天，冷藏30天',
    },
    description: `
      精选陕西延安黄土高原有机富硒苹果，生长于海拔1000米以上的优质产区。
      
      【产品特点】
      • 富含天然硒元素，每100g含硒量≥10μg
      • 有机种植，不使用化学农药和化肥
      • 果形端正，色泽鲜艳，口感脆甜多汁
      • 通过国家有机认证和富硒认证
      
      【营养价值】
      含有丰富的维生素C、膳食纤维、钾、硒等营养元素，具有抗氧化、增强免疫力等功效。
      
      【食用建议】
      建议每天食用1-2个，可直接食用或榨汁饮用。
    `,
  };

  const reviews: Review[] = [
    {
      id: '1',
      user: '张**',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      rating: 5,
      content: '苹果又大又甜，很新鲜！包装也很好，没有坏果。富硒苹果确实比普通苹果更有营养，家人都很喜欢吃。',
      images: [
        'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200',
        'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200',
      ],
      time: '2天前',
    },
    {
      id: '2',
      user: '李**',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rating: 5,
      content: '第二次购买了，质量一如既往的好。果农很负责，发货速度快，物流也给力。',
      images: [],
      time: '5天前',
    },
  ];

  const handleAddToCart = () => {
    // Cart flying animation will be handled by parent
    toast.success('已加入购物车', {
      duration: 2000,
    });
    
    // Trigger flying animation
    const button = document.getElementById('add-to-cart-btn');
    if (button) {
      const rect = button.getBoundingClientRect();
      const flyingIcon = document.createElement('div');
      flyingIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
      flyingIcon.style.position = 'fixed';
      flyingIcon.style.left = `${rect.left}px`;
      flyingIcon.style.top = `${rect.top}px`;
      flyingIcon.style.color = '#00D6C2';
      flyingIcon.style.pointerEvents = 'none';
      flyingIcon.style.zIndex = '9999';
      flyingIcon.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      document.body.appendChild(flyingIcon);

      requestAnimationFrame(() => {
        flyingIcon.style.left = `${window.innerWidth - 100}px`;
        flyingIcon.style.top = '20px';
        flyingIcon.style.opacity = '0';
        flyingIcon.style.transform = 'rotate(360deg) scale(0.5)';
      });

      setTimeout(() => {
        flyingIcon.remove();
      }, 600);
    }
  };

  const handleBuyNow = () => {
    toast.success('正在前往结算...');
    setTimeout(() => {
      navigate('/order/confirm');
    }, 400);
  };

  const handleShare = () => {
    toast.success('分享链接已复制到剪贴板');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? '已取消收藏' : '已添加到收藏');
  };

  return (
    <div className="min-h-screen bg-[#050816] pb-24">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {/* Image Gallery */}
      <div className="relative h-[400px] bg-black/20">
        <motion.img
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Video Badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <Play className="w-3 h-3 text-[#00D6C2]" />
          <span className="text-xs text-white">360°全景</span>
        </div>

        {/* Image Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {product.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex
                  ? 'bg-[#00D6C2] w-6'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShare}
            className="w-10 h-10 p-0 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-black/80"
          >
            <Share2 className="w-4 h-4 text-white" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleFavorite}
            className="w-10 h-10 p-0 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-black/80"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Price & Title */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-3xl text-[#00D6C2]">¥{product.price}</span>
            <span className="text-lg text-white/40 line-through">¥{product.originalPrice}</span>
            <Badge className="bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30">
              限时特惠
            </Badge>
          </div>
          <h1 className="text-2xl text-white mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span>{product.rating}分</span>
            </div>
            <span>已售 {product.sold.toLocaleString()}</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{product.origin}</span>
            </div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#00D6C2]/10 to-[#00D6C2]/5 border border-[#00D6C2]/20">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-[#00D6C2]" />
              <span className="text-xs text-white/60">库存充足</span>
            </div>
            <p className="text-sm text-white">{product.stock.toLocaleString()} 件</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#18FF74]/10 to-[#18FF74]/5 border border-[#18FF74]/20">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-[#18FF74]" />
              <span className="text-xs text-white/60">品质保证</span>
            </div>
            <p className="text-sm text-white">有机认证</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-white/60">热销商品</span>
            </div>
            <p className="text-sm text-white">Top 10</p>
          </div>
        </div>

        {/* Consult Button */}
        <Button
          onClick={() => setConsultOpen(true)}
          className="w-full mb-6 h-12 bg-gradient-to-r from-[#00D6C2]/20 to-[#18FF74]/20 text-[#00D6C2] border border-[#00D6C2]/30 hover:bg-[#00D6C2]/30"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          咨询专家
        </Button>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mb-20">
          <TabsList className="w-full bg-white/5">
            <TabsTrigger value="description" className="flex-1">详情</TabsTrigger>
            <TabsTrigger value="specs" className="flex-1">参数</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              评价 ({product.reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose prose-invert max-w-none">
              <div className="text-white/80 whitespace-pre-line leading-relaxed">
                {product.description}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <div className="space-y-3">
              {Object.entries(product.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <span className="text-white/60">{key}</span>
                  <span className="text-white">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={review.avatar}
                      alt={review.user}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white">{review.user}</span>
                        <span className="text-xs text-white/40">{review.time}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-yellow-500 text-yellow-500"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 mb-3">{review.content}</p>
                  {review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0F1E]/95 backdrop-blur-xl border-t border-white/10 pb-safe z-30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="flex-col h-12 px-4 gap-0.5 text-white/70 hover:text-white hover:bg-white/10"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">客服</span>
            </Button>
            <Button
              variant="ghost"
              onClick={toggleFavorite}
              className="flex-col h-12 px-4 gap-0.5 text-white/70 hover:text-white hover:bg-white/10"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
              />
              <span className="text-xs">收藏</span>
            </Button>
            <Button
              id="add-to-cart-btn"
              onClick={handleAddToCart}
              className="flex-1 h-12 bg-gradient-to-r from-[#00D6C2]/20 to-[#18FF74]/20 text-[#00D6C2] border border-[#00D6C2]/30 hover:bg-[#00D6C2]/30"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              加入购物车
            </Button>
            <Button
              onClick={handleBuyNow}
              className="flex-1 h-12 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-[#0A0A0D] hover:opacity-90"
            >
              立即购买
            </Button>
          </div>
        </div>
      </div>

      {/* Consult Dialog */}
      <ConsultDialog
        isOpen={consultOpen}
        onClose={() => setConsultOpen(false)}
        expertId="expert1"
        expertName="张老师"
        expertAvatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
        isOnline={true}
      />
    </div>
  );
}
