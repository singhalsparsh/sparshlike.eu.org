'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  Heart,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMusicPlayer, handleThumbnailError } from './MusicPlayerContext';
import { FullscreenPlayer } from './FullscreenPlayer';
import { SearchModal } from './SearchModal';


/* ─── Helpers ─── */
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function VolumeIcon({ volume }: { volume: number }) {
  if (volume === 0) return <VolumeX size={14} />;
  if (volume < 0.5) return <Volume1 size={14} />;
  return <Volume2 size={14} />;
}

/* ─── Like button with local persistence ─── */
function useLiked(trackId: string | undefined) {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (!trackId) { setLiked(false); return; }
    try { setLiked(localStorage.getItem(`mp_liked_${trackId}`) === 'true'); } catch { setLiked(false); }
  }, [trackId]);
  const toggle = useCallback(() => {
    const next = !liked;
    setLiked(next);
    if (trackId) try { localStorage.setItem(`mp_liked_${trackId}`, String(next)); } catch {}
  }, [liked, trackId]);
  return [liked, toggle] as const;
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

  // ── Like state using the custom hook ──
  const [isLiked, toggleLike] = useLiked(currentTrack?.id);

  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [menuPos, setMenuPos] = useState<{ bottom: number; right: number } | null>(null);
  const desktopMenuBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);
  const showMenuRef = useRef(false);
  showMenuRef.current = showMenu;

  const toggleMenu = useCallback(() => {
    if (showMenuRef.current) {
      setShowMenu(false);
      setMenuPos(null);
    } else {
      const btn = desktopMenuBtnRef.current ?? mobileMenuBtnRef.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        // bottom = distance from bottom of viewport to button's top edge + small gap
        // This makes the menu extend UPWARD from the button
        setMenuPos({ bottom: window.innerHeight - rect.top + 4, right: window.innerWidth - rect.right });
      }
      setShowMenu(true);
    }
  }, []);

  const hasTrack = !!currentTrack;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ── Progress interaction ──
  const handleProgressInteraction = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      seek(ratio * duration);
    },
    [duration, seek],
  );

  const handleProgressMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
      handleProgressInteraction(e);
    },
    [handleProgressInteraction],
  );

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

  // ── Menu: backdrop click closes it (rendered below in the menu JSX) ──
  // No window event listener needed — a transparent overlay catches clicks.

  // ── Keyboard shortcuts ──
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  // Stable refs so the effect doesn't re-register on every play/pause
  const togglePlayRef = useRef(togglePlay);
  togglePlayRef.current = togglePlay;
  const toggleSearchRef = useRef(toggleSearch);
  toggleSearchRef.current = toggleSearch;
  const toggleLoopRef = useRef(toggleLoop);
  toggleLoopRef.current = toggleLoop;
  const prevRef = useRef(prev);
  prevRef.current = prev;
  const nextRef = useRef(next);
  nextRef.current = next;
  const toggleFullscreenRef = useRef(toggleFullscreen);
  toggleFullscreenRef.current = toggleFullscreen;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      const isMod = e.ctrlKey || e.metaKey;

      // Don't fire player shortcuts when shortcuts help is open
      if (showShortcuts && e.code !== 'Escape') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayRef.current();
          break;
        case 'Equal':
        case 'NumpadAdd':
          if (isMod) {
            e.preventDefault();
            setVolume(Math.min(1, volumeRef.current + 0.1));
          }
          break;
        case 'Minus':
        case 'NumpadSubtract':
          if (isMod) {
            e.preventDefault();
            setVolume(Math.max(0, volumeRef.current - 0.1));
          }
          break;
        case 'KeyF':
          if (e.altKey) {
            e.preventDefault();
            toggleSearchRef.current();
          }
          break;
        case 'KeyL':
          if (e.altKey) {
            e.preventDefault();
            toggleLoopRef.current();
          }
          break;
        case 'F11':
        case 'KeyF':
          if (e.shiftKey) {
            e.preventDefault();
            toggleFullscreenRef.current();
          }
          break;
        case 'Slash':
          if (!isMod) {
            e.preventDefault();
            toggleSearchRef.current();
          }
          break;
        case 'ArrowLeft':
          if (isMod) {
            e.preventDefault();
            prevRef.current();
          }
          break;
        case 'ArrowRight':
          if (isMod) {
            e.preventDefault();
            nextRef.current();
          }
          break;
        case 'Escape':
          if (showShortcuts) {
            e.preventDefault();
            setShowShortcuts(false);
          }
          break;
      }
    };

    // Use capture phase so our handler fires before the browser processes Alt+ shortcuts
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [setVolume, showShortcuts]); // stable deps — refs avoid stale closures

  // ── Brand hue dynamic styling ──
  const brandBg = `linear-gradient(135deg, hsla(var(--brand-hue), 75%, 42%, 1), hsla(var(--brand-hue), 75%, 55%, 1))`;

  return (
    <div className="contents">
      <SearchModal />
      <FullscreenPlayer />

      <div className="fixed bottom-0 sm:bottom-5 left-0 sm:left-1/2 sm:-translate-x-1/2 z-[60] w-full pointer-events-none">
        <div className="mx-auto w-full sm:max-w-[640px] md:max-w-[720px] lg:max-w-[840px] xl:max-w-[960px] pointer-events-auto relative px-0 sm:px-4">
          {/* Ambient glow behind the card */}
          {isPlaying && hasTrack && (
            <div
              className="absolute -inset-10 rounded-full blur-[90px] -z-10 transition-all duration-700"
              style={{
                background: `radial-gradient(circle, hsla(var(--brand-hue), 75%, 55%, 0.07) 0%, transparent 70%)`,
                opacity: isPlaying ? 1 : 0,
              }}
            />
          )}

          {/* ── Player card ── */}
          <div
            className={cn(
              'relative rounded-2xl overflow-hidden', // card clips children; menu rendered outside
              'bg-white/90 dark:bg-[#0a0e1a]/80',
              'backdrop-blur-[48px] saturate-[1.8]',
              'border',
              isPlaying && hasTrack
                ? 'border-brand-400/20'
                : 'border-white/15 dark:border-white/10',
              'shadow-[0_8px_32px_rgba(0,0,0,0.3),0_1px_0_hsl(var(--brand-400)/0.06)_inset]',
              'transition-all duration-300',
              'hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]',
            )}
          >
            {/* Liquid-glass reflections (clipped to rounded corners) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {/* Top-to-bottom sheen */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 dark:from-white/[0.05] via-transparent to-transparent" />
              {/* Horizontal brand glow sheen */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-400/[0.04] via-transparent to-brand-300/[0.04]" />
              {/* Liquid edge reflection (brighter at the very top edge) */}
              <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/20 dark:via-white/15 to-transparent" />
              {/* Bottom subtle glow when playing */}
              {isPlaying && hasTrack && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1/3"
                  style={{
                    background: `linear-gradient(to top, hsla(var(--brand-hue), 75%, 50%, 0.04) 0%, transparent 100%)`,
                  }}
                />
              )}
            </div>

            {/* ── Progress bar strip at top ── */}
            {hasTrack && (
              <div
                ref={progressRef}
                className={cn(
                  'absolute top-0 left-0 right-0 cursor-pointer z-20',
                  'h-[3px] sm:h-1',
                  // card overflow-hidden clips corners
                  'before:absolute before:inset-x-0 before:-top-3 before:-bottom-3',
                )}
                onMouseDown={handleProgressMouseDown}
                onTouchStart={(e) => {
                  setIsDragging(true);
                  handleProgressInteraction(e);
                }}
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
                <div className="h-full bg-black/[0.06] dark:bg-white/[0.06]">
                  <div
                    className="h-full relative transition-[width] duration-75"
                    style={{ width: `${progress}%`, background: brandBg }}
                  >
                    {/* Shimmer */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-0 animate-shimmer-slide">
                        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                      </div>
                    </div>
                    {/* Thumb */}
                    <div
                      className={cn(
                        'absolute right-0 top-1/2 -translate-y-1/2',
                        'w-2 h-2 rounded-full bg-white',
                        'shadow-[0_0_6px_hsla(var(--brand-hue),75%,50%,0.5)]',
                        'opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100',
                        isDragging && 'opacity-100 scale-100',
                      )}
                    />
                  </div>
                </div>
                {/* Hover time tooltip */}
                {hoverProgress !== null && (
                  <div
                    className="absolute -top-4 -translate-x-1/2 text-[9px] text-white/80 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded font-mono pointer-events-none whitespace-nowrap"
                    style={{ left: `${(hoverProgress / duration) * 100}%` }}
                  >
                    {formatTime(hoverProgress)}
                  </div>
                )}
              </div>
            )}

            {/* ── Content ── */}
            <div
              className={cn(
                'relative z-10',
                hasTrack
                  ? 'pt-4 pb-2.5 px-3 sm:px-4 lg:px-5'
                  : 'py-2.5 px-3 sm:px-4',
              )}
            >
              {hasTrack ? (
                /* ── Playing state ── */
                <>
                  {/* Desktop / tablet (md+) */}
                  <div className="hidden md:flex items-center gap-3 lg:gap-4">
                    {/* Album art */}
                    <div
                      className={cn(
                        'relative w-12 h-12 lg:w-14 lg:h-14 rounded-xl overflow-hidden shrink-0',
                        'bg-brand-400/10 shadow-[0_2px_8px_rgba(0,0,0,0.15)]',
                        isPlaying &&
                          'shadow-[0_0_14px_hsla(var(--brand-hue),75%,50%,0.2)]',
                      )}
                    >
                      {currentTrack.albumArt ? (
                        <img
                          src={currentTrack.albumArt}
                          alt={currentTrack.title}
                          className="w-full h-full object-cover"
                          onError={handleThumbnailError}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Disc3 size={18} className="text-brand-400/40" />
                        </div>
                      )}
                    </div>

                    {/* Track info + progress */}
                    <div className="flex-1 min-w-0 max-w-[260px] lg:max-w-[340px] xl:max-w-[400px]">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {currentTrack.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate leading-tight mt-0.5">
                        {currentTrack.artist}
                      </p>
                      {/* Progress bar + time */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-[3px] bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-[width] duration-75"
                            style={{ width: `${progress}%`, background: brandBg }}
                          />
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 dark:text-gray-400 shrink-0">
                          <span>{formatTime(currentTime)}</span>
                          <span className="text-gray-400 dark:text-gray-500">/</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Controls + volume */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      {/* Heart */}
                      <button
                        onClick={toggleLike}
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110 active:scale-90"
                        aria-label={isLiked ? 'Unlike' : 'Like'}
                      >
                        <Heart
                          size={14}
                          className={cn(
                            'transition-colors',
                            isLiked
                              ? 'text-red-400 fill-red-400'
                              : 'text-gray-500 dark:text-gray-400 hover:text-red-400',
                          )}
                        />
                      </button>

                      {/* Prev */}
                      <button
                        onClick={prev}
                        className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110 active:scale-90"
                        aria-label="Previous"
                      >
                        <SkipBack size={13} />
                      </button>

                      {/* Play / Pause */}
                      <div className="relative flex items-center justify-center mx-0.5">
                        {isPlaying && (
                          <div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          >
                            <div
                              className="w-9 h-9 rounded-full animate-player-pulse-ring"
                              style={{
                                background: `hsla(var(--brand-hue), 75%, 50%, 0.15)`,
                              }}
                            />
                          </div>
                        )}
                        <button
                          onClick={togglePlay}
                          className="relative flex items-center justify-center w-[34px] h-[34px] rounded-full text-white transition-all active:scale-90 z-10 hover:scale-105"
                          style={{ background: brandBg }}
                          aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? (
                            <Pause size={14} fill="currentColor" />
                          ) : (
                            <Play size={14} fill="currentColor" className="ml-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Next */}
                      <button
                        onClick={next}
                        className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110 active:scale-90"
                        aria-label="Next"
                      >
                        <SkipForward size={13} />
                      </button>

                      {/* Search */}
                      <button
                        onClick={toggleSearch}
                        className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110 active:scale-90"
                        aria-label="Search songs"
                      >
                        <Search size={13} />
                      </button>

                      {/* Menu (three dots) */}
                      <div>
                        <button
                          ref={desktopMenuBtnRef}
                          onClick={toggleMenu}
                          className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110 active:scale-90"
                          aria-label="More options"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        {/* dropdown moved to wrapper level */}
                      </div>

                      {/* Volume (desktop only) */}
                      <div className="hidden lg:flex items-center gap-1.5 ml-1.5">
                        <button
                          onClick={() => setVolume(volume === 0 ? 0.9 : 0)}
                          className="flex items-center justify-center w-7 h-7 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                          aria-label="Toggle mute"
                        >
                          <VolumeIcon volume={volume} />
                        </button>
                        <div className="w-[72px]">
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={(e) =>
                              setVolume(parseFloat(e.target.value))
                            }
                            className="w-full h-1 appearance-none bg-black/10 dark:bg-white/10 rounded-full cursor-pointer
                              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
                              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-400
                              [&::-webkit-slider-thumb]:shadow-[0_0_6px_hsla(var(--brand-hue),75%,50%,0.5)]
                              [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full
                              [&::-moz-range-thumb]:bg-brand-400 [&::-moz-range-thumb]:border-0"
                            aria-label="Volume"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile (base - sm): stacked layout */}
                  <div className="flex md:hidden flex-col gap-1.5">
                    {/* Row 1: Album + Info + Action buttons */}
                    <div className="flex items-center gap-2.5">
                      {/* Album art */}
                      <div
                        className={cn(
                          'relative w-11 h-11 rounded-xl overflow-hidden shrink-0',
                          'bg-brand-400/10 shadow-[0_2px_8px_rgba(0,0,0,0.15)]',
                          isPlaying &&
                            'shadow-[0_0_12px_hsla(var(--brand-hue),75%,50%,0.2)]',
                        )}
                      >
                        {currentTrack.albumArt ? (
                          <img
                            src={currentTrack.albumArt}
                            alt={currentTrack.title}
                            className="w-full h-full object-cover"
                            onError={handleThumbnailError}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Disc3 size={16} className="text-brand-400/40" />
                          </div>
                        )}
                      </div>

                      {/* Track info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">
                          {currentTrack.title}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate leading-tight mt-0.5">
                          {currentTrack.artist}
                        </p>
                      </div>

                      {/* Search */}
                      <button
                        onClick={toggleSearch}
                        className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110 active:scale-90 shrink-0"
                        aria-label="Search songs"
                      >
                        <Search size={13} />
                      </button>

                      {/* Heart */}
                      <button
                        onClick={toggleLike}
                        className="flex items-center justify-center w-9 h-9 rounded-full transition-all hover:scale-110 active:scale-90 shrink-0"
                        aria-label={isLiked ? 'Unlike' : 'Like'}
                      >
                        <Heart
                          size={14}
                          className={cn(
                            isLiked
                              ? 'text-red-400 fill-red-400'
                              : 'text-gray-500 dark:text-gray-400 hover:text-red-400',
                          )}
                        />
                      </button>

                      {/* Play / Pause */}
                      <button
                        onClick={togglePlay}
                        className="flex items-center justify-center w-10 h-10 rounded-full text-white shrink-0 transition-all active:scale-90"
                        style={{ background: brandBg }}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? (
                          <Pause size={15} fill="currentColor" />
                        ) : (
                          <Play size={15} fill="currentColor" className="ml-0.5" />
                        )}
                      </button>

                      {/* Next */}
                      <button
                        onClick={next}
                        className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110 active:scale-90 shrink-0"
                        aria-label="Next"
                      >
                        <SkipForward size={13} />
                      </button>

                      {/* Menu (three dots) */}
                      <div>
                        <button
                          ref={mobileMenuBtnRef}
                          onClick={toggleMenu}
                          className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-90 shrink-0"
                          aria-label="More options"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        {/* dropdown moved to wrapper level */}
                      </div>
                    </div>

                    {/* Row 2: Progress bar + time */}
                    <div className="flex items-center gap-2 px-0.5">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono min-w-[28px]">
                        {formatTime(currentTime)}
                      </span>
                      <div
                        className="flex-1 h-1.5 bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden cursor-pointer relative"
                        onTouchStart={(e) => {
                          e.preventDefault();
                          if (!progressRef.current || !duration) return;
                          const rect =
                            progressRef.current.getBoundingClientRect();
                          const ratio = Math.max(
                            0,
                            Math.min(
                              1,
                              (e.touches[0].clientX - rect.left) / rect.width,
                            ),
                          );
                          seek(ratio * duration);
                        }}
                        onTouchMove={(e) => {
                          e.preventDefault();
                          if (!progressRef.current || !duration) return;
                          const rect =
                            progressRef.current.getBoundingClientRect();
                          const ratio = Math.max(
                            0,
                            Math.min(
                              1,
                              (e.touches[0].clientX - rect.left) / rect.width,
                            ),
                          );
                          seek(ratio * duration);
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-[width] duration-75"
                          style={{ width: `${progress}%`, background: brandBg }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono min-w-[28px] text-right">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                /* ── Idle state ── */
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-brand-400/10 flex items-center justify-center">
                      <Music size={16} className="text-brand-400/50" />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                      No track playing
                    </span>
                  </div>
                  <button
                    onClick={toggleSearch}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-brand-500 dark:text-brand-300 bg-brand-500/15 border border-brand-400/20 hover:bg-brand-500/25 transition-all hover:scale-105 active:scale-95"
                  >
                    <Search size={11} />
                    Search
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* ── Menu dropdown (portal to body, simple backdrop overlay) ── */}
          {showMenu && menuPos && typeof window !== 'undefined' && createPortal(
            <>
              {/* Transparent backdrop catches all outside clicks */}
              <div
                className="fixed inset-0 z-[9998]"
                onClick={() => { setShowMenu(false); setMenuPos(null); }}
              />
              {/* Menu positioned at the calculated coordinates */}
              <div
                className="fixed z-[9999] min-w-[180px] rounded-2xl bg-white/90 dark:bg-[#0a0e1a]/85 backdrop-blur-[28px] saturate-[1.8] border border-brand-400/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] py-1.5 overflow-hidden"
                style={{ bottom: menuPos.bottom, right: menuPos.right }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Glass sheen */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/50 dark:from-white/[0.04] via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-400/[0.03] via-transparent to-brand-300/[0.03]" />
                  <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/20 dark:via-white/15 to-transparent" />
                </div>
                <button
                  onClick={() => { toggleLoop(); setShowMenu(false); setMenuPos(null); }}
                  className="relative z-10 w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="w-5 flex items-center justify-center">{isLooping ? <Repeat1 size={13} /> : <Repeat size={13} />}</span>
                  <span>{isLooping ? 'Looping (one)' : 'Loop'}</span>
                </button>
                <button
                  onClick={() => { toggleFullscreen(); setShowMenu(false); setMenuPos(null); }}
                  className="relative z-10 w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="w-5 flex items-center justify-center"><Maximize2 size={13} /></span>
                  <span>Fullscreen</span>
                </button>
                <button
                  onClick={() => { toggleSearch(); setShowMenu(false); setMenuPos(null); }}
                  className="relative z-10 w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors lg:hidden"
                >
                  <span className="w-5 flex items-center justify-center"><Search size={13} /></span>
                  <span>Search</span>
                </button>
                <button
                  onClick={() => { setShowShortcuts(true); setShowMenu(false); setMenuPos(null); }}
                  className="relative z-10 w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="w-5 flex items-center justify-center text-[11px] font-mono font-bold text-brand-400">⌘K</span>
                  <span>Keyboard Shortcuts</span>
                </button>
              </div>
            </>,
            document.body
          )}

          {/* ── Keyboard Shortcuts popup (portal to body for reliable centering) ── */}
          {showShortcuts && typeof window !== 'undefined' && createPortal(
            <>
              <div
                className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm"
                onClick={() => setShowShortcuts(false)}
              />
              <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100000] w-[320px] max-w-[90vw] rounded-2xl bg-white/95 dark:bg-[#0a0e1a]/95 backdrop-blur-[32px] saturate-[1.8] border border-brand-400/20 shadow-[0_16px_64px_rgba(0,0,0,0.5)] p-5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/50 dark:from-white/[0.04] via-transparent to-transparent" />
                  <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/20 dark:via-white/15 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
                    <button
                      onClick={() => setShowShortcuts(false)}
                      className="flex items-center justify-center w-6 h-6 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-all text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { keys: 'Space', action: 'Play / Pause' },
                      { keys: '⌘/Ctrl + +', action: 'Volume up' },
                      { keys: '⌘/Ctrl + −', action: 'Volume down' },
                      { keys: '⌘/Ctrl + ←', action: 'Previous track' },
                      { keys: '⌘/Ctrl + →', action: 'Next track' },
                      { keys: '/', action: 'Search songs' },
                      { keys: 'Shift + F', action: 'Fullscreen' },
                      { keys: 'Alt + F', action: 'Search (Alt)' },
                      { keys: 'Alt + L', action: 'Toggle loop' },
                      { keys: 'Escape', action: 'Close fullscreen / menus' },
                    ].map(({ keys, action }) => (
                      <div key={keys} className="flex items-center justify-between gap-4">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{action}</span>
                        <kbd className="shrink-0 text-[11px] font-mono font-semibold px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/20 whitespace-nowrap">
                          {keys}
                        </kbd>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-3 leading-relaxed">
                    Shortcuts disabled when typing in input fields.<br />
                    Alt+shortcuts may be captured by your browser — use <kbd className="text-[10px] font-mono font-semibold px-1 rounded bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">/</kbd> for search instead.
                  </p>
                </div>
              </div>
            </>,
            document.body
          )}
        </div>
      </div>
    </div>
  );
}