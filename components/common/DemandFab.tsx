import { motion } from 'motion/react';
import { Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface DemandFabProps {
  className?: string;
  onNavigate?: (path: string) => void;
}

export default function DemandFab({ className = '', onNavigate }: DemandFabProps) {

  const handleClick = () => {
    if (onNavigate) {
      onNavigate('/demand');
    } else {
      toast.info('发布求购需求', {
        description: '请前往"农商市场"页面发布您的采购需求',
        duration: 3000
      });
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center shadow-2xl z-30 ${className}`}
      style={{
        boxShadow: '0 0 24px rgba(0, 214, 194, 0.5), 0 8px 16px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Plus className="w-6 h-6 text-white" />
      
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

      {/* Sparkle Effect */}
      <motion.div
        className="absolute -top-1 -right-1"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Sparkles className="w-4 h-4 text-yellow-400" />
      </motion.div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-full mr-3 bg-[#0A0A0D] border border-white/10 rounded-lg px-3 py-2 whitespace-nowrap text-sm text-white shadow-lg pointer-events-none"
      >
        发布求购需求
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-4 border-transparent border-l-[#0A0A0D]" />
      </motion.div>
    </motion.button>
  );
}
