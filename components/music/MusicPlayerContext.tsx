'use client';

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

/* ─── Types ─── */
export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  videoId: string;
  duration: number;
  uploader?: string;
  isExplicit?: boolean;
}

interface MusicPlayerContextValue {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  searchResults: Track[];
  isSearchOpen: boolean;
  isSearching: boolean;
  isPlayerReady: boolean;
  isFullscreen: boolean;
  isLooping: boolean;

  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (vol: number) => void;
  seek: (time: number) => void;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
  toggleSearch: () => void;
  toggleFullscreen: () => void;
  toggleLoop: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  playFromQueue: (index: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

/* ─── Storage keys ─── */
const STORAGE_KEYS = {
  volume: 'mp_volume',
  queue: 'mp_queue',
  currentTrack: 'mp_currentTrack',
  currentTime: 'mp_currentTime',
} as const;

/* ─── Piped API (free YouTube search, no API key) ─── */
export const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://api.piped.private.coffee',
  'https://pipedapi.pufe.org',
];

export async function fetchFromPiped(path: string): Promise<Response> {
  let lastError: unknown;
  for (const instance of PIPED_INSTANCES) {
    try {
      const res = await fetch(`${instance}${path}`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) return res;
      lastError = new Error(`HTTP ${res.status} from ${instance}`);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

function pipedItemToTrack(item: any): Track {
  const videoId = item.url?.split('v=')[1] || item.videoId || '';
  const title = item.title || 'Unknown';
  // Detect explicit from API field or common title markers
  const isExplicit = !!item.isExplicit ||
    /\[explicit\]|\(explicit\)|\bexplicit\b/i.test(title);
  return {
    id: videoId,
    title,
    artist: item.uploaderName || item.uploader || 'Unknown',
    albumArt: upgradeThumbnail(item.thumbnail || item.thumbnailUrl || ''),
    videoId,
    duration: item.duration || 0,
    uploader: item.uploaderName || item.uploader || undefined,
    isExplicit,
  };
}

/* ─── Thumbnail quality upgrade ─── */
const THUMBNAIL_QUALITIES = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default'];

function upgradeThumbnail(url: string): string {
  if (!url) return '';
  // Replace any known quality with maxresdefault
  for (const q of THUMBNAIL_QUALITIES) {
    if (url.includes(q + '.jpg')) {
      return url.replace(q, 'maxresdefault');
    }
  }
  return url;
}

/** Progressive fallback for img onError: tries maxresdefault → sddefault → ... → hides */
export function handleThumbnailError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.target as HTMLImageElement;
  const src = img.src;
  if (!src) { img.style.display = 'none'; return; }
  for (let i = 0; i < THUMBNAIL_QUALITIES.length - 1; i++) {
    if (src.includes(THUMBNAIL_QUALITIES[i])) {
      img.src = src.replace(THUMBNAIL_QUALITIES[i], THUMBNAIL_QUALITIES[i + 1]);
      return;
    }
  }
  img.style.display = 'none';
}

/* ─── Extract vibrant accent hue from album art ─── */
function extractDominantHue(imageUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 100; // bigger sample for better accuracy
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(-1); return; }
        // Center-crop the image to focus on the subject
        const s = Math.min(img.width, img.height);
        const sx = (img.width - s) / 2, sy = (img.height - s) / 2;
        ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        // Weighted hue buckets — each pixel votes weighted by its saturation & vibrancy
        const buckets = new Array(36).fill(0);
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 128) continue;

          const max = Math.max(r, g, b), min = Math.min(r, g, b);
          const diff = max - min;
          const lightness = (max + min) / 2 / 255;

          // Skip near-black, near-white, near-gray
          if (lightness < 0.1 || lightness > 0.9) continue;
          if (diff < 25) continue; // not vibrant enough

          // Saturation weight — more saturated pixels get more influence
          const satWeight = diff / 255;
          // Center weight — pixels closer to the center matter more
          const px = (i / 4) % size, py = Math.floor(i / 4 / size);
          const cx = size / 2, cy = size / 2;
          const distWeight = 1 - Math.sqrt((px - cx) ** 2 + (py - cy) ** 2) / (cx);
          const weight = satWeight * Math.max(0.3, distWeight);

          let hue = 0;
          if (diff !== 0) {
            if (max === r) hue = ((g - b) / diff + (g < b ? 6 : 0)) * 60;
            else if (max === g) hue = ((b - r) / diff + 2) * 60;
            else hue = ((r - g) / diff + 4) * 60;
          }
          hue = ((hue % 360) + 360) % 360;
          buckets[Math.floor(hue / 10)] += weight;
        }

