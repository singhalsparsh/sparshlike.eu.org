'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowUp,
  Copy,
  ExternalLink,
  Home,
  Mail,
  Moon,
  Sun,
  RefreshCw,
  Shield,
  Terminal,
  User,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface MenuItem {
  label: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
  divider?: boolean;
}

export function ContextMenu() {
  const { theme, toggleTheme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const close = useCallback(() => setVisible(false), []);

  useEffect(() => {
    function onContextMenu(e: MouseEvent) {
      e.preventDefault();
      // Keep within viewport
      const x = Math.min(e.clientX, window.innerWidth - 220);
      const y = Math.min(e.clientY, window.innerHeight - 380);
      setPos({ x, y });
      setVisible(true);
    }

    function onClick() {
      close();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [close]);

  const items: MenuItem[] = [
    {
      label: 'Back to Top',
      icon: ArrowUp,
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        close();
      },
      shortcut: 'Home',
    },
    {
      label: 'Copy Page URL',
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        close();
      },
      shortcut: 'Ctrl+C',
    },
    {
      label: 'Open in New Tab',
      icon: ExternalLink,
      action: () => {
        window.open(window.location.href, '_blank');
        close();
      },
    },
    { label: '', icon: RefreshCw, action: () => {}, divider: true },
    {
      label: 'Navigate to…',
      icon: Home,
      action: () => {
        window.location.href = '/';
        close();
      },
    },
    {
      label: 'About',
      icon: User,
      action: () => {
        window.location.href = '/about';
        close();
      },
    },
    {
      label: 'Contact',
      icon: Mail,
      action: () => {
        window.location.href = '/contact';
        close();
      },
    },
    { label: '', icon: Terminal, action: () => {}, divider: true },
    {
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        toggleTheme();
        close();
      },
      shortcut: 'Toggle',
    },
    {
      label: 'Inspect Element',
      icon: Shield,
      action: () => {
        close();
      },
      shortcut: 'F12',
    },
  ];

  if (!visible) return null;

  return (
    <div
      className={[
        'fixed z-[9999] w-[200px] py-1.5 rounded-xl',
        // ── Light mode: light glass ──
        'bg-white/95',
        // ── Dark mode: dark glass ──
        'dark:bg-[#0a0e1a]/90',
        // ── Liquid glass effect ──
        'backdrop-blur-[24px] saturate-[1.8]',
        // ── Borders: subtle in light, indigo-tinted in dark ──
        'border border-gray-200/70 dark:border-brand-400/20',
        // ── Shadow visible in both modes ──
        'shadow-[0_16px_48px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_48px_rgba(99,102,241,0.10)]',
        // ── Entrance animation ──
        'animate-in fade-in zoom-in-95 duration-100',
      ].join(' ')}
      style={{ left: pos.x, top: pos.y }}
    >
      {items.map((item, i) => {
        if (item.divider) {
          return (
            <div
              key={i}
              className="h-px bg-gray-200 dark:bg-white/10 mx-2 my-1"
            />
          );
        }
        return (
          <button
            key={i}
            onClick={item.action}
            className={[
              'w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg mx-1.5',
              'transition-all duration-150',
              // ── Text: dark & highly visible in light, light in dark ──
              'text-gray-700 dark:text-gray-200',
              // ── Hover: brand accent with glassy background ──
              'hover:text-brand-500 dark:hover:text-brand-300',
              'hover:bg-brand-400/10',
              'hover:translate-x-0.5',
            ].join(' ')}
            style={{ width: 'calc(100% - 12px)' }}
          >
            <item.icon size={14} className="shrink-0" />
            <span className="flex-1 text-left font-medium">{item.label}</span>
            {item.shortcut && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono tracking-wider">
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
