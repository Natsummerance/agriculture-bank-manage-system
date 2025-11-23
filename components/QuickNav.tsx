import { motion } from 'motion/react';
import { Calendar, CreditCard, FileText, Users, Briefcase, Building2 } from 'lucide-react';

interface QuickNavProps {
  onNavigate: (page: string) => void;
}

export function QuickNav({ onNavigate }: QuickNavProps) {
  const quickLinks = [
    { id: 'meeting', label: '预约会议室', icon: Users, color: '#00D6C2', role: 'all' },
    { id: 'calendar', label: '专家日历', icon: Calendar, color: '#18FF74', role: 'expert' },
    { id: 'checkout', label: '结账支付', icon: CreditCard, color: '#FFB800', role: 'buyer' },
    { id: 'loan-apply', label: '贷款申请', icon: FileText, color: '#00D6C2', role: 'farmer' },
    { id: 'loan-match', label: '联合贷款', icon: Briefcase, color: '#18FF74', role: 'farmer' },
    { id: 'loan-approve', label: '贷款审批', icon: Building2, color: '#FF6B9D', role: 'bank' },
  ];

  return (
    <div className="fixed bottom-24 right-8 z-50">
      <div className="rounded-3xl border-2 border-white/10 bg-[#0A0F1E]/95 backdrop-blur-xl p-4 shadow-2xl">
        <p className="text-white/60 text-xs mb-3 px-2">快捷入口</p>
        <div className="grid grid-cols-2 gap-2 max-w-sm">
          {quickLinks.map((link) => (
            <motion.button
              key={link.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(link.id)}
              className="p-3 rounded-2xl border-2 border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 text-left"
            >
              <link.icon className="w-5 h-5 mb-2" style={{ color: link.color }} />
              <p className="text-white text-sm">{link.label}</p>
              <p className="text-white/40 text-xs mt-1">
                {link.role === 'all' && '通用'}
                {link.role === 'expert' && '专家'}
                {link.role === 'buyer' && '买家'}
                {link.role === 'farmer' && '农户'}
                {link.role === 'bank' && '银行'}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