        // Find the best bucket (weighted by neighbors)
        let bestBucket = 0;
        let bestScore = 0;
        for (let i = 0; i < 36; i++) {
          const score = buckets[i] + (buckets[(i - 1 + 36) % 36] + buckets[(i + 1) % 36]) * 0.4;
          if (score > bestScore) { bestScore = score; bestBucket = i; }
        }

        // If no vibrant colors found, fall back to default
        if (bestScore < 0.01) { resolve(-1); return; }

        const hue = bestBucket * 10 + 5;
        resolve(hue);
      } catch { resolve(-1); }
    };
    img.onerror = () => resolve(-1);
    img.src = imageUrl;
  });
}

/* ─── Apply a brand hue to the document ─── */
function applyBrandHue(hue: number) {
  document.documentElement.style.setProperty('--brand-hue', String(hue));
}

function resetBrandHue() {
  document.documentElement.style.removeProperty('--brand-hue');
}

/* ─── YouTube player state tracking ─── */
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/* ─── Provider ─── */
export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const youtubePlayerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerLoadAttempted = useRef(false);

  // ── State ──
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.9);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  const currentTrackRef = useRef<Track | null>(null);
  const queueRef = useRef<Track[]>([]);
  const seekQueueRef = useRef<number | null>(null);
  const volumeRef = useRef(0.9);
  const isLoopingRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);

  useEffect(() => { isLoopingRef.current = isLooping; }, [isLooping]);

  // ── Load YouTube IFrame API ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (playerLoadAttempted.current) return;
    playerLoadAttempted.current = true;

    let retryCount = 0;
    const MAX_RETRIES = 3;

    function createPlayer() {
      if (!containerRef.current || !window.YT) return;
      const player = new window.YT.Player(containerRef.current, {
        height: '1',
        width: '1',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            try { event.target.setVolume(volumeRef.current * 100); } catch {}
            setIsPlayerReady(true);
            // Pre-load the current track if one was restored
            const ct = currentTrackRef.current;
            if (ct?.videoId) {
              try {
                event.target.cueVideoById({ videoId: ct.videoId });
              } catch {}
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: -1=unstarted, 0=ended, 1=playing, 2=paused, 3=buffering
            if (event.data === 1) {
              setIsPlaying(true);
              try { setDuration(event.target.getDuration() || 0); } catch {}
            } else if (event.data === 2) {
              setIsPlaying(false);
            } else if (event.data === 0) {
              // Song ended — infinite autoplay: wrap around queue or stop
              setIsPlaying(false);
              const ct = currentTrackRef.current;
              if (isLoopingRef.current && ct) {
                // Loop: replay current track
                try { event.target.seekTo(0, true); event.target.playVideo(); setIsPlaying(true); } catch {}
                setCurrentTime(0);
              } else {
                const q = queueRef.current;
                if (q.length > 0 && ct) {
                  const idx = q.findIndex((t) => t.id === ct.id);
                  if (idx >= 0 && idx < q.length - 1) {
                    playTrack(q[idx + 1]);
                  } else {
                    // Wrap to first song for infinite playback
                    playTrack(q[0]);
                  }
                } else {
                  setCurrentTime(0);
                }
              }
            }
          },
          onError: (event: any) => {
            console.warn('[MusicPlayer] YouTube error:', event.data);
            setIsPlaying(false);
          },
        },
      });
      youtubePlayerRef.current = player;
    }

    function loadYouTubeAPI() {
      if (document.getElementById('youtube-iframe-api')) {
        if (window.YT?.Player) {
          createPlayer();
        } else if (window.onYouTubeIframeAPIReady) {
          const orig = window.onYouTubeIframeAPIReady;
          window.onYouTubeIframeAPIReady = () => { orig?.(); createPlayer(); };
        }
        return;
      }
      window.onYouTubeIframeAPIReady = createPlayer;
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);

      // Retry if YouTube API doesn't load within 10s
      const checkInterval = setInterval(() => {
        if (window.YT?.Player) {
          clearInterval(checkInterval);
          clearTimeout(failTimeout);
          return;
        }
      }, 1000);

      const failTimeout = setTimeout(() => {
        clearInterval(checkInterval);
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          console.warn(`[MusicPlayer] YouTube API not ready, retrying (${retryCount}/${MAX_RETRIES})...`);
          const oldTag = document.getElementById('youtube-iframe-api');
          if (oldTag) oldTag.remove();
          window.onYouTubeIframeAPIReady = undefined;
          setTimeout(loadYouTubeAPI, 2000);
        } else {
          console.warn('[MusicPlayer] YouTube API failed to load after retries. Playback unavailable.');
        }
      }, 10000);
    }

    // Load persisted state first
    try {
      const savedVolume = localStorage.getItem(STORAGE_KEYS.volume);
      if (savedVolume) {
        const v = parseFloat(savedVolume);
        if (v >= 0 && v <= 1) setVolumeState(v);
      }

      const savedQueue = localStorage.getItem(STORAGE_KEYS.queue);
      if (savedQueue) {
        try {
          const parsed = JSON.parse(savedQueue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQueue(parsed);
            queueRef.current = parsed;
          }
        } catch {}
      }

      const savedTrack = localStorage.getItem(STORAGE_KEYS.currentTrack);
      if (savedTrack) {
        try {
          const parsed = JSON.parse(savedTrack);
          if (parsed && parsed.videoId) {
            setCurrentTrack(parsed);
            currentTrackRef.current = parsed;
            setDuration(parsed.duration || 0);
            const savedTime = localStorage.getItem(STORAGE_KEYS.currentTime);
            if (savedTime) {
              const t = parseFloat(savedTime);
              if (t > 0 && t < (parsed.duration || 999)) {
                seekQueueRef.current = t;
              }
            }
          }
        } catch {}
      }
    } catch {}

    loadYouTubeAPI();

    return () => {
      // Don't destroy player on unmount — layout persists
    };
  }, []);

  // ── Apply volume ──
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.volume, String(volume)); } catch {}
    if (youtubePlayerRef.current?.setVolume) {
      try { youtubePlayerRef.current.setVolume(volume * 100); } catch {}
    }
  }, [volume]);

  // ── Persist queue + track ──
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.queue, JSON.stringify(queue)); } catch {}
  }, [queue]);

  useEffect(() => {
    try {
      if (currentTrack) {
        localStorage.setItem(STORAGE_KEYS.currentTrack, JSON.stringify(currentTrack));
      } else {
        localStorage.removeItem(STORAGE_KEYS.currentTrack);
        localStorage.removeItem(STORAGE_KEYS.currentTime);
      }
    } catch {}
  }, [currentTrack]);

  // ── Poll current time ──
  useEffect(() => {
    if (!currentTrack) return;
    const interval = setInterval(() => {
      try {
        const t = youtubePlayerRef.current?.getCurrentTime();
        if (t !== undefined && t !== null) {
          setCurrentTime(t);
          if (youtubePlayerRef.current?.getPlayerState?.() === 1) {
            localStorage.setItem(STORAGE_KEYS.currentTime, String(t));
          }
        }
      } catch {}
    }, 500);
    return () => clearInterval(interval);
  }, [currentTrack]);

  // ── Seek to restored position once player is ready ──
  useEffect(() => {
    if (isPlayerReady && seekQueueRef.current !== null && currentTrack) {
      const t = seekQueueRef.current;
      seekQueueRef.current = null;
      if (youtubePlayerRef.current?.seekTo) {
        setTimeout(() => {
          try {
            youtubePlayerRef.current?.seekTo(t, true);
            youtubePlayerRef.current?.playVideo();
          } catch {}
        }, 500);
      }
    }
  }, [isPlayerReady, currentTrack]);

  // ── Save time on unload ──
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (youtubePlayerRef.current && currentTrackRef.current) {
        try {
          const t = youtubePlayerRef.current.getCurrentTime();
          if (t) localStorage.setItem(STORAGE_KEYS.currentTime, String(t));
        } catch {}
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // ── Extract dominant color from album art and set brand hue ──
  useEffect(() => {
    if (!currentTrack?.albumArt) { resetBrandHue(); return; }
    let cancelled = false;
    extractDominantHue(currentTrack.albumArt).then((hue) => {
      if (!cancelled && hue >= 0) applyBrandHue(hue);
    });
    return () => { cancelled = true; };
  }, [currentTrack?.albumArt]);

  // ── Play a track via YouTube player ──
  const playTrack = useCallback((track: Track) => {
    if (!youtubePlayerRef.current || !track.videoId) return;
    setCurrentTrack(track);
    currentTrackRef.current = track;
    setCurrentTime(0);
    setDuration(track.duration || 0);

    try {
      youtubePlayerRef.current.loadVideoById({
        videoId: track.videoId,
        startSeconds: 0,
      });
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  // ── Public methods ──
  const play = useCallback((track: Track) => {
    setQueue((prev) => {
      const exists = prev.some((t) => t.id === track.id);
      if (!exists) return [...prev, track];
      return prev;
    });
    playTrack(track);
  }, [playTrack]);

  const pause = useCallback(() => {
    try { youtubePlayerRef.current?.pauseVideo(); } catch {}
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (!currentTrackRef.current || !youtubePlayerRef.current) return;
    try {
      youtubePlayerRef.current.playVideo();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else resume();
  }, [isPlaying, pause, resume]);

  const next = useCallback(() => {
    const q = queueRef.current;
    const ct = currentTrackRef.current;
    if (q.length === 0 || !ct) return;
    const idx = q.findIndex((t) => t.id === ct.id);
    if (idx >= 0 && idx < q.length - 1) {
      playTrack(q[idx + 1]);
    } else if (q.length > 0) {
      playTrack(q[0]);
    }
  }, [playTrack]);

  const prev = useCallback(() => {
    const q = queueRef.current;
    const ct = currentTrackRef.current;
    if (q.length === 0 || !ct) return;
    const idx = q.findIndex((t) => t.id === ct.id);
    if (idx > 0) {
      playTrack(q[idx - 1]);
    } else if (q.length > 0) {
      playTrack(q[q.length - 1]);
    }
  }, [playTrack]);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(Math.max(0, Math.min(1, vol)));
  }, []);

  const seek = useCallback((time: number) => {
    try {
      youtubePlayerRef.current?.seekTo(time, true);
      setCurrentTime(time);
    } catch {}
  }, []);

  // ── Search via Piped API with fallback for better coverage ──
  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const q = encodeURIComponent(query.trim());
    let tracks: Track[] = [];

    try {
      // Try music_songs filter first
      const res = await fetchFromPiped(`/search?q=${q}&filter=music_songs`);
      const data = await res.json();
      if (data?.items) {
        tracks = data.items
          .filter((item: any) => item.url?.includes('v=') || item.videoId)
          .map(pipedItemToTrack);

        // If few results, also fetch next page and merge
        if (tracks.length > 0 && tracks.length < 15 && data.nextpage) {
          try {
            const res2 = await fetchFromPiped(`/search?q=${q}&filter=music_songs&nextpage=${encodeURIComponent(data.nextpage)}`);
            const data2 = await res2.json();
            if (data2?.items) {
              const more = data2.items
                .filter((item: any) => item.url?.includes('v=') || item.videoId)
                .map(pipedItemToTrack)
                .filter((t: Track) => !tracks.some((x) => x.id === t.id));
              tracks = [...tracks, ...more];
            }
          } catch { /* fallback results are enough */ }
        }
      }

      // If music_songs returned very few results, fall back to broader search
      if (tracks.length < 8) {
        try {
          const resFallback = await fetchFromPiped(`/search?q=${q}&filter=videos`);
          const fallback = await resFallback.json();
          if (fallback?.items) {
            const extra = fallback.items
              .filter((item: any) => (item.url?.includes('v=') || item.videoId) && item.duration > 30 && item.duration < 900)
              .map(pipedItemToTrack)
              .filter((t: Track) => !tracks.some((x) => x.id === t.id));
            tracks = [...tracks, ...extra];
          }
        } catch { /* ignore fallback errors */ }
      }
    } catch {
      // If the primary search fails entirely, try a simple fallback
      try {
        const resFallback = await fetchFromPiped(`/search?q=${q}&filter=videos`);
        const fallback = await resFallback.json();
        if (fallback?.items) {
          tracks = fallback.items
            .filter((item: any) => (item.url?.includes('v=') || item.videoId) && item.duration > 30 && item.duration < 900)
            .map(pipedItemToTrack);
        }
      } catch { /* no results */ }
    }

    setSearchResults(tracks);
    setIsSearching(false);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => {
      if (prev) setSearchResults([]);
      return !prev;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const toggleLoop = useCallback(() => {
    setIsLooping((prev) => !prev);
  }, []);

  // ── Close fullscreen on Escape ──
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => {
      if (prev.some((t) => t.id === track.id)) return prev;
      return [...prev, track];
    });
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const playFromQueue = useCallback((index: number) => {
    const q = queueRef.current;
    if (index >= 0 && index < q.length) {
      playTrack(q[index]);
    }
  }, [playTrack]);

  const value: MusicPlayerContextValue = {
    currentTrack,
    queue,
    isPlaying,
    volume,
    currentTime,
    duration,
    searchResults,
    isSearchOpen,
    isSearching,
    isPlayerReady,
    isFullscreen,
    isLooping,

    play,
    pause,
    resume,
    togglePlay,
    next,
    prev,
    setVolume,
    seek,
    search,
    clearSearch,
    toggleSearch,
    toggleFullscreen,
    toggleLoop,
    addToQueue,
    removeFromQueue,
    clearQueue,
    playFromQueue,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      {/* YouTube player container — must not use display:none or the API fails silently */}
      <div
        ref={containerRef}
        className="fixed top-0 left-0 w-px h-px opacity-0 pointer-events-none overflow-hidden -z-50"
      />
    </MusicPlayerContext.Provider>
  );
}

/* ─── Hook ─── */
export function useMusicPlayer(): MusicPlayerContextValue {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return ctx;
}
