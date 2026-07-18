import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/cn';

export { cn };

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none',
          {
            'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]': variant === 'primary',
            'bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.10] text-white': variant === 'secondary',
            'border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10': variant === 'outline',
            'hover:bg-white/[0.06] text-[#94a3b8] hover:text-white': variant === 'ghost',
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
