'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Minimize2,
  Music2,
  Repeat,
  Repeat1,
  Tv2,
  Video,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMusicPlayer, fetchFromPiped, handleThumbnailError } from './MusicPlayerContext';

/* ─── Helpers ─── */
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getActiveLyricIndex(lines: LyricLine[], time: number): number {
  let idx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (time >= lines[i].time) idx = i;
  }
  return idx;
}

/* ─── Generate mood hue from track metadata ─── */
function getTrackMood(title: string, artist: string): number {
  const str = title + artist;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const raw = Math.abs(hash) % 360;
  if (raw > 100 && raw < 160) return (raw + 80) % 360;
  return raw;
}

/* ─── LRC Lyrics Parser ─── */
interface LyricLine {
  time: number;
  text: string;
}

function parseLRC(lrc: string): LyricLine[] {
  const lines = lrc.split('\n');
  const result: LyricLine[] = [];
  const regex = /\[(\d+):(\d+[.:]\d+)\](.*)/;
  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const raw = match[2].replace(':', '.');
      const seconds = parseFloat(raw);
      const text = match[3].trim();
      if (text) result.push({ time: minutes * 60 + seconds, text });
    }
  }
  return result;
}

/* ─── Clean artist name for lyrics lookup ─── */
function cleanArtistName(name: string): string {
  return name
    .replace(/ - Topic$/, '')
    .replace(/ • Topic$/, '')
    .replace(/VEVO$/, '')
    .replace(/ - VEVO$/, '')
    .replace(/ - Vevo$/, '')
    .replace(/Official$/, '')
    .replace(/Official Channel$/, '')
    .trim();
}

/* ─── Fetch lyrics from LRCLIB with fallback chain ─── */
async function fetchLyricsFromAPI(
  artist: string,
  title: string,
  duration: number,
  signal?: AbortSignal
): Promise<{ synced?: string; plain?: string } | null> {
  const cleaned = cleanArtistName(artist);
  const timeout = { signal: signal || AbortSignal.timeout(6000) };

  // Strategy 1: Exact match via LRCLIB get endpoint
  try {
    const url = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(cleaned)}&track_name=${encodeURIComponent(title)}`;
    const res = await fetch(url, timeout);
    if (res.ok) {
      const data = await res.json();
      if (data?.syncedLyrics) return { synced: data.syncedLyrics };
      if (data?.plainLyrics) return { plain: data.plainLyrics };
    }
  } catch { /* fall through */ }

  // Strategy 2: Search LRCLIB with track + artist
  try {
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(title + ' ' + cleaned)}`;
    const res = await fetch(searchUrl, timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const valid = data.filter((d: any) => !d.instrumental && d.name && d.artistName);
        if (valid.length > 0) {
          const best = valid[0];
          const detailRes = await fetch(`https://lrclib.net/api/get?id=${best.id}`, timeout);
          if (detailRes.ok) {
            const detail = await detailRes.json();
            if (detail?.syncedLyrics) return { synced: detail.syncedLyrics };
            if (detail?.plainLyrics) return { plain: detail.plainLyrics };
          }
        }
      }
    }
  } catch { /* fall through */ }

  // Strategy 3: Search with just the track name
  try {
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(title)}`;
    const res = await fetch(searchUrl, timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const matching = data.filter(
          (d: any) => !d.instrumental && d.artistName?.toLowerCase().includes(cleaned.toLowerCase())
        );
        if (matching.length > 0) {
          const detailRes = await fetch(`https://lrclib.net/api/get?id=${matching[0].id}`, timeout);
          if (detailRes.ok) {
            const detail = await detailRes.json();
            if (detail?.syncedLyrics) return { synced: detail.syncedLyrics };
            if (detail?.plainLyrics) return { plain: detail.plainLyrics };
          }
        }
        const first = data.find((d: any) => !d.instrumental);
        if (first) {
          const detailRes = await fetch(`https://lrclib.net/api/get?id=${first.id}`, timeout);
          if (detailRes.ok) {
            const detail = await detailRes.json();
            if (detail?.syncedLyrics) return { synced: detail.syncedLyrics };
            if (detail?.plainLyrics) return { plain: detail.plainLyrics };
          }
        }
      }
    }
  } catch { /* fall through */ }

  return null;
}

