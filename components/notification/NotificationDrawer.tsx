import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCheck, X, Package, CreditCard, MessageSquare, Info, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { useMsgStore } from '../../stores/msgStore';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
  onUnreadChange: (count: number) => void;
}

export default function NotificationDrawer({ isOpen, onClose, unreadCount, onUnreadChange }: NotificationDrawerProps) {
  const [activeTab, setActiveTab] = useState('all');
  const messages = useMsgStore(state => state.messages);
  const markAsRead = useMsgStore(state => state.markAsRead);
  const markAllRead = useMsgStore(state => state.markAllRead);
  const deleteMessage = useMsgStore(state => state.deleteMessage);

  const filteredNotifications = messages.filter(n => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const handleMarkAllRead = () => {
    markAllRead();
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Navigate if link exists
    if (notification.link) {
      window.location.href = notification.link;
      onClose();
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMessage(id);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="w-5 h-5" />;
      case 'finance': return <CreditCard className="w-5 h-5" />;
      case 'im': return <MessageSquare className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'finance': return 'from-[#18FF74]/20 to-green-600/20 border-[#18FF74]/30';
      case 'im': return 'from-[#00D6C2]/20 to-cyan-600/20 border-[#00D6C2]/30';
      default: return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0A0A0D] border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell className="w-6 h-6 text-[#00D6C2]" />
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-[10px] text-white"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.div>
                  )}
                </div>
                <h2 className="text-xl text-white">消息通知</h2>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#00D6C2] hover:text-[#00D6C2] hover:bg-[#00D6C2]/10"
                  >
                    <CheckCheck className="w-4 h-4 mr-1" />
                    全部已读
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                  className="text-white/50 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="px-6 py-3 border-b border-white/5">
                <TabsList className="w-full grid grid-cols-4 bg-white/5">
                  <TabsTrigger value="all" className="text-xs">全部</TabsTrigger>
                  <TabsTrigger value="system" className="text-xs">系统</TabsTrigger>
                  <TabsTrigger value="order" className="text-xs">订单</TabsTrigger>
                  <TabsTrigger value="im" className="text-xs">消息</TabsTrigger>
                </TabsList>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1">
                <TabsContent value={activeTab} className="p-6 pt-2 mt-0">
                  {filteredNotifications.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D6C2]/20 to-[#18FF74]/20 flex items-center justify-center mb-4">
                        <Bell className="w-10 h-10 text-[#00D6C2]/50" />
                      </div>
                      <p className="text-white/50 text-sm">暂无消息</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {filteredNotifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`group relative p-4 rounded-xl border cursor-pointer transition-all bg-gradient-to-br ${getTypeColor(notification.type)} ${
                              notification.read ? 'opacity-60' : ''
                            } hover:scale-[1.02]`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            {/* Unread indicator */}
                            {!notification.read && (
                              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] animate-pulse" />
                            )}

                            <div className="flex gap-3">
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTypeColor(notification.type)} flex items-center justify-center flex-shrink-0 text-white`}>
                                {getIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white mb-1">{notification.title}</h4>
                                <p className="text-sm text-white/70 line-clamp-2 mb-2">
                                  {notification.content}
                                </p>
                                <p className="text-xs text-white/40">{notification.time}</p>
                              </div>
                            </div>

                            {/* Delete button */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleDelete(notification.id, e)}
                              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
