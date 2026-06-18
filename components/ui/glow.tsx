import { cn } from '@/lib/utils';

interface GlowProps {
  className?: string;
  color?: string;
  size?: number;
  blur?: number;
}

export function Glow({
  className,
  color = 'hsl(var(--brand-400))',
  size = 300,
  blur = 100,
}: GlowProps) {
  return (
    <div
      className={cn('pointer-events-none absolute', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity: 0.15,
      }}
    />
  );
}
