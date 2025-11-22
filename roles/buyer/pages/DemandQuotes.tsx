import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { MessageSquare, User, MapPin, Star, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { toast } from "sonner";

interface Quote {
  id: string;
  farmerName: string;
  farmerLocation: string;
  farmerRating: number;
  price: number;
  quantity: string;
  deliveryTime: string;
  message: string;
  createdAt: string;
}

const mockQuotes: Quote[] = [
  {
    id: "1",
    farmerName: "张农户",
    farmerLocation: "山东",
    farmerRating: 4.8,
    price: 48000,
    quantity: "1000 公斤",
    deliveryTime: "3-5天",
    message: "我们有优质大米，价格优惠，可提供样品",
    createdAt: "1小时前",
  },
  {
    id: "2",
    farmerName: "李农户",
    farmerLocation: "黑龙江",
    farmerRating: 4.9,
    price: 52000,
    quantity: "1000 公斤",
    deliveryTime: "5-7天",
    message: "东北优质大米，品质保证",
    createdAt: "2小时前",
  },
];

export default function BuyerDemandQuotes() {
  const { id } = useParams<{ id: string }>();
  const [quotes] = useState<Quote[]>(mockQuotes);

  const handleAcceptQuote = (quoteId: string) => {
    toast.success(`已接受报价 #${quoteId}，正在跳转到订单页面...`);
    // TODO: 创建订单并跳转
  };

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
              农户报价列表
            </h2>
            <p className="text-sm text-white/60">
              查看所有农户对你的求购需求的报价
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("trade", "demand/list")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回我的求购
          </Button>
        </motion.div>

        {/* 报价列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {quotes.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无报价</p>
            </div>
          ) : (
            <div className="space-y-3">
              {quotes.map((quote, index) => (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-[#00D6C2]" />
                        <span className="text-lg font-semibold text-white">{quote.farmerName}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm text-white/60">{quote.farmerRating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-white/60">
                          <MapPin className="w-4 h-4" />
                          {quote.farmerLocation}
                        </div>
                      </div>
                      <div className="text-sm text-white/60 space-y-1 mb-3">
                        <div>报价：<span className="text-[#18FF74] font-semibold">¥{quote.price.toLocaleString()}</span></div>
                        <div>数量：{quote.quantity}</div>
                        <div>交货时间：{quote.deliveryTime}</div>
                        <div className="text-white/70 mt-2">{quote.message}</div>
                      </div>
                      <div className="text-xs text-white/50">
                        报价时间：{quote.createdAt}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => handleAcceptQuote(quote.id)}
                        className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                      >
                        接受报价
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("联系农户功能待实现")}
                      >
                        联系农户
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

