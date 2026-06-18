interface SkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'card' | 'text' | 'avatar';
}

export function Skeleton({ className = '', lines = 3, variant = 'text' }: SkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={`skeleton-card ${className}`}>
        <div className="skeleton-line skeleton-line-lg" />
        <div className="skeleton-line skeleton-line-md" />
        <div className="skeleton-line skeleton-line-sm" />
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-10 h-10 rounded-full skeleton shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="skeleton-line skeleton-line-md" />
          <div className="skeleton-line skeleton-line-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton-line ${i === lines - 1 ? 'skeleton-line-sm' : i === 0 ? 'skeleton-line-lg' : ''}`}
        />
      ))}
    </div>
  );
}
