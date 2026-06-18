'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Search,
  Disc3,
  Maximize2,
  Repeat,
  Repeat1,
  Music,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMusicPlayer, handleThumbnailError } from './MusicPlayerContext';
import { SearchModal } from './SearchModal';
import { FullscreenPlayer } from './FullscreenPlayer';

/* ─── Helpers ─── */
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function VolumeIcon({ volume }: { volume: number }) {
  if (volume === 0) return <VolumeX size={13} />;
  if (volume < 0.5) return <Volume1 size={13} />;
  return <Volume2 size={13} />;
}

function MiniEqualizer() {
  return (
    <div className="flex items-end gap-[1.5px] h-4">
      {[1, 2, 3, 2, 4, 2, 3].map((h, i) => (
        <div
          key={i}
          className="w-[2px] rounded-full animate-equalizer-bar"
          style={{
            height: `${20 + h * 12}%`,
            background: 'linear-gradient(to top, hsl(var(--brand-500)), hsl(var(--brand-300)))',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    isLooping,
    togglePlay,
    next,
    prev,
    setVolume,
    seek,
    toggleSearch,
    toggleFullscreen,
    toggleLoop,
  } = useMusicPlayer();

  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const mobileProgressRef = useRef<HTMLDivElement>(null);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);
  const [showVolume, setShowVolume] = useState(false);
  const volumeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const volumeContainerRef = useRef<HTMLDivElement>(null);

  const handleVolumeEnter = () => {
    if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    setShowVolume(true);
  };
  const handleVolumeLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => setShowVolume(false), 200);
  };

  // ── 3D Tilt on the player card ──
  const playerRef = useRef<HTMLDivElement>(null);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [isTiltHovered, setIsTiltHovered] = useState(false);

  const handleTiltMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current) return;
    const rect = playerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTiltX(((y - centerY) / centerY) * -1.5);
    setTiltY(((x - centerX) / centerX) * 1.5);
  }, []);

  const handleTiltEnter = () => setIsTiltHovered(true);
  const handleTiltLeave = () => {
    setIsTiltHovered(false);
    setTiltX(0);
    setTiltY(0);
  };

  const hasTrack = !!currentTrack;

  const handleProgressInteraction = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    seek(ratio * duration);
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    handleProgressInteraction(e);
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seek(ratio * duration);
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, duration, seek]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="contents">
      <SearchModal />
      <FullscreenPlayer />

      {/* Apple Music-style floating player with 3D tilt */}
      <div className="fixed bottom-0 sm:bottom-5 left-0 sm:left-1/2 sm:-translate-x-1/2 z-[60] px-0 sm:px-5 w-full pointer-events-none">
        <div className="mx-auto w-full sm:max-w-xl lg:max-w-2xl pointer-events-auto relative">
          {/* Ambient glow when playing */}
          {isPlaying && hasTrack && (
            <div className="absolute -inset-6 rounded-full bg-brand-500/6 blur-[60px] -z-10 animate-pulse" style={{animationDuration: '4s'}} />
          )}

          <div
            ref={playerRef}
            onMouseMove={handleTiltMove}
            onMouseEnter={handleTiltEnter}
            onMouseLeave={handleTiltLeave}
            style={{
              transform: isTiltHovered
                ? `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`
                : 'perspective(800px) rotateX(0deg) rotateY(0deg)',
              transition: isTiltHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
            }}
            className={cn(
              'relative rounded-2xl overflow-hidden',
              'shadow-[0_8px_32px_rgba(0,0,0,0.3),0_1px_0_hsl(var(--brand-400)/0.06)_inset]',
              'border',
              isPlaying && hasTrack
                ? 'border-brand-400/25'
                : 'border-white/15 dark:border-white/10',
              // ── Deep translucent glass ──
              'bg-white/90 dark:bg-[#0a0e1a]/85',
              'backdrop-blur-[36px] saturate-[2]',
              'transition-all duration-300',
              'hover:-translate-y-0.5',
              'hover:shadow-[0_12px_40px_rgba(0,0,0,0.35),0_1px_0_hsl(var(--brand-400)/0.08)_inset]',
            )}>
            {/* ── Glass shine ── */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/50 dark:from-white/[0.04] via-transparent to-transparent" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-brand-400/[0.03] via-transparent to-brand-300/[0.03]" />

            {/* ── Progress bar at top ── */}
            {hasTrack && (
              <div
                ref={progressRef}
                className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 cursor-pointer group z-20
                  before:absolute before:inset-x-0 before:-top-2 before:-bottom-2 sm:before:-top-1 sm:before:-bottom-1"
                onMouseDown={handleProgressMouseDown}
                onTouchStart={(e) => { setIsDragging(true); handleProgressInteraction(e); }}
                onTouchMove={handleProgressInteraction}
                onTouchEnd={() => setIsDragging(false)}
                onMouseMove={(e) => {
                  if (!progressRef.current || !duration) return;
                  const rect = progressRef.current.getBoundingClientRect();
                  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  setHoverProgress(ratio * duration);
                }}
                onMouseLeave={() => setHoverProgress(null)}
              >
                <div className="h-full bg-black/[0.08] dark:bg-white/[0.08]">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-300 relative transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 animate-shimmer-slide">
                      <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]" />
                    </div>
                    <div className={cn(
                      'absolute right-0 top-1/2 -translate-y-1/2',
                      'w-2.5 h-2.5 rounded-full bg-white',
                      'shadow-[0_0_8px_hsl(var(--brand-400)/0.5)]',
                      'opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100',
                      isDragging && 'opacity-100 scale-100',
                    )} />
                  </div>
                </div>
                {hoverProgress !== null && (
                  <div className="absolute -top-5 -translate-x-1/2 text-[9px] text-white/80 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded font-mono pointer-events-none whitespace-nowrap"
                    style={{ left: `${(hoverProgress / duration) * 100}%` }}
                  >
                    {formatTime(hoverProgress)}
                  </div>
                )}
              </div>
            )}

            {/* ── Content ── */}
            <div className={cn('relative z-10', hasTrack ? 'pt-2.5 pb-1.5 sm:pb-2 px-2.5 sm:px-4' : 'py-2.5 px-3 sm:px-4')}>
              {hasTrack ? (
                <div className={cn(
                  'flex flex-col',
                  // On mobile: stack info+controls, then progress
                  'gap-1 sm:gap-0',
                )}>
                  {/* ── ROW 1: Info + Controls ── */}
                  <div className="flex items-center justify-between gap-1.5 sm:gap-3">
                    {/* LEFT: Album art + Info */}
                    <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
                      <div className={cn(
                        'relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg overflow-hidden shrink-0',
                        'bg-brand-400/10 shadow-[0_2px_8px_rgba(0,0,0,0.15)]',
                        isPlaying && 'shadow-[0_0_12px_hsl(var(--brand-400)/0.2)]',
                      )}>
                        {currentTrack.albumArt ? (
                          <img src={currentTrack.albumArt} alt={currentTrack.title} className="w-full h-full object-cover" onError={handleThumbnailError} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Disc3 size={16} className="text-brand-400/40" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 max-w-[110px] sm:max-w-[140px] md:max-w-[180px]">
                        <p className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">
                          {currentTrack.title}
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate leading-tight mt-0.5">
                          {currentTrack.artist}
                        </p>
                      </div>
                      {/* Playing indicator (desktop only) */}
                      {isPlaying ? (
                        <div className="hidden sm:block"><MiniEqualizer /></div>
                      ) : (
                        <div className="hidden sm:block w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600" />
                      )}
                    </div>

                    {/* RIGHT: Controls */}
                    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                      {/* Prev (desktop) */}
                      <button onClick={prev}
                        className="hidden sm:flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-300 hover:bg-brand-400/10 transition-all hover:scale-110 active:scale-90"
                        aria-label="Previous"
                      >
                        <SkipBack size={12} />
                      </button>

                      <div className="relative flex items-center justify-center">
                        {isPlaying && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-brand-500/15 animate-player-pulse-ring" />
                          </div>
                        )}
                        <button onClick={togglePlay}
                          className={cn(
                            'relative flex items-center justify-center w-10 h-10 sm:w-8 sm:h-8 rounded-full text-white transition-all active:scale-90 z-10 hover:scale-105',
                            isPlaying
                              ? 'bg-brand-500 shadow-[0_0_12px_hsl(var(--brand-400)/0.35)] hover:shadow-[0_0_20px_hsl(var(--brand-400)/0.5)]'
                              : 'bg-brand-500 shadow-[0_0_8px_hsl(var(--brand-400)/0.25)] hover:shadow-[0_0_16px_hsl(var(--brand-400)/0.4)]'
                          )}
                          aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                        </button>
                      </div>

                      {/* Next (desktop) */}
                      <button onClick={next}
                        className="hidden sm:flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-300 hover:bg-brand-400/10 transition-all hover:scale-110 active:scale-90"
                        aria-label="Next"
                      >
                        <SkipForward size={12} />
                      </button>

                      {/* Time (mobile) */}
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono sm:hidden min-w-[32px] text-center">
                        {formatTime(currentTime)}
                      </span>

                      {/* Loop toggle */}
                      <button onClick={toggleLoop}
                        className={cn(
                          'flex items-center justify-center w-8 h-8 sm:w-7 sm:h-7 rounded-full transition-all hover:scale-110 active:scale-90',
                          isLooping
                            ? 'text-brand-400 bg-brand-400/12'
                            : 'text-gray-500 dark:text-gray-400 hover:text-brand-400 hover:bg-brand-400/10'
                        )}
                        aria-label="Toggle loop"
                      >
                        {isLooping ? <Repeat1 size={12} /> : <Repeat size={12} />}
                      </button>

                      {/* Fullscreen */}
                      {hasTrack && (
                        <button onClick={toggleFullscreen}
                          className="flex items-center justify-center w-8 h-8 sm:w-7 sm:h-7 rounded-full text-gray-500 dark:text-gray-400 hover:text-brand-400 hover:bg-brand-400/10 transition-all hover:scale-110 active:scale-90"
                          aria-label="Fullscreen"
                        >
                          <Maximize2 size={12} />
                        </button>
                      )}

                      {/* Volume (desktop) */}
                      <div
                        ref={volumeContainerRef}
                        className="relative hidden md:block"
                        onMouseEnter={handleVolumeEnter}
                        onMouseLeave={handleVolumeLeave}
                      >
                        <button
                          className="flex items-center justify-center w-7 h-7 rounded-full text-gray-500 dark:text-gray-400 hover:text-brand-400 hover:bg-brand-400/10 transition-all hover:scale-110 active:scale-90"
                          aria-label="Volume"
                        >
                          <VolumeIcon volume={volume} />
                        </button>
                        {showVolume && (
                          <div
                            onMouseEnter={handleVolumeEnter}
                            onMouseLeave={handleVolumeLeave}
                            className="absolute right-full top-1/2 -translate-y-1/2 mr-2 p-2 rounded-xl bg-white/90 dark:bg-[#0a0e1a]/90 backdrop-blur-[24px] border border-white/20 dark:border-brand-400/15 shadow-lg animate-in fade-in zoom-in-95 slide-in-from-right-2 duration-150"
                          >
                            <input type="range" min={0} max={1} step={0.01}
                              value={volume}
                              onChange={(e) => setVolume(parseFloat(e.target.value))}
                              className="w-16 h-1 appearance-none bg-black/10 dark:bg-white/10 rounded-full cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
                                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-400
                                [&::-webkit-slider-thumb]:shadow-[0_0_6px_hsl(var(--brand-400)/0.5)]
                                [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full
                                [&::-moz-range-thumb]:bg-brand-400 [&::-moz-range-thumb]:border-0"
                              aria-label="Volume"
                            />
                          </div>
                        )}
                      </div>

                      {/* Search */}
                      <button onClick={toggleSearch}
                        className="flex items-center justify-center w-8 h-8 sm:w-7 sm:h-7 rounded-full text-gray-500 dark:text-gray-400 hover:text-brand-400 hover:bg-brand-400/10 transition-all hover:scale-110 active:scale-90"
                        aria-label="Search music"
                      >
                        <Search size={12} />
                      </button>

                      {/* Mobile next */}
                      <button onClick={next}
                        className="flex sm:hidden items-center justify-center w-8 h-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-brand-300 transition-all hover:scale-110 active:scale-90"
                        aria-label="Next"
                      >
                        <SkipForward size={12} />
                      </button>
                    </div>
                  </div>

                  {/* ── ROW 2: Mobile progress bar strip ── */}
                  <div className="flex sm:hidden items-center gap-2 px-0.5">
                    <div
                      ref={mobileProgressRef}
                      className="flex-1 h-1.5 bg-black/[0.08] dark:bg-white/[0.08] rounded-full cursor-pointer group relative"
                      onTouchStart={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                        if (!mobileProgressRef.current || !duration) return;
                        const rect = mobileProgressRef.current.getBoundingClientRect();
                        const ratio = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
                        seek(ratio * duration);
                      }}
                      onTouchMove={(e) => {
                        e.preventDefault();
                        if (!mobileProgressRef.current || !duration || !isDragging) return;
                        const rect = mobileProgressRef.current.getBoundingClientRect();
                        const ratio = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
                        seek(ratio * duration);
                      }}
                      onTouchEnd={() => setIsDragging(false)}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-300 rounded-full relative transition-all duration-75"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono min-w-[32px] text-right">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>
              ) : (
                /* ── Idle state ── */
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-brand-400/10 flex items-center justify-center">
                      <Music size={15} className="text-brand-400/50" />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">No track playing</span>
                  </div>
                  <button onClick={toggleSearch}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-brand-500 dark:text-brand-300 bg-brand-500/15 border border-brand-400/20 hover:bg-brand-500/25 transition-all hover:scale-105 active:scale-95"
                  >
                    <Search size={11} />
                    Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
