'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Search,
  X,
  Play,
  Plus,
  Disc3,
  Loader2,
  Music,
  ChevronDown,
  ChevronRight,
  ListMusic,
  Clock,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMusicPlayer, handleThumbnailError, type Track } from './MusicPlayerContext';

/* ─── Search history ─── */
const HISTORY_KEY = 'mp_search_history';
const MAX_HISTORY = 12;

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.slice(0, MAX_HISTORY);
    }
  } catch { /* ignore */ }
  return [];
}

function saveHistory(history: string[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch { /* ignore */ }
}

/* ─── Helpers ─── */
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/* ─── Component ─── */
export function SearchModal() {
  const {
    search,
    searchResults,
    isSearchOpen,
    isSearching,
    toggleSearch,
    play,
    addToQueue,
    currentTrack,
  } = useMusicPlayer();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [expandedArtists, setExpandedArtists] = useState<Set<string>>(new Set());
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistoryOnly, setShowHistoryOnly] = useState(false);

  // Load history when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setSearchHistory(loadHistory());
      setShowHistoryOnly(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setExpandedArtists(new Set());
      setShowHistoryOnly(false);
    }
  }, [isSearchOpen]);

  // Debounced search
  const debouncedSearch = useCallback(
    (q: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        search(q);
      }, 300);
    },
    [search]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setShowHistoryOnly(false);
    if (val.trim()) {
      debouncedSearch(val);
    }
  };

  // Add to search history
  const addToHistory = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((h) => h.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
  }, []);

  // When search results come in, save to history
  useEffect(() => {
    if (searchResults.length > 0 && query.trim()) {
      addToHistory(query);
    }
  }, [searchResults]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlay = (track: Track) => {
    play(track);
  };

  const handleAddToQueue = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    addToQueue(track);
  };

  const handleHistoryClick = (q: string) => {
    setQuery(q);
    setShowHistoryOnly(false);
    search(q);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch { /* ignore */ }
  };

  // Group results by artist
  const groupedResults = useMemo(() => {
    const groups: Record<string, Track[]> = {};
    for (const track of searchResults) {
      const artist = track.artist || 'Unknown Artist';
      if (!groups[artist]) groups[artist] = [];
      groups[artist].push(track);
    }
    return Object.entries(groups).sort((a, b) => {
      if (b[1].length !== a[1].length) return b[1].length - a[1].length;
      return a[0].localeCompare(b[0]);
    });
  }, [searchResults]);

  const totalResults = searchResults.length;
  const artistCount = groupedResults.length;

  const toggleArtist = (artist: string) => {
    setExpandedArtists((prev) => {
      const next = new Set(prev);
      if (next.has(artist)) next.delete(artist);
      else next.add(artist);
      return next;
    });
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      const top = groupedResults.slice(0, 3).map(([artist]) => artist);
      setExpandedArtists(new Set(top));
    }
  }, [searchResults]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        toggleSearch();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isSearchOpen, toggleSearch]);

  if (!isSearchOpen) return null;

  return (
    <>
      {/* Overlay — highest z-index to be above everything */}
      <div
        className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md"
        onClick={toggleSearch}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed z-[100000]',
          'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'w-[calc(100%-32px)] sm:w-[480px] md:w-[560px]',
          'max-h-[70vh] sm:max-h-[75vh]',
          'rounded-2xl overflow-hidden',
          'flex flex-col',
          'bg-white/90 dark:bg-[#0a0e1a]/90 backdrop-blur-[32px] saturate-[2]',
          'border border-brand-400/20',
          'shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_80px_hsl(var(--brand-400)/0.08)]',
          'animate-in fade-in zoom-in-90 duration-300',
        )}
      >
        {/* Colour scheme overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-brand-400/[0.04] via-transparent to-transparent" />

        {/* Header with search input */}
        <div className="shrink-0 p-3 sm:p-4 border-b border-black/10 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search songs, artists..."
                value={query}
                onChange={handleChange}
                className={cn(
                  'w-full pl-9 pr-8 py-2.5 rounded-xl text-sm',
                  'bg-black/10 dark:bg-white/[0.12] border border-brand-400/20 dark:border-brand-400/20',
                  'text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400',
                  'focus:outline-none focus:border-brand-400/50 focus:ring-[2px] focus:ring-brand-400/25',
                  'transition-all'
                )}
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); inputRef.current?.focus(); setShowHistoryOnly(true); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <button
              onClick={toggleSearch}
              className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-black/10 dark:hover:bg-white/[0.08] transition-all"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Results area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(180,180,180,0.2) transparent' }}>
          {isSearching && (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <div className="relative">
                <Loader2 size={22} className="text-brand-400 animate-spin" />
                <div className="absolute inset-0 rounded-full bg-brand-400/10 blur-sm animate-pulse" style={{ animationDuration: '1.5s' }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Searching...</p>
            </div>
          )}

          {!isSearching && query && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 gap-2">
              <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/[0.04] flex items-center justify-center">
                <Music size={20} className="text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">Try a different search term</p>
            </div>
          )}

          {/* Search history (shown when no query entered) */}
          {!isSearching && !query && showHistoryOnly && searchHistory.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={11} />
                  Recent searches
                </span>
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={10} />
                  Clear
                </button>
              </div>
              {searchHistory.map((h, i) => (
                <button
                  key={`${h}-${i}`}
                  onClick={() => handleHistoryClick(h)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group hover:bg-black/5 dark:hover:bg-white/[0.04]"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/[0.06]">
                    <Clock size={12} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">{h}</span>
                  <Search size={11} className="text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Empty history placeholder */}
          {!isSearching && !query && showHistoryOnly && searchHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 gap-2">
              <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/[0.04] flex items-center justify-center">
                <Search size={20} className="text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Search for any song</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-500">Your recent searches will appear here</p>
            </div>
          )}

          {/* Search results */}
          {!isSearching && searchResults.length > 0 && (
            <div className="space-y-2">
              {groupedResults.map(([artist, tracks], groupIdx) => {
                const isExpanded = expandedArtists.has(artist);
                const isFirst = groupIdx === 0;

                return (
                  <div key={artist} className={cn(
                    'rounded-xl overflow-hidden',
                    isFirst ? 'ring-1 ring-brand-400/15' : 'border border-white/[0.06] dark:border-white/[0.04]',
                  )}>
                    {/* Artist section header */}
                    <button
                      onClick={() => toggleArtist(artist)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left',
                        isFirst
                          ? 'bg-brand-400/8 hover:bg-brand-400/12'
                          : 'bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/[0.04]'
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                        isFirst ? 'bg-brand-400/20' : 'bg-black/5 dark:bg-white/[0.06]'
                      )}>
                        <ListMusic size={14} className={isFirst ? 'text-brand-400' : 'text-gray-400 dark:text-gray-500'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm font-semibold truncate',
                          isFirst ? 'text-brand-500 dark:text-brand-300' : 'text-gray-700 dark:text-gray-300'
                        )}>
                          {artist}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                          {tracks.length} {tracks.length === 1 ? 'song' : 'songs'}
                        </p>
                      </div>
                      <div className="shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-200" style={{
                        transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
                      }}>
                        <ChevronDown size={14} />
                      </div>
                    </button>

                    {/* Tracks under this artist */}
                    {isExpanded && (
                      <div className={cn(
                        'divide-y divide-black/[0.04] dark:divide-white/[0.03]',
                        'bg-black/[0.01] dark:bg-white/[0.01]'
                      )}>
                        {tracks.map((track) => {
                          const isCurrent = currentTrack?.id === track.id;
                          return (
                            <button
                              key={track.id}
                              onClick={() => handlePlay(track)}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 transition-all text-left group',
                                isCurrent
                                  ? 'bg-brand-400/10'
                                  : 'hover:bg-black/5 dark:hover:bg-white/[0.04]'
                              )}
                            >
                              {/* Album art */}
                              <div className={cn(
                                'relative w-9 h-9 rounded-lg overflow-hidden shrink-0 flex items-center justify-center ring-1',
                                isCurrent
                                  ? 'ring-brand-400/30 bg-brand-400/10'
                                  : 'ring-black/10 dark:ring-white/[0.06] bg-brand-400/10'
                              )}>
                                {track.albumArt ? (
                                  <img
                                    src={track.albumArt}
                                    alt={track.title}
                                    className="w-full h-full object-cover"
                                    onError={handleThumbnailError}
                                  />
                                ) : (
                                  <Disc3 size={14} className="text-brand-400/40" />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[2px]">
                                  <Play size={12} className="text-white" fill="currentColor" />
                                </div>
                              </div>

                              {/* Info */}
                              <div className="min-w-0 flex-1">
                                <p className={cn(
                                  'text-sm font-medium truncate flex items-center gap-1.5',
                                  isCurrent ? 'text-brand-500 dark:text-brand-300' : 'text-gray-800 dark:text-gray-200'
                                )}>
                                  <span className="truncate">{track.title}</span>
                                  {track.isExplicit && (
                                    <span className="shrink-0 text-[9px] font-bold leading-none px-1 py-[2px] rounded bg-orange-400/20 text-orange-500 dark:text-orange-400 border border-orange-400/30 uppercase tracking-wider">E</span>
                                  )}
                                  {isCurrent && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                                  )}
                                </p>
                                {track.uploader && track.uploader !== artist && (
                                  <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                                    {track.uploader}
                                  </p>
                                )}
                              </div>

                              {/* Duration */}
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono shrink-0 mr-0.5">
                                {formatTime(track.duration)}
                              </span>

                              {/* Add to queue */}
                              <button
                                onClick={(e) => handleAddToQueue(e, track)}
                                className={cn(
                                  'shrink-0 flex items-center justify-center w-7 h-7 rounded-lg transition-all',
                                  'text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-300 hover:bg-brand-400/10',
                                  'opacity-0 group-hover:opacity-100',
                                )}
                                title="Add to queue"
                              >
                                <Plus size={13} />
                              </button>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 py-2.5 border-t border-black/10 dark:border-white/[0.06] flex items-center justify-between">
          <span className="text-[10px] text-gray-500 dark:text-gray-500">
            {searchResults.length > 0
              ? `${totalResults} ${totalResults === 1 ? 'result' : 'results'} · ${artistCount} ${artistCount === 1 ? 'artist' : 'artists'}`
              : 'Search any song'}
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-500 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-brand-400/50" />
            YouTube
          </span>
        </div>
      </div>
    </>
  );
}
