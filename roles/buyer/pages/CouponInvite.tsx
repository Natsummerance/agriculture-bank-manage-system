import { useState } from "react";
import { motion } from "motion/react";
import { Users, Gift, Share2, Copy, CheckCircle2, QrCode } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { toast } from "sonner";

const mockInviteData = {
  inviteCode: "BUYER2025",
  inviteLink: "https://agriverse.com/invite/BUYER2025",
  totalInvites: 12,
  successfulInvites: 8,
  totalRewards: 160,
  rewards: [
    { id: "1", friendName: "张三", status: "registered", reward: 20, date: "2025-03-01" },
    { id: "2", friendName: "李四", status: "used", reward: 20, date: "2025-02-28" },
  ],
};

export default function CouponInvite() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockInviteData.inviteLink);
    setCopied(true);
    toast.success("邀请链接已复制");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(mockInviteData.inviteCode);
    toast.success("邀请码已复制");
  };

  const handleShare = () => {
    toast.success("正在打开分享面板...");
    // TODO: 调用原生分享API或第三方分享SDK
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
              邀请好友
            </h2>
            <p className="text-sm text-white/60">
              邀请好友注册，双方都可获得优惠券
            </p>
          </div>
        </motion.div>

        {/* 邀请统计 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-[#00D6C2]" />
              <div>
                <div className="text-2xl font-semibold text-white">{mockInviteData.totalInvites}</div>
                <div className="text-xs text-white/60">累计邀请</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <div className="text-2xl font-semibold text-white">{mockInviteData.successfulInvites}</div>
                <div className="text-xs text-white/60">成功注册</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-6 h-6 text-amber-400" />
              <div>
                <div className="text-2xl font-semibold text-white">¥{mockInviteData.totalRewards}</div>
                <div className="text-xs text-white/60">累计奖励</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 邀请方式 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Share2 className="w-5 h-5 text-[#00D6C2]" />
            <h3 className="text-lg">邀请方式</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/60 mb-2 block">邀请链接</label>
              <div className="flex gap-2">
                <Input
                  value={mockInviteData.inviteLink}
                  readOnly
                  className="bg-white/5 border-white/10 text-white/80"
                />
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className={copied ? "border-emerald-400 text-emerald-400" : ""}
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm text-white/60 mb-2 block">邀请码</label>
              <div className="flex gap-2">
                <Input
                  value={mockInviteData.inviteCode}
                  readOnly
                  className="bg-white/5 border-white/10 text-white/80 font-mono text-lg text-center"
                />
                <Button variant="outline" onClick={handleCopyCode}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleShare}
                className="flex-1 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享邀请
              </Button>
              <Button variant="outline" className="flex-1">
                <QrCode className="w-4 h-4 mr-2" />
                生成二维码
              </Button>
            </div>
          </div>
        </motion.section>

        {/* 邀请记录 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">邀请记录</h3>
          </div>

          <div className="space-y-3">
            {mockInviteData.rewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center">
                    {reward.friendName[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{reward.friendName}</div>
                    <div className="text-xs text-white/60">{reward.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#18FF74]">+¥{reward.reward}</div>
                    <div className="text-xs text-white/60">
                      {reward.status === "registered" ? "已注册" : "已使用优惠券"}
                    </div>
                  </div>
                  {reward.status === "used" && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

