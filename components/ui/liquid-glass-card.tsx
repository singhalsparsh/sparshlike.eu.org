'use client';

import { useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LiquidGlassCardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  glowColor?: string;
}

export function LiquidGlassCard({
  children,
  className,
  interactive = false,
  glowColor,
}: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rx = ((y - centerY) / centerY) * -5;
    const ry = ((x - centerX) / centerX) * 5;
    setRotateX(rx);
    setRotateY(ry);
    setGlowX((x / rect.width) * 100);
    setGlowY((y / rect.height) * 100);
  }

  function handleMouseEnter() {
    if (!interactive) return;
    setIsHovered(true);
  }

  function handleMouseLeave() {
    if (!interactive) return;
    setRotateX(0);
    setRotateY(0);
    setGlowX(50);
    setGlowY(50);
    setIsHovered(false);
  }

  const effectiveGlow = glowColor || `hsl(var(--brand-400) / 0.12)`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: interactive
          ? `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
          : undefined,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
      }}
      className={cn(
        'glass-card rounded-2xl',
        interactive && 'cursor-pointer',
        className
      )}
    >
      {/* ── Base ambient shine (always visible) ── */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] dark:from-white/[0.05] via-transparent to-transparent opacity-60" />

      {/* ── Secondary warm sweep ── */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tl from-brand-400/[0.04] via-transparent to-transparent" />

      {/* ── Dynamic cursor follower ── */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-200"
        style={{
          opacity: isHovered ? 1 : 0.2,
          background: `radial-gradient(
            circle at ${glowX}% ${glowY}%,
            ${effectiveGlow} 0%,
            transparent 65%
          )`,
        }}
      />

      {/* ── Top edge highlight ── */}
      <div className="pointer-events-none absolute top-0 left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-white/30 dark:via-white/15 to-transparent" />

      {/* ── Bottom reflection well ── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/[0.04] dark:from-white/[0.02] to-transparent rounded-b-2xl" />

      {/* ── Side glints ── */}
      <div className="pointer-events-none absolute left-0 top-[15%] bottom-[15%] w-[1px] bg-gradient-to-b from-transparent via-white/12 dark:via-white/[0.06] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-[15%] bottom-[15%] w-[1px] bg-gradient-to-b from-transparent via-brand-400/10 to-transparent" />

      {/* ── Hover edge glow ── */}
      {interactive && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.7 : 0,
            boxShadow: `inset 0 0 1px 1px hsl(var(--brand-400) / 0.18), 0 0 30px hsl(var(--brand-400) / 0.05)`,
          }}
        />
      )}

      {/* ── Content (kept fully opaque for readability) ── */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
