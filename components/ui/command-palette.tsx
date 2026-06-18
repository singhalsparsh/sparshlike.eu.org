'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Home, User, Briefcase, BookOpen, Mail, X, ArrowRight } from 'lucide-react';

const COMMANDS = [
  { id: 'home', label: 'Go to Home', href: '/', icon: Home },
  { id: 'about', label: 'Go to About', href: '/about', icon: User },
  { id: 'projects', label: 'Go to Projects', href: '/projects', icon: Briefcase },
  { id: 'blog', label: 'Go to Blog', href: '/blog', icon: BookOpen },
  { id: 'contact', label: 'Go to Contact', href: '/contact', icon: Mail },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filteredCommands = COMMANDS.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.id.toLowerCase().includes(query.toLowerCase())
  );

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  const executeCommand = useCallback(
    (cmd: typeof COMMANDS[0]) => {
      setOpen(false);
      router.push(cmd.href);
    },
    [router]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Palette */}
      <div className="relative w-full max-w-lg glass-modal rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <Search size={18} className="text-foreground/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/30 outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-foreground/10 text-foreground/40">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="p-2 max-h-64 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-foreground/30">
              No results found
            </div>
          ) : (
            filteredCommands.map((cmd, i) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                    i === selectedIndex
                      ? 'bg-brand-500/15 text-foreground'
                      : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  <Icon size={16} className="shrink-0 text-brand-400" />
                  <span className="flex-1 text-left">{cmd.label}</span>
                  <ArrowRight size={14} className="shrink-0 opacity-0 group-hover:opacity-100" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-white/5 flex items-center gap-4 text-[10px] text-foreground/30">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-foreground/10 font-mono">↓</kbd>
            <kbd className="px-1 py-0.5 rounded bg-foreground/10 font-mono">↑</kbd>
            to navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-foreground/10 font-mono">↵</kbd>
            to open
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <kbd className="px-1 py-0.5 rounded bg-foreground/10 font-mono">esc</kbd>
            to close
          </span>
        </div>
      </div>
    </div>
  );
}
