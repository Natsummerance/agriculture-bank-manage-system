/**
 * 异步按钮组件
 * 自动处理加载态、错误提示、防抖
 */

import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { useAsyncButton } from '../../utils/useAsyncButton';
import { ReactNode } from 'react';

interface AsyncButtonProps {
  children: ReactNode;
  onClick: () => Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  debounceMs?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function AsyncButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  className = '',
  debounceMs = 300,
  onSuccess,
  onError,
}: AsyncButtonProps) {
  const { isLoading, error, execute } = useAsyncButton({
    debounceMs,
    onSuccess,
    onError,
  });

  const handleClick = () => {
    execute(onClick);
  };

  // 变体样式
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:shadow-[0_0_20px_rgba(24,255,116,0.7)]',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
    danger: 'bg-gradient-to-r from-[#FF7A9C] to-[#FF2566] text-white hover:shadow-[0_0_20px_rgba(255,122,156,0.7)]',
  };

  // 尺寸样式
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[56px]',
  };

  return (
    <div>
      <motion.button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`
          relative flex items-center justify-center gap-2
          rounded-xl transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="opacity-70">处理中...</span>
          </>
        ) : (
          <>
            {icon && <span>{icon}</span>}
            {children}
          </>
        )}
      </motion.button>

      {/* 错误提示 */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-[#FF7A9C]"
        >
          {error.message}
        </motion.p>
      )}
    </div>
  );
}
