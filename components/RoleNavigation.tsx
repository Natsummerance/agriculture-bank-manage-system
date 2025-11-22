import { motion } from "motion/react";
import { Bell, Share2 } from "lucide-react";
import { useState } from "react";
import { MessageCenter } from "./MessageCenter";
import SharePopover from "./common/SharePopover";
import { useCartStore } from "../stores/cartStore";
import { useMsgStore } from "../stores/msgStore";
import { useRoleNav } from "../hooks/useRoleNav";
import { roleConfig } from "../config/roleNavigation";

interface RoleNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function RoleNavigation({ activeTab, onTabChange }: RoleNavigationProps) {
  const [messageCenterOpen, setMessageCenterOpen] = useState(false);
  const cartCount = useCartStore(state => state.count);
  const unreadCount = useMsgStore(state => state.unread);
  const { nav, role } = useRoleNav();
  
  const currentRoleConfig = role ? roleConfig[role] : null;

  const handleNavClick = (id: string) => {
    onTabChange(id);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-40 glass-morphism border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - 角色主题 */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center quantum-glow"
                style={{
                  background: currentRoleConfig 
                    ? `linear-gradient(135deg, ${currentRoleConfig.color}, ${currentRoleConfig.color}CC)`
                    : 'linear-gradient(135deg, #00D6C2, #18FF74)'
                }}
              >
                <div className="w-6 h-6 border-2 border-white rounded-full" />
              </div>
              <div>
                <h4 
                  className="text-transparent bg-clip-text bg-gradient-to-r"
                  style={{
                    backgroundImage: currentRoleConfig
                      ? `linear-gradient(to right, ${currentRoleConfig.color}, #18FF74)`
                      : 'linear-gradient(to right, #00D6C2, #18FF74)'
                  }}
                >
                  {currentRoleConfig?.theme || '星云'}·AgriVerse
                </h4>
                <p className="text-xs text-white/40">
                  {currentRoleConfig?.description || '农产品融销一体平台'}
                </p>
              </div>
            </motion.div>

            {/* 导航项 - 角色专属 */}
            <div className="hidden md:flex items-center gap-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative px-4 py-2 rounded-lg transition-all flex items-center gap-2
                      ${isActive 
                        ? 'text-white' 
                        : 'text-white/60 hover:text-white/80'
                      }
                    `}
                    style={{
                      background: isActive ? `${item.color}20` : 'transparent',
                      borderWidth: isActive ? '1px' : '0',
                      borderStyle: 'solid',
                      borderColor: isActive ? `${item.color}40` : 'transparent',
                    }}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      style={{ 
                        color: isActive ? item.color : undefined 
                      }} 
                    />
                    <span className="text-sm">{item.label}</span>
                    
                    {/* 购物车角标 */}
                    {item.id === 'trade' && cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                        style={{
                          background: item.color,
                          boxShadow: `0 0 12px ${item.color}80`
                        }}
                      >
                        {cartCount}
                      </motion.span>
                    )}

                    {/* 激活指示器 */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{
                          background: `linear-gradient(to right, ${item.color}, transparent)`
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* 右侧工具栏 */}
            <div className="flex items-center gap-3">
              {/* 消息中心 */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMessageCenterOpen(true)}
                className="relative w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <Bell className="w-5 h-5 text-white/80" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF2566] rounded-full text-xs flex items-center justify-center text-white"
                    style={{ boxShadow: '0 0 12px rgba(255, 37, 102, 0.6)' }}
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* 分享 */}
              <SharePopover>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  <Share2 className="w-5 h-5 text-white/80" />
                </motion.button>
              </SharePopover>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* 移动端底部导航 */}
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-morphism border-t border-white/5"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around px-4 py-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1 min-w-[48px] min-h-[48px] justify-center relative"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Icon 
                    className="w-6 h-6" 
                    style={{ 
                      color: isActive ? item.color : '#ffffff99'
                    }} 
                  />
                </motion.div>
                <span 
                  className="text-xs transition-all"
                  style={{
                    color: isActive ? item.color : '#ffffff66',
                    fontWeight: isActive ? 600 : 400
                  }}
                >
                  {item.label}
                </span>

                {/* 购物车角标 */}
                {item.id === 'trade' && cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-2 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white"
                    style={{
                      background: item.color,
                      fontSize: '10px'
                    }}
                  >
                    {cartCount}
                  </motion.span>
                )}

                {/* 激活指示器 */}
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveNav"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                    style={{
                      background: item.color,
                      boxShadow: `0 0 8px ${item.color}80`
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.nav>

      {/* 消息中心 */}
      <MessageCenter 
        isOpen={messageCenterOpen}
        onClose={() => setMessageCenterOpen(false)}
      />
    </>
  );
}
