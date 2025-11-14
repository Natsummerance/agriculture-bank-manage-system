import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Zap,
  Settings,
  Filter,
  Trash2,
  MessageSquare
} from "lucide-react";

type MessageType = 'approval' | 'appointment' | 'system' | 'payment' | 'expert';
type MessagePriority = 'high' | 'normal' | 'low';

interface Message {
  id: string;
  type: MessageType;
  priority: MessagePriority;
  title: string;
  content: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
}

const mockMessages: Message[] = [
  {
    id: "msg-001",
    type: "approval",
    priority: "high",
    title: "贷款审批通过",
    content: "您的农业生产贷款申请已通过审批，额度35万元",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
    actionable: true
  },
  {
    id: "msg-002",
    type: "appointment",
    priority: "normal",
    title: "专家预约提醒",
    content: "张教授将在明天上午10:00与您进行视频咨询",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    actionable: true
  },
  {
    id: "msg-003",
    type: "system",
    priority: "low",
    title: "系统升级通知",
    content: "平台将于今晚23:00-01:00进行系统维护",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    actionable: false
  },
  {
    id: "msg-004",
    type: "payment",
    priority: "high",
    title: "还款提醒",
    content: "您本月的还款日期为11月5日，金额12,500元",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: false,
    actionable: true
  },
  {
    id: "msg-005",
    type: "expert",
    priority: "normal",
    title: "专家回复",
    content: "李专家已回复您关于水稻病虫害防治的咨询",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
    actionable: true
  }
];

