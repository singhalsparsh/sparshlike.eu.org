'use client';

import { cn } from '@/lib/utils';

/* ─── Vibe Cat ───
 *   Shows a cat emoji with headphones when music is playing.
 *   Head-bobbing animation + floating music notes when playing.
 *   No headphones when idle/paused.
 */
export function VibeCat({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
      {/* ── Pulse ring when playing ── */}
      {isPlaying && (
        <div className="absolute inset-0 rounded-full bg-brand-400/10 animate-player-pulse-ring" />
      )}

      {/* ── Cat face ── */}
      <div className={cn('transition-transform duration-300', isPlaying && 'animate-head-bob')}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          className="md:w-[44px] md:h-[44px]"
        >
          {/* Body/face circle */}
          <circle cx="20" cy="22" r="14" fill="currentColor" className="text-gray-600/40" />

          {/* Left ear */}
          <path d="M10 14L6 4L16 10Z" fill="currentColor" className="text-gray-600/40" />
          <path d="M10 14L6 4L16 10Z" fill="currentColor" className="text-brand-400/30" opacity="0.5" />

          {/* Right ear */}
          <path d="M30 14L34 4L24 10Z" fill="currentColor" className="text-gray-600/40" />
          <path d="M30 14L34 4L24 10Z" fill="currentColor" className="text-brand-400/30" opacity="0.5" />

          {/* Eyes */}
          <ellipse cx="15" cy="20" rx="2.5" ry="3" fill="currentColor" className="text-gray-300" />
          <ellipse cx="25" cy="20" rx="2.5" ry="3" fill="currentColor" className="text-gray-300" />

          {/* Eye shine */}
          <circle cx="16" cy="18.5" r="1" fill="currentColor" className="text-white/60" />
          <circle cx="26" cy="18.5" r="1" fill="currentColor" className="text-white/60" />

          {/* Nose */}
          <ellipse cx="20" cy="24" rx="1.5" ry="1" fill="currentColor" className="text-brand-400/70" />

          {/* Mouth */}
          <path d="M17 25.5Q20 28 23 25.5" stroke="currentColor" className="text-gray-300/60" strokeWidth="1" fill="none" />

          {/* Whiskers */}
          <line x1="6" y1="22" x2="12" y2="23" stroke="currentColor" className="text-gray-500/40" strokeWidth="0.6" />
          <line x1="6" y1="25" x2="12" y2="25" stroke="currentColor" className="text-gray-500/40" strokeWidth="0.6" />
          <line x1="28" y1="23" x2="34" y2="22" stroke="currentColor" className="text-gray-500/40" strokeWidth="0.6" />
          <line x1="28" y1="25" x2="34" y2="25" stroke="currentColor" className="text-gray-500/40" strokeWidth="0.6" />

          {/* ── Headphones ── */}
          {isPlaying && (
            <g className="animate-head-bob" style={{ animationDuration: '0.6s' }}>
              {/* Headband */}
              <path
                d="M8 16C8 8 16 6 20 6C24 6 32 8 32 16"
                stroke="currentColor"
                className="text-brand-400"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Left ear cup */}
              <rect x="5" y="14" width="5" height="7" rx="2.5" fill="currentColor" className="text-brand-400" />
              {/* Right ear cup */}
              <rect x="30" y="14" width="5" height="7" rx="2.5" fill="currentColor" className="text-brand-400" />
              {/* Glow on ear cups */}
              <rect x="5" y="14" width="5" height="7" rx="2.5" fill="currentColor" className="text-brand-300/40" />
              <rect x="30" y="14" width="5" height="7" rx="2.5" fill="currentColor" className="text-brand-300/40" />
            </g>
          )}
        </svg>
      </div>

      {/* ── Floating music notes ── */}
      {isPlaying && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="absolute text-[10px] text-brand-400 animate-float-note left-[-8px]">♪</span>
          <span className="absolute text-[8px] text-brand-300 animate-float-note left-[4px]" style={{ animationDelay: '0.4s' }}>♫</span>
          <span className="absolute text-[9px] text-brand-400 animate-float-note left-[-12px]" style={{ animationDelay: '0.8s' }}>♩</span>
        </div>
      )}
    </div>
  );
}
