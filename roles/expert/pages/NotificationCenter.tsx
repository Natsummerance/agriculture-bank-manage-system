import { useState } from "react";
import { motion } from "motion/react";
import { Bell, Package, CreditCard, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { useMsgStore } from "../../../stores/msgStore";

const typeIcons = {
  order: Package,
  finance: CreditCard,
  message: MessageSquare,
  system: Bell,
};

const typeColors = {
  order: "text-[#A78BFA]",
  finance: "text-[#FF6B9D]",
  message: "text-[#A78BFA]",
  system: "text-amber-400",
};

export default function ExpertNotificationCenter() {
  const { messages, markAsRead, markAllRead, deleteMessage } = useMsgStore();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredMessages = filter === "unread" 
    ? messages.filter(m => !m.read)
    : messages;

  const handleNotificationClick = (msg: any) => {
    if (!msg.read) {
      markAsRead(msg.id);
    }
    if (msg.link) {
      const [tab, subRoute] = msg.link.split("/");
      if (tab && subRoute) {
        navigateToSubRoute(tab, subRoute);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D]">
              通知中心
            </h2>
            <p className="text-sm text-white/60">查看所有系统通知和消息</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigateToSubRoute("profile", "overview")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <Button variant="outline" onClick={markAllRead}>
              全部已读
            </Button>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                全部
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                未读
              </Button>
            </div>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <Bell className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p>暂无通知</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((msg, index) => {
                const Icon = typeIcons[msg.type as keyof typeof typeIcons] || Bell;
                const color = typeColors[msg.type as keyof typeof typeColors] || "text-white";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(msg)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      msg.read
                        ? "border-white/10 bg-white/5"
                        : "border-[#A78BFA]/30 bg-[#A78BFA]/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white">{msg.title}</h4>
                            {!msg.read && (
                              <div className="w-2 h-2 rounded-full bg-[#A78BFA]" />
                            )}
                          </div>
                          <p className="text-sm text-white/70 mb-2">{msg.content}</p>
                          <p className="text-xs text-white/50">{msg.time}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMessage(msg.id);
                        }}
                      >
                        ×
                      </Button>
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

