import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileCheck, Users, TrendingUp, User } from 'lucide-react';

const bankNav = [
  { id: 'home',    label: '仪表盘',   icon: LayoutDashboard, color: '#FFD700', path: '/bank/home' },
  { id: 'finance', label: '审批',   icon: FileCheck,       color: '#18FF74', path: '/bank/finance' },
  { id: 'expert',  label: '客户',   icon: Users,           color: '#00D6C2', path: '/bank/expert' },
  { id: 'trade',   label: '风控',   icon: TrendingUp,      color: '#FF8C00', path: '/bank/trade' },
  { id: 'profile', label: '我的',   icon: User,            color: '#A5ACBA', path: '/bank/profile' },
];

export default function BankNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState('home');

  useEffect(() => {
    const activeItem = bankNav.find(item => location.pathname.includes(item.id));
    if (activeItem) setActive(activeItem.id);
  }, [location]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 z-50" style={{ background: 'rgba(10, 10, 13, 0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="flex h-full max-w-screen-xl mx-auto">
        {bankNav.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <motion.button key={item.id} onClick={() => { setActive(item.id); navigate(item.path); }} whileTap={{ scale: 0.95 }} className="flex-1 flex flex-col items-center justify-center gap-1 relative">
              {isActive && <motion.div layoutId="bankActiveNav" className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full" style={{ backgroundColor: item.color }} transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
              <motion.div animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -2 : 0 }} transition={{ duration: 0.2 }}>
                <Icon size={24} color={isActive ? item.color : '#A5ACBA'} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className="text-xs transition-colors" style={{ color: isActive ? item.color : '#A5ACBA', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
