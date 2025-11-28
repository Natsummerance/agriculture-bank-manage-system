import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Tag, Loader2 } from "lucide-react";
import { useCartStore } from "../../../stores/cartStore";
import { SearchBar, FilterPanel } from "../../../components/common";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { getBuyerProducts, type BuyerProduct } from "../../../api/buyer";
import DOMPurify from "dompurify";

export default function BuyerProductList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [products, setProducts] = useState<BuyerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;
  const add = useCartStore((s) => s.add);

  // 加载商品列表
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getBuyerProducts({
        search: search || undefined,
        category: category !== "all" ? category : undefined,
        page,
        pageSize,
      });
      setProducts(response.products);
      setTotal(response.total);
    } catch (error: any) {
      console.error("加载商品列表失败:", error);
      toast.error(error.message || "加载商品列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 当搜索、类别或页码变化时重新加载
  useEffect(() => {
    loadProducts();
  }, [search, category, page]);

  const handleAddToCart = (product: BuyerProduct) => {
    if (product.stock <= 0) {
      toast.error("商品已售罄");
      return;
    }
    add({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: "", // 后端暂无图片字段，可以后续添加
      stock: product.stock,
      origin: product.origin,
    });
    toast.success("已加入购物车");
  };

  // 获取商品标签（根据浏览量等）
  const getProductTag = (product: BuyerProduct) => {
    if (product.viewCount && product.viewCount > 100) {
      return "热销";
    }
    if (product.favoriteCount && product.favoriteCount > 10) {
      return "优选农户";
    }
    return "产地直发";
  };

  const sanitizeHtml = useMemo(() => {
    return (html?: string) => {
      if (!html) return "";
      return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
    };
  }, []);

  const extractCoverImage = useMemo(() => {
    return (html?: string) => {
      if (!html || typeof window === "undefined") return null;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const img = doc.querySelector("img");
      return img?.getAttribute("src") ?? null;
    };
  }, []);

  const sanitizeDescription = useMemo(() => {
    return (html?: string) => {
      if (!html || typeof window === "undefined") return "";
      const sanitized = sanitizeHtml(html);
      const parser = new DOMParser();
      const doc = parser.parseFromString(sanitized, "text/html");
      doc.querySelectorAll("img").forEach((img) => img.remove());
      return doc.body.innerHTML;
    };
  }, [sanitizeHtml]);

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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-white/60">
            暂无商品，请稍后再试
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              {products.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex flex-col backdrop-blur-xl"
                >
                  <div className="relative h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center overflow-hidden">
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-emerald-300 border border-emerald-400/40 z-10">
                      <Tag className="w-3 h-3" />
                      {getProductTag(p)}
                    </div>
                    {(() => {
                      const sanitized = sanitizeHtml(p.description);
                      const cover = extractCoverImage(sanitized);
                      if (cover) {
                        return (
                          <>
                            <img
                              src={cover}
                              alt={p.name}
                              className="absolute inset-0 h-full w-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                          </>
                        );
                      }
                      return <div className="text-4xl opacity-30">🌾</div>;
                    })()}
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-2">
                    <div className="text-xs text-white/60">{p.origin} · {p.farmerName}</div>
                    <div className="font-semibold text-white text-sm line-clamp-2">{p.name}</div>
                    {p.description && (
                      <div
                        className="html-content text-xs text-white/60 max-h-24 overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: sanitizeDescription(p.description) }}
                      />
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex flex-col">
                        <span className="text-lg text-emerald-400 font-bold">¥{p.price.toFixed(2)}</span>
                        <span className="text-xs text-white/50">库存: {p.stock}</span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleAddToCart(p)}
                        disabled={p.stock <= 0}
                      >
                        {p.stock <= 0 ? "已售罄" : "加入购物车"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {total > pageSize && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  上一页
                </Button>
                <span className="text-sm text-white/60">
                  第 {page} 页，共 {Math.ceil(total / pageSize)} 页
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / pageSize)}
                >
                  下一页
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