interface MessageCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MessageCenter({ isOpen, onClose }: MessageCenterProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [filter, setFilter] = useState<MessageType | 'all'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [notificationSettings, setNotificationSettings] = useState({
    approval: true,
    appointment: true,
    system: false,
    payment: true,
    expert: true,
  });
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<number>();
  const reconnectTimeoutRef = useRef<number>();

  // WebSocket 完整连接（包含心跳和重连）
  useEffect(() => {
    let isActive = true;

    const connectWebSocket = () => {
      if (!isActive) return;

      // 模拟WebSocket连接（实际应用中使用真实URL: wss://api.agriverse.com/ws）
      setTimeout(() => {
        if (!isActive) return;
        setWsConnected(true);
        setReconnectAttempts(0);
        console.log("📡 WebSocket 连接成功");

        // 启动心跳（每30秒）
        heartbeatRef.current = window.setInterval(() => {
          if (wsConnected) {
            console.log("💓 心跳检测");
          }
        }, 30000);

        // 模拟接收实时消息
        const messageInterval = window.setInterval(() => {
          if (Math.random() > 0.85 && isActive) {
            const types: MessageType[] = ['approval', 'appointment', 'system', 'payment', 'expert'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            // 检查通知设置
            if (!notificationSettings[type]) return;

            const messageTitles = {
              approval: ['贷款审批通过', '额度调整通知', '合同审核完成'],
              appointment: ['专家预约提醒', '预约时间变更', '视频会议即将开始'],
              system: ['系统升级通知', '功能更新提示', '维护公告'],
              payment: ['还款提醒', '逾期预警', '自动扣款成功'],
              expert: ['专家回复', '咨询报告已生成', '专家评级更新']
            };

            const titles = messageTitles[type];
            const title = titles[Math.floor(Math.random() * titles.length)];

            const newMessage: Message = {
              id: `msg-${Date.now()}`,
              type,
              priority: Math.random() > 0.7 ? 'high' : 'normal',
              title,
              content: `这是一条来自系统的实时推送消息`,
              timestamp: new Date(),
              read: false,
              actionable: Math.random() > 0.5
            };

            setMessages(prev => [newMessage, ...prev]);

            // 离线Push模拟（浏览器通知API）
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('星云·AgriVerse', {
                body: `${title}: ${newMessage.content}`,
                icon: '/favicon.ico',
                tag: newMessage.id,
                requireInteraction: newMessage.priority === 'high'
              });
            }
          }
        }, 12000);

        wsRef.current = { 
          close: () => {
            clearInterval(messageInterval);
            clearInterval(heartbeatRef.current);
          }
        } as WebSocket;
      }, 1000);
    };

    // 重连逻辑
    const reconnect = () => {
      if (!isActive || reconnectAttempts >= 5) return;
      
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      console.log(`🔄 ${delay}ms 后尝试重连...`);
      
      reconnectTimeoutRef.current = window.setTimeout(() => {
        setReconnectAttempts(prev => prev + 1);
        connectWebSocket();
      }, delay);
    };

    // 监听连接状态
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('📴 页面进入后台');
      } else {
        console.log('📲 页面回到前台，检查连接...');
        if (!wsConnected) {
          reconnect();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    connectWebSocket();

    return () => {
      isActive = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [notificationSettings]);

  // 请求通知权限
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('通知权限:', permission);
      });
    }
  }, []);

  const unreadCount = messages.filter(m => !m.read).length;

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(m => m.type === filter);

  const markAsRead = (id: string) => {
    setMessages(prev => 
      prev.map(m => m.id === id ? { ...m, read: true } : m)
    );
  };

  const markAllAsRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const getTypeIcon = (type: MessageType) => {
    switch (type) {
      case 'approval': return <CheckCircle className="w-5 h-5" />;
      case 'appointment': return <Bell className="w-5 h-5" />;
      case 'system': return <Info className="w-5 h-5" />;
      case 'payment': return <AlertCircle className="w-5 h-5" />;
      case 'expert': return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: MessageType) => {
    switch (type) {
      case 'approval': return '#18FF74';
      case 'appointment': return '#00D6C2';
      case 'system': return '#FFD700';
      case 'payment': return '#FF2566';
      case 'expert': return '#00D6C2';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <>
      {/* 消息中心面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* 消息面板 */}
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-md glass-morphism border-l border-[#00D6C2]/20 z-50 flex flex-col"
            >
              {/* 头部 */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20">
                      <Bell className="w-6 h-6 text-[#00D6C2]" />
                    </div>
                    <div>
                      <h3 className="flex items-center gap-2">
                        消息中心
                        {wsConnected && (
                          <span className="flex items-center gap-1 text-xs text-[#18FF74]">
                            <Zap className="w-3 h-3" />
                            实时
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-white/60">
                        {unreadCount > 0 ? `${unreadCount} 条未读` : '全部已读'}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* 快捷操作 */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    全部已读
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-lg ${
                      showSettings ? 'bg-[#00D6C2]/20 text-[#00D6C2]' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    <Filter className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* 设置面板 */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-b border-white/10"
                  >
                    <div className="p-6 space-y-4 bg-white/5">
                      <h4 className="text-sm text-white/80 mb-4">通知设置（持久化）</h4>
                      {[
                        { label: '审批通知', key: 'approval' as const },
                        { label: '预约提醒', key: 'appointment' as const },
                        { label: '系统公告', key: 'system' as const },
                        { label: '支付提醒', key: 'payment' as const },
                        { label: '专家消息', key: 'expert' as const },
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between">
                          <span className="text-sm text-white/70">{setting.label}</span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setNotificationSettings(prev => ({
                                ...prev,
                                [setting.key]: !prev[setting.key]
                              }));
                              localStorage.setItem(
                                'agriverse_notifications',
                                JSON.stringify({
                                  ...notificationSettings,
                                  [setting.key]: !notificationSettings[setting.key]
                                })
                              );
                            }}
                            className={`w-12 h-6 rounded-full transition-colors ${
                              notificationSettings[setting.key] ? 'bg-[#18FF74]' : 'bg-white/20'
                            }`}
                          >
                            <motion.div
                              animate={{ x: notificationSettings[setting.key] ? 24 : 2 }}
                              className="w-5 h-5 rounded-full bg-white"
                            />
                          </motion.button>
                        </div>
                      ))}

                      {/* WebSocket状态 */}
                      <div className="pt-4 mt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/60">长连接状态</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-[#18FF74] animate-pulse' : 'bg-white/30'}`} />
                            <span className={wsConnected ? 'text-[#18FF74]' : 'text-white/40'}>
                              {wsConnected ? '已连接' : `重连中(${reconnectAttempts}/5)`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredMessages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full text-white/40"
                    >
                      <Bell className="w-16 h-16 mb-4" />
                      <p>暂无消息</p>
                    </motion.div>
                  ) : (
                    filteredMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => markAsRead(message.id)}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          message.read
                            ? 'bg-white/5 hover:bg-white/10'
                            : 'bg-gradient-to-br from-white/10 to-white/5 border-2 border-[#00D6C2]/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* 消息图标 */}
                          <div
                            className="p-2 rounded-lg flex-shrink-0"
                            style={{ 
                              backgroundColor: `${getTypeColor(message.type)}20`,
                              color: getTypeColor(message.type)
                            }}
                          >
                            {getTypeIcon(message.type)}
                          </div>

                          {/* 消息内容 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h5 className="flex-1 truncate">{message.title}</h5>
                              {!message.read && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="w-2 h-2 rounded-full bg-[#FF2566] flex-shrink-0"
                                />
                              )}
                            </div>
                            <p className="text-sm text-white/60 mb-2 line-clamp-2">
                              {message.content}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/40 font-mono">
                                {formatTime(message.timestamp)}
                              </span>
                              {message.priority === 'high' && (
                                <span className="text-xs px-2 py-0.5 rounded bg-[#FF2566]/20 text-[#FF2566]">
                                  重要
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 删除按钮 */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMessage(message.id);
                            }}
                            className="p-1 rounded hover:bg-[#FF2566]/20 text-white/40 hover:text-[#FF2566] flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>

                        {/* 可操作消息的行动按钮 */}
                        {message.actionable && !message.read && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-3 pt-3 border-t border-white/10 flex gap-2"
                          >
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-white text-sm"
                            >
                              查看详情
                            </motion.button>
                          </motion.div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
