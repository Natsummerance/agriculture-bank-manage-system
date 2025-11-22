import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';

interface CartIconProps {
  onClick?: () => void;
  className?: string;
}

export default function CartIcon({ onClick, className = '' }: CartIconProps) {
  const count = useCartStore(state => state.count);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`relative w-10 h-10 rounded-full bg-gradient-to-br from-[#00D6C2]/10 to-[#18FF74]/10 flex items-center justify-center border border-[#00D6C2]/30 ${className}`}
    >
      <ShoppingCart className="w-5 h-5 text-[#00D6C2]" />
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.6 }}
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-br from-[#FF2566] to-pink-500 rounded-full text-[10px] flex items-center justify-center text-white font-medium quantum-glow"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </motion.button>
  );
}