/* ─── Fetch plain lyrics from lyrics.ovh (last resort) ─── */
async function fetchPlainFallback(artist: string, title: string): Promise<string | null> {
  try {
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data?.lyrics) return data.lyrics;
    }
  } catch { /* fail silently */ }
  return null;
}

/* ─── Component ─── */
export function FullscreenPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    togglePlay,
    next,
    prev,
    setVolume,
    seek,
    toggleFullscreen,
    isFullscreen,
    isLooping,
    toggleLoop,
    toggleSearch,
  } = useMusicPlayer();

  const [progressHover, setProgressHover] = useState<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [lyricsError, setLyricsError] = useState(false);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [officialVideoId, setOfficialVideoId] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const hasTrack = !!currentTrack;

  // ── Track mood (dynamic hue for lighting) ──
  const moodHue = useMemo(() => {
    if (!currentTrack) return 240;
    return getTrackMood(currentTrack.title, currentTrack.artist);
  }, [currentTrack?.title, currentTrack?.artist]);

  // ── Fetch synced lyrics from LRCLIB ──
  useEffect(() => {
    if (!currentTrack?.artist || !currentTrack?.title) return;
    setLyrics([]);
    setLyricsError(false);

    let cancelled = false;
    const track = currentTrack;

    async function doFetch() {
      if (!track) return;
      setLyricsLoading(true);
      try {
        const result = await fetchLyricsFromAPI(track.artist, track.title, track.duration);
        if (cancelled) return;

        if (result?.synced) {
          setLyrics(parseLRC(result.synced));
          setLyricsLoading(false);
          return;
        }

        if (result?.plain) {
          const plainLines = result.plain.split('\n').filter((l: string) => l.trim());
          const avgLineDuration = (track.duration || 240) / plainLines.length;
          setLyrics(plainLines.map((l: string, i: number) => ({
            time: i * avgLineDuration,
            text: l.trim(),
          })));
          setLyricsLoading(false);
          return;
        }

        const plainFallback = await fetchPlainFallback(track.artist, track.title);
        if (cancelled) return;

        if (plainFallback) {
          const plainLines = plainFallback.split('\n').filter((l: string) => l.trim());
          const avgLineDuration = (track.duration || 240) / plainLines.length;
          setLyrics(plainLines.map((l: string, i: number) => ({
            time: i * avgLineDuration,
            text: l.trim(),
          })));
        } else {
          setLyricsError(true);
        }
      } catch {
        if (!cancelled) setLyricsError(true);
      } finally {
        if (!cancelled) setLyricsLoading(false);
      }
    }

    doFetch();
    return () => { cancelled = true; };
  }, [currentTrack?.artist, currentTrack?.title, currentTrack?.duration]);

  // ── Auto-scroll lyrics ──
  useEffect(() => {
    if (!lyricsContainerRef.current || lyrics.length === 0) return;
    const activeIdx = getActiveLyricIndex(lyrics, currentTime);
    const activeEl = lyricsContainerRef.current.querySelector(`[data-lyric-idx="${activeIdx}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTime, lyrics]);

  // ── Progress ──
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
    const handleUp = () => {
      setIsDragging(false);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, duration, seek]);

  // ── Fetch official music video from Piped (non-Topic) ──
  const fetchOfficialVideo = useCallback(async (trackTitle: string, trackArtist: string) => {
    setVideoLoading(true);
    try {
      const query = `${trackTitle} ${trackArtist} official music video`;
      const res = await fetchFromPiped(`/search?q=${encodeURIComponent(query)}&filter=videos`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data?.items || !Array.isArray(data.items)) return;

      const topicPattern = / - Topic$| • Topic$/i;
      const video = data.items.find(
        (item: any) =>
          (item.url?.includes('v=') || item.videoId) &&
          !topicPattern.test(item.uploaderName || '') &&
          !topicPattern.test(item.uploader || '')
      );

      if (video) {
        const vid = video.url?.split('v=')[1] || video.videoId || '';
        if (vid) setOfficialVideoId(vid);
      }
    } catch {
      // Fail silently
    } finally {
      setVideoLoading(false);
    }
  }, []);

  // ── Auto-fetch and show music video background when entering fullscreen ──
  useEffect(() => {
    if (!isFullscreen) return;
    if (!currentTrack?.videoId && !currentTrack?.title) return;
    setShowVideo(true);
    setOfficialVideoId(null);
    if (!currentTrack.videoId && currentTrack?.title && currentTrack?.artist) {
      fetchOfficialVideo(currentTrack.title, currentTrack.artist);
    }
  }, [isFullscreen]);

  // ── Re-fetch video background when track changes while in fullscreen ──
  const prevTrackIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!isFullscreen) return;
    const trackId = currentTrack?.id;
    if (!trackId || trackId === prevTrackIdRef.current) return;
    prevTrackIdRef.current = trackId;
    setShowVideo(true);
    setOfficialVideoId(null);
    if (currentTrack?.title && currentTrack?.artist) {
      fetchOfficialVideo(currentTrack.title, currentTrack.artist);
    }
  }, [isFullscreen, currentTrack?.id]);

  // ── Handle video toggle ──
  const handleVideoToggle = useCallback(() => {
    if (showVideo) {
      setShowVideo(false);
      return;
    }
    if (officialVideoId || !currentTrack) {
      setShowVideo(true);
      return;
    }
    setShowVideo(true);
    fetchOfficialVideo(currentTrack.title, currentTrack.artist);
  }, [showVideo, officialVideoId, currentTrack, fetchOfficialVideo]);

  const displayVideoId = officialVideoId || currentTrack?.videoId || '';

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ── Video background: cycle through short segments (8s each) from different sections ──
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const SEGMENT_MS = 8000;
  const [seekIdx, setSeekIdx] = useState(0);

  // Generate seek positions spread across the video (skip intro/outro)
  const seekPositions = useMemo(() => {
    if (!displayVideoId || duration <= 0) return [60];
    const count = 8;
    const startBound = Math.max(15, duration * 0.15);
    const endBound = duration * 0.88;
    const range = endBound - startBound;
    if (range <= 20) return [Math.floor(startBound)];
    const positions: number[] = [];
    const step = range / (count + 1);
    for (let i = 0; i < count; i++) {
      positions.push(Math.floor(startBound + step * (i + 1)));
    }
    return positions;
  }, [displayVideoId, duration]);

  // Reset position index when video changes
  useEffect(() => { setSeekIdx(0); }, [displayVideoId]);

  // Cycle through positions every SEGMENT_MS
  useEffect(() => {
    if (!showVideo || !displayVideoId || seekPositions.length <= 1) return;
    const interval = setInterval(() => {
      setSeekIdx((prev) => (prev + 1) % seekPositions.length);
    }, SEGMENT_MS);
    return () => clearInterval(interval);
  }, [showVideo, displayVideoId, seekPositions.length]);

  // Seek to current position via YouTube postMessage API (no iframe reload / flicker)
  useEffect(() => {
    if (!showVideo || !displayVideoId || !iframeRef.current || seekPositions.length === 0) return;
    const target = seekPositions[seekIdx];
    if (target == null) return;
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [target, true] }),
        '*'
      );
    } catch { /* ignore */ }
  }, [showVideo, seekIdx, displayVideoId, seekPositions]);

  const firstPos = seekPositions[0] ?? 60;
  const videoSrc = showVideo && displayVideoId
    ? `https://www.youtube.com/embed/${displayVideoId}?autoplay=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&playsinline=1&mute=1&modestbranding=1&cc_load_policy=0&fs=0&enablejsapi=1&start=${firstPos}`
    : '';

  if (!isFullscreen) return null;

  const activeLyricIdx = getActiveLyricIndex(lyrics, currentTime);

  const moodGlow1 = `radial-gradient(circle, hsla(${moodHue}, 65%, 55%, 0.12) 0%, transparent 70%)`;
  const moodGlow2 = `radial-gradient(circle, hsla(${(moodHue + 50) % 360}, 60%, 50%, 0.07) 0%, transparent 70%)`;
  const albumGlowColor = `hsla(${moodHue}, 65%, 55%, 0.08)`;

  const panel = (
    <div className="fixed inset-0 z-[10000] flex flex-col overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-black" />

      {/* ── Music Video Background (blurred) ── */}
      {showVideo && displayVideoId && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Cover-technique iframe: scales to keep video center visible at any aspect ratio */}
          <iframe
            ref={iframeRef}
            src={videoSrc}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              height: '56.25vw',
              minWidth: '177.78vh',
              minHeight: '100vh',
              filter: 'blur(10px) brightness(0.45) saturate(0.85)',
            }}
            allow="autoplay; encrypted-media"
            title=""
          />
          {/* Dark gradient overlay to further obscure YouTube UI remnants */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>
      )}

      {/* ── Multi-layer ambient glow ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full animate-ambient-glow"
          style={{
            opacity: showVideo ? 0.06 : 0.15,
            background: moodGlow1,
            transition: 'background 1.2s ease, opacity 1.2s ease',
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-8 animate-ambient-glow"
          style={{
            animationDelay: '2s',
            background: moodGlow2,
            transition: 'background 1.2s ease',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full w-full overflow-y-auto">
        <div className="flex flex-col h-full w-full max-w-6xl mx-auto px-3 sm:px-8 py-3 sm:py-6">
          {/* Top bar */}
          <div className="flex items-center justify-between shrink-0 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-xs font-semibold text-white/50 tracking-[0.2em] uppercase">
                Now Playing
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Search songs */}
              <button
                onClick={toggleSearch}
                className="flex items-center justify-center w-9 h-9 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-90"
                aria-label="Search songs"
                title="Search songs"
              >
                <Search size={15} />
              </button>
              {/* Music video toggle */}
              {displayVideoId && (
                <button
                  onClick={handleVideoToggle}
                  disabled={videoLoading}
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-full transition-all hover:scale-110 active:scale-90',
                    showVideo
                      ? 'text-brand-400 bg-brand-400/15 ring-1 ring-brand-400/30'
                      : 'text-white/40 hover:text-white hover:bg-white/10'
                  )}
                  aria-label={showVideo ? 'Hide music video' : 'Show music video'}
                  title={showVideo ? 'Hide music video' : 'Show official music video as background'}
                >
                  {videoLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-brand-400/30 border-t-brand-400 animate-spin" />
                  ) : showVideo ? (
                    <Video size={15} />
                  ) : (
                    <Tv2 size={15} />
                  )}
                </button>
              )}
              <button
                onClick={toggleFullscreen}
                className="flex items-center justify-center w-9 h-9 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-90"
                aria-label="Exit fullscreen"
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex items-center justify-center py-1 sm:py-4">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-16 w-full max-w-5xl">
              {/* Left: Album art */}
              <div className="relative shrink-0">
                <div className={cn(
                  'relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden',
                  'shadow-[0_24px_80px_rgba(0,0,0,0.7)]',
                  'border border-white/[0.08]',
                  isPlaying && 'animate-spin-slow',
                  !isPlaying && 'transition-transform duration-700',
                )}
                style={{ animationDuration: '8s' }}>
                  {currentTrack?.albumArt ? (
                    <img
                      src={currentTrack.albumArt}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                      onError={handleThumbnailError}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500/20 to-brand-600/10">
                      <Music2 size={56} className="text-brand-400/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/60 ring-2 ring-white/20 flex items-center justify-center">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-brand-400/60" />
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    'absolute -inset-3 rounded-full -z-10 blur-2xl transition-all duration-700',
                    isPlaying ? 'opacity-60' : 'opacity-15'
                  )}
                  style={{
                    background: `radial-gradient(ellipse at center, ${albumGlowColor} 0%, transparent 70%)`,
                  }}
                />
                <div
                  className={cn(
                    'absolute -inset-6 rounded-full -z-10 blur-3xl transition-all duration-700',
                    isPlaying ? 'opacity-40' : 'opacity-5'
                  )}
                  style={{
                    background: `radial-gradient(ellipse at center, ${albumGlowColor.replace('0.08', '0.04')} 0%, transparent 70%)`,
                  }}
                />
              </div>

              {/* Right: Info + Controls + Lyrics */}
              <div className="flex flex-col gap-4 sm:gap-5 w-full max-w-lg text-center sm:text-left">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-white leading-tight line-clamp-2">
                    {currentTrack?.title || 'No track'}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-white/50 mt-1 font-medium tracking-wide">
                    {currentTrack?.artist || 'Unknown artist'}
                  </p>
                  {currentTrack?.uploader && (
                    <p className="text-[10px] sm:text-[11px] text-white/25 mt-1 tracking-wide">
                      {currentTrack.uploader}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div
                    ref={progressRef}
                    className="w-full h-2 sm:h-1 bg-white/15 rounded-full cursor-pointer group relative"
                    onMouseDown={handleProgressMouseDown}
                    onMouseMove={(e) => {
                      if (!progressRef.current || !duration) return;
                      const rect = progressRef.current.getBoundingClientRect();
                      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      setProgressHover(ratio * duration);
                    }}
                    onMouseLeave={() => setProgressHover(null)}
                    onTouchStart={(e) => { setIsDragging(true); handleProgressInteraction(e); }}
                    onTouchMove={handleProgressInteraction}
                    onTouchEnd={() => setIsDragging(false)}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-75 relative"
                      style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(to right, hsl(var(--brand-hue), 70%, 45%), hsl(var(--brand-hue), 70%, 55%))',
                        transition: 'background 1.2s ease',
                      }}
                    >
                      <div
                        className={cn(
                          'absolute right-0 top-1/2 -translate-y-1/2',
                          'w-2.5 h-2.5 rounded-full bg-white',
                          'shadow-[0_0_10px_hsla(var(--brand-hue),75%,50%,0.6)]',
                          'opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100'
                        )}
                      />
                    </div>
                    {progressHover !== null && (
                      <div
                        className="absolute -top-6 -translate-x-1/2 text-[10px] text-white/70 bg-white/10 backdrop-blur-sm px-1.5 py-0.5 rounded font-mono pointer-events-none"
                        style={{ left: `${(progressHover / duration) * 100}%` }}
                      >
                        {formatTime(progressHover)}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-white/40">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
                  <button
                    onClick={prev}
                    className="flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-90"
                    aria-label="Previous"
                  >
                    <SkipBack size={18} />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                  </button>
                  <button
                    onClick={next}
                    className="flex items-center justify-center w-9 h-9 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all hover:scale-110 active:scale-90"
                    aria-label="Next"
                  >
                    <SkipForward size={18} />
                  </button>
                  <button onClick={toggleLoop}
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full transition-all',
                      isLooping
                        ? 'text-brand-400 bg-brand-400/15'
                        : 'text-white/40 hover:text-white hover:bg-white/10'
                    )}
                    aria-label="Toggle loop"
                  >
                    {isLooping ? <Repeat1 size={14} /> : <Repeat size={14} />}
                  </button>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setVolume(volume === 0 ? 0.9 : 0)}
                      className="text-white/40 hover:text-white transition-colors shrink-0"
                      aria-label="Toggle mute"
                    >
                      {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    </button>
                    <input
                      type="range" min={0} max={1} step={0.01}
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-16 sm:w-20 h-1 appearance-none bg-white/20 rounded-full cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(0,0,0,0.3)]
                        [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
                      aria-label="Volume"
                    />
                  </div>
                </div>

                {/* Glass card container for lyrics */}
                <div className="relative rounded-2xl bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.06] overflow-hidden">
                  {/* Glass sheen */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-400/[0.02] via-transparent to-brand-300/[0.02]" />
                  </div>

                  <div
                    ref={lyricsContainerRef}
                    className="relative z-10 min-h-0 max-h-[180px] sm:max-h-[240px] overflow-y-auto p-4"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
                  >
                    {lyricsLoading && (
                      <div className="flex items-center justify-center h-full py-8">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-brand-400/30 border-t-brand-400 animate-spin" />
                          <p className="text-xs text-white/30">Loading lyrics...</p>
                        </div>
                      </div>
                    )}

                    {lyricsError && lyrics.length === 0 && !lyricsLoading && (
                      <div className="flex items-center justify-center h-full py-8">
                        <p className="text-xs text-white/30 italic">No synced lyrics available</p>
                      </div>
                    )}

                    {!lyricsLoading && lyrics.length === 0 && !lyricsError && (
                      <div className="flex items-center justify-center h-full py-8">
                        <div className="text-center">
                          <Music2 size={20} className="mx-auto text-white/20 mb-2" />
                          <p className="text-xs text-white/30">Lyrics will appear here</p>
                        </div>
                      </div>
                    )}

                    {lyrics.length > 0 && (
                      <div className="space-y-3">
                        {lyrics.map((line, i) => {
                          const isActive = i === activeLyricIdx;
                          const isPast = i < activeLyricIdx;
                          return (
                            <p key={i} data-lyric-idx={i}
                              className={cn(
                                'text-sm leading-relaxed transition-all duration-300 text-center sm:text-left',
                                isActive ? 'text-white font-semibold scale-[1.02]' : isPast ? 'text-white/25' : 'text-white/40'
                              )}
                            >
                              {line.text}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] text-white/20">
                  <span className="w-1 h-1 rounded-full bg-brand-400/50" />
                  <span>Synced lyrics via LRCLIB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-2 shrink-0" />
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return panel;
  return createPortal(panel, document.body);
}
