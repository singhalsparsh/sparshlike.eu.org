'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const glassButtonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2 rounded-full',
    'font-semibold transition-all duration-300',
    'overflow-hidden group',
    'active:scale-95',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-gray-100/80 dark:bg-foreground/8 backdrop-blur-xl',
          'border border-gray-200/60 dark:border-white/10',
          'text-gray-700 dark:text-foreground/80',
          'shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.15)]',
          'hover:bg-brand-400/10 hover:border-brand-400/30 hover:text-brand-400',
          'hover:shadow-[0_4px_20px_hsl(var(--brand-400)/0.15)]',
          'hover:-translate-y-px',
        ],
        ghost: [
          'bg-transparent border border-gray-200/40 dark:border-white/8',
          'text-gray-500 dark:text-foreground/50',
          'hover:text-brand-400 dark:hover:text-brand-300',
          'hover:bg-brand-400/8 hover:border-brand-400/20',
        ],
        gradient: [
          'bg-gradient-to-r from-brand-500 to-brand-600',
          'text-white',
          'shadow-[0_4px_20px_hsl(var(--brand-400)/0.25)]',
          'hover:shadow-[0_6px_30px_hsl(var(--brand-400)/0.45)]',
          'hover:scale-[1.03] hover:-translate-y-px',
          'border border-brand-400/20',
        ],
        outline: [
          'bg-transparent',
          'border-2 border-brand-400/40 dark:border-brand-400/30',
          'text-brand-400',
          'hover:bg-brand-400/10 hover:border-brand-400',
          'hover:shadow-[0_0_20px_hsl(var(--brand-400)/0.15)]',
        ],
      },
      size: {
        sm: 'px-4 py-1.5 text-xs',
        md: 'px-5 py-2 text-sm',
        lg: 'px-7 py-2.5 sm:py-3 text-sm sm:text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  children: React.ReactNode;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(glassButtonVariants({ variant, size, className }))}
        {...props}
      >
        {/* Shine sweep */}
        <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';
