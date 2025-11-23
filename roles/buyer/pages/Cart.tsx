import { navigateToTab } from "../../../utils/navigationEvents";
import { motion } from "motion/react";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "../../../stores/cartStore";
import QtyStepper from "../../../components/common/QtyStepper";
import { Button } from "../../../components/ui/button";
import { useBuyerOrderStore } from "../../../stores/buyerOrderStore";
import { toast } from "sonner";

export default function BuyerCart() {
  const { items, totalAmount, updateQuantity, remove, checkout } = useCartStore();
  const createOrderFromCart = useBuyerOrderStore((s) => s.createOrderFromCart);

  const handleCheckout = async () => {
    if (!items.length) {
      toast.error("购物车为空");
      return;
    }
    const order = createOrderFromCart(
      items.map((i) => ({
        id: i.id,
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
    );
    if (!order) return;

    await checkout();
    toast.success("订单已创建，去支付");
    navigateToTab("cart"); // 跳转到订单中心（cart tab 在买家端显示订单）
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D6C2]/40 to-[#18FF74]/20 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-[#18FF74]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
              购物车
            </h2>
            <p className="text-xs text-white/60">
              汇总你挑选的农产品，可在这里统一调整数量并一键结算。
            </p>
          </div>
        </motion.div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-white/60">
            购物车为空，去「买好货」逛逛吧～
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                >
                  {item.image && (
                    <div
                      className="w-20 h-20 rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="text-white font-medium text-sm line-clamp-2">{item.name}</div>
                    <div className="text-[11px] text-white/50">{item.origin}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-emerald-400 font-semibold text-sm">
                        ¥{item.price.toFixed(2)}
                      </span>
                      <QtyStepper
                        value={item.quantity}
                        min={1}
                        max={item.stock}
                        onChange={(v) => updateQuantity(item.id, v)}
                      />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => remove(item.id)}>
                    删除
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div className="text-white/80 text-sm">
                合计：
                <span className="text-2xl text-emerald-400 font-semibold ml-1">
                  ¥{totalAmount.toFixed(2)}
                </span>
              </div>
              <Button onClick={handleCheckout} className="inline-flex items-center gap-1">
                去结算
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

