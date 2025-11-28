import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CreditCard, MessageCircle, ShoppingBag, User } from 'lucide-react';

const buyerNav = [
  { id: 'home',    label: '首页',   icon: Home,         color: '#00D6C2', path: '/buyer/home' },
  { id: 'trade',   label: '商城',   icon: ShoppingBag,  color: '#18FF74', path: '/buyer/trade' },
  { id: 'finance', label: '分期',   icon: CreditCard,    color: '#FFD700', path: '/buyer/finance' },
  { id: 'expert',  label: '专家',   icon: MessageCircle, color: '#FF7A9C', path: '/buyer/expert' },
  { id: 'profile', label: '我的',   icon: User,         color: '#A5ACBA', path: '/buyer/profile' },
];

export default function BuyerNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState('home');

  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = buyerNav.find(item => currentPath.includes(item.id));
    if (activeItem) {
      setActive(activeItem.id);
    }
  }, [location]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 z-50">
      <div 
        className="h-full border-t"
        style={{
          background: 'rgba(10, 10, 13, 0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex h-full max-w-screen-xl mx-auto">
          {buyerNav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  navigate(item.path);
                }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex flex-col items-center justify-center gap-1 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="buyerActiveNav"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
                    style={{ backgroundColor: item.color }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon 
                    size={24} 
                    color={isActive ? item.color : '#A5ACBA'} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </motion.div>

                <span 
                  className="text-xs transition-colors"
                  style={{ 
                    color: isActive ? item.color : '#A5ACBA',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-20"
                    style={{
                      background: `radial-gradient(circle at center, ${item.color}40, transparent 70%)`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
