import { useState } from "react";
import { motion } from "motion/react";
import { Bell, CheckCircle2, XCircle, Package, CreditCard, MessageSquare } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

interface Notification {
  id: string;
  type: "order" | "finance" | "message" | "system";
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "新订单通知",
    content: "你有一个新订单 #ORD001，请及时处理发货",
    read: false,
    createdAt: "2小时前",
    actionUrl: "trade/order-detail",
  },
  {
    id: "2",
    type: "finance",
    title: "融资审批通过",
    content: "你的融资申请 #FIN001 已通过审批，请及时签署合同",
    read: false,
    createdAt: "5小时前",
    actionUrl: "finance/detail",
  },
  {
    id: "3",
    type: "message",
    title: "专家回复",
    content: "张教授回复了你的问题：水稻叶片发黄怎么办？",
    read: true,
    createdAt: "1天前",
  },
];

const typeIcons = {
  order: Package,
  finance: CreditCard,
  message: MessageSquare,
  system: Bell,
};

const typeColors = {
  order: "#18FF74",
  finance: "#00D6C2",
  message: "#FF7A9C",
  system: "#A5ACBA",
};

export default function FarmerNotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      const [tab, subRoute] = notification.actionUrl.split("/");
      navigateToSubRoute(tab, subRoute);
    }
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
              通知中心
            </h2>
            <p className="text-sm text-white/60">
              查看所有系统通知和消息
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                全部标记为已读
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigateToSubRoute("profile", "overview")}
            >
              返回
            </Button>
          </div>
        </motion.div>

        {/* 通知列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">全部通知</h3>
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                  {unreadCount} 条未读
                </span>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无通知</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification, index) => {
                const Icon = typeIcons[notification.type];
                const color = typeColors[notification.type];
                return (
                  <motion.button
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left rounded-2xl glass-morphism border p-6 ${
                      notification.read
                        ? "border-white/10 bg-white/5"
                        : "border-[#00D6C2]/30 bg-[#00D6C2]/10"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">{notification.title}</span>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-[#00D6C2]" />
                          )}
                        </div>
                        <div className="text-sm text-white/70 mb-2">{notification.content}</div>
                        <div className="text-xs text-white/50">{notification.createdAt}</div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

