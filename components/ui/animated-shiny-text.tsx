'use client';

import { cn } from '@/lib/utils';

interface AnimatedShinyTextProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export function AnimatedShinyText({
  children,
  className,
  speed = 3,
}: AnimatedShinyTextProps) {
  return (
    <span
      className={cn(
        'inline-block bg-clip-text text-transparent',
        'bg-[length:200%_100%]',
        className
      )}
      style={{
        backgroundImage:
          'linear-gradient(90deg, hsl(var(--foreground)) 25%, hsl(var(--brand-400)) 50%, hsl(var(--foreground)) 75%)',
        animation: `shimmer ${speed}s ease-in-out infinite`,
      }}
    >
      {children}
    </span>
  );
}
