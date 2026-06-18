import { cn } from '@/lib/utils';

interface DotPatternProps {
  className?: string;
  size?: number;
  gap?: number;
  color?: string;
  opacity?: number;
}

export function DotPattern({
  className,
  size = 1,
  gap = 24,
  color = 'hsl(var(--brand-400))',
  opacity = 0.1,
}: DotPatternProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: `radial-gradient(${color} ${size}px, transparent ${size}px)`,
        backgroundSize: `${gap}px ${gap}px`,
        opacity,
      }}
    />
  );
}
