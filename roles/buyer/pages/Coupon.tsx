import { motion } from "motion/react";
import { TicketPercent, CheckCircle2, Users } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const mockCoupons = [
  {
    id: "c1",
    title: "满 199 减 20",
    desc: "适用于全场农产品，部分特价商品除外",
    expire: "2025-12-31",
    status: "unused" as const,
  },
  {
    id: "c2",
    title: "运费券 · 立减 10 元",
    desc: "单笔订单实付满 99 元可用",
    expire: "2025-06-30",
    status: "used" as const,
  },
];

export default function BuyerCoupon() {
  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D6C2]/40 to-[#18FF74]/20 flex items-center justify-center">
              <TicketPercent className="w-5 h-5 text-[#18FF74]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
                我的优惠券
              </h2>
              <p className="text-xs text-white/60">
                管理你的满减券与运费券，后续可在结算页自动匹配最优组合。
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("profile", "invite")}
            className="border-[#00D6C2]/30 text-[#00D6C2] hover:bg-[#00D6C2]/10"
          >
            <Users className="w-4 h-4 mr-2" />
            邀请好友
          </Button>
        </motion.div>

        <div className="space-y-4">
          {mockCoupons.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between backdrop-blur-xl"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono text-emerald-400">{c.title}</span>
                  {c.status === "used" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[11px] text-white/70">
                      <CheckCircle2 className="w-3 h-3" />
                      已使用
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/60">{c.desc}</p>
                <p className="text-[11px] text-white/40">有效期至：{c.expire}</p>
              </div>
              {c.status === "unused" && (
                <Button size="sm" variant="outline" className="border-emerald-400/60 text-emerald-400">
                  去使用
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

