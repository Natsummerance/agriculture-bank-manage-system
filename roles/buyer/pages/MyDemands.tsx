import { useState } from "react";
import { motion } from "motion/react";
import { ClipboardList, Plus, MessageSquare, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { toast } from "sonner";

interface Demand {
  id: string;
  title: string;
  quantity: string;
  budget?: string;
  location: string;
  status: "pending" | "quoted" | "matched" | "closed";
  quoteCount: number;
  createdAt: string;
}

const mockDemands: Demand[] = [
  {
    id: "1",
    title: "采购优质大米 1000 公斤",
    quantity: "1000 公斤",
    budget: "¥50,000",
    location: "北京",
    status: "quoted",
    quoteCount: 5,
    createdAt: "2天前",
  },
  {
    id: "2",
    title: "需要新鲜蔬菜 500 公斤",
    quantity: "500 公斤",
    location: "上海",
    status: "pending",
    quoteCount: 0,
    createdAt: "5天前",
  },
];

const statusConfig = {
  pending: { label: "待报价", color: "text-amber-400", bg: "bg-amber-400/20", icon: Clock },
  quoted: { label: "已报价", color: "text-blue-400", bg: "bg-blue-400/20", icon: MessageSquare },
  matched: { label: "已匹配", color: "text-emerald-400", bg: "bg-emerald-400/20", icon: CheckCircle2 },
  closed: { label: "已关闭", color: "text-white/40", bg: "bg-white/5", icon: XCircle },
};

export default function BuyerMyDemands() {
  const [demands] = useState<Demand[]>(mockDemands);

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
              我的求购
            </h2>
            <p className="text-sm text-white/60">
              管理你发布的采购需求，查看农户报价
            </p>
          </div>
          <Button
            onClick={() => navigateToSubRoute("trade", "demand/create")}
            className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            发布新求购
          </Button>
        </motion.div>

        {/* 求购列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {demands.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <ClipboardList className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 mb-2">暂无求购记录</p>
              <Button
                onClick={() => navigateToSubRoute("trade", "demand/create")}
                variant="outline"
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                发布第一个求购
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {demands.map((demand, index) => {
                const status = statusConfig[demand.status];
                const StatusIcon = status.icon;
                return (
                  <motion.div
                    key={demand.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <ClipboardList className="w-5 h-5 text-[#00D6C2]" />
                          <h3 className="text-lg font-semibold text-white">{demand.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${status.color} ${status.bg}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="text-sm text-white/60 space-y-1 mb-3">
                          <div>采购数量：{demand.quantity}</div>
                          {demand.budget && <div>预算：{demand.budget}</div>}
                          <div>区域：{demand.location}</div>
                          <div>发布时间：{demand.createdAt}</div>
                        </div>
                        {demand.quoteCount > 0 && (
                          <div className="flex items-center gap-2 text-sm text-[#00D6C2]">
                            <MessageSquare className="w-4 h-4" />
                            <span>{demand.quoteCount} 个农户已报价</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {demand.status === "quoted" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              navigateToSubRoute("trade", `demand/quotes?id=${demand.id}`);
                            }}
                            className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                          >
                            查看报价
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigateToSubRoute("trade", `demand/detail?id=${demand.id}`);
                          }}
                        >
                          详情
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

