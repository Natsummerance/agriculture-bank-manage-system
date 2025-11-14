import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '../ui/button';

interface QtyStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function QtyStepper({ 
  value, 
  min = 1, 
  max = 999, 
  onChange,
  size = 'md'
}: QtyStepperProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  const sizeClasses = {
    sm: { button: 'h-8 w-8', input: 'w-10 h-8 text-sm' },
    md: { button: 'h-10 w-10', input: 'w-12 h-10 text-base' },
    lg: { button: 'h-12 w-12', input: 'w-16 h-12 text-lg' },
  };

  const handleDecrease = () => {
    const newValue = Math.max(min, value - 1);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + 1);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    const numValue = parseInt(val);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange(clampedValue);
    }
  };

  const handleInputBlur = () => {
    setInputValue(value.toString());
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          size="sm"
          variant="ghost"
          className={`${sizeClasses[size].button} p-0 rounded-lg bg-white/5 hover:bg-[#00D6C2]/20 border border-white/10 hover:border-[#00D6C2]/30 transition-all`}
          onClick={handleDecrease}
          disabled={value <= min}
        >
          <Minus className="w-4 h-4 text-white/70" />
        </Button>
      </motion.div>

      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className={`${sizeClasses[size].input} text-center bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00D6C2]/50 transition-all`}
      />

      <motion.div whileTap={{ scale: 0.9 }}>
        <Button
          size="sm"
          variant="ghost"
          className={`${sizeClasses[size].button} p-0 rounded-lg bg-white/5 hover:bg-[#18FF74]/20 border border-white/10 hover:border-[#18FF74]/30 transition-all`}
          onClick={handleIncrease}
          disabled={value >= max}
        >
          <Plus className="w-4 h-4 text-white/70" />
        </Button>
      </motion.div>
    </div>
  );
}
