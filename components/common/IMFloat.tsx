import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import ConsultDialog from '../consult/ConsultDialog';
import { Button } from '../ui/button';

interface IMFloatProps {
  expertId?: string;
  expertName?: string;
  expertAvatar?: string;
  autoOpen?: boolean;
}

export default function IMFloat({
  expertId = 'default',
  expertName = '在线客服',
  expertAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  autoOpen = false,
}: IMFloatProps) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Mock unread message
    if (!isOpen && !isMinimized) {
      const timer = setTimeout(() => {
        setUnreadCount(prev => prev + 1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.button
              onClick={handleOpen}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center shadow-2xl"
              style={{
                boxShadow: '0 0 24px rgba(0, 214, 194, 0.5), 0 8px 16px rgba(0, 0, 0, 0.3)',
              }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
              
              {/* Unread Badge */}
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 bg-gradient-to-br from-[#FF2566] to-pink-500 rounded-full text-[10px] flex items-center justify-center text-white font-medium"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}

              {/* Pulse Animation */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74]"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.button>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#0A0F1E]/95 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 whitespace-nowrap text-sm text-white shadow-lg shadow-[#00D6C2]/10"
            >
              在线客服
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-4 border-transparent border-l-[#0A0F1E]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Dialog */}
      <ConsultDialog
        isOpen={isOpen}
        onClose={handleClose}
        expertId={expertId}
        expertName={expertName}
        expertAvatar={expertAvatar}
        isOnline={true}
      />

      {/* Minimized State */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <div className="bg-[#0A0F1E]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-[#00D6C2]/10 flex items-center gap-3">
              <img
                src={expertAvatar}
                alt={expertName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="text-sm text-white">{expertName}</h4>
                <p className="text-xs text-white/50">会话已最小化</p>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsMinimized(false);
                    setIsOpen(true);
                  }}
                  className="h-8 w-8 p-0 text-white/70 hover:text-white"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMinimized(false)}
                  className="h-8 w-8 p-0 text-white/70 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
