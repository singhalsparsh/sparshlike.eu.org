'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Work' },
  { href: '/blog', label: 'Blog' },
];

const MORE_ITEMS = [
  { label: 'All my links are here', href: '/links' },
  { label: 'Uses — A peek into my digital...', href: '/uses' },
  { label: 'Bucket List', href: '/bucket-list' },
  { label: 'Guestbook', href: '/guestbook' },
  { label: 'Attribution', href: '/attribution' },
  { label: 'Journey to create this site', href: '/journey' },
];

/* ─── Programming Globe Icon ─── */
const LANG_COLORS: [string, string][] = [
  ['#f7df1e', 'JS'],
  ['#3572A5', 'Py'],
  ['#f34b7d', 'Rs'],
  ['#00ADD8', 'Go'],
];

function NavIcon({ state }: { state: 'initial' | 'medium' | 'expanded' }) {
  const fullyExpanded = state === 'expanded';
  const medium = state === 'medium';
  return (
    <div
      className={cn(
        'relative flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
        fullyExpanded ? 'w-12 h-12' : medium ? 'w-9 h-9' : 'w-6 h-6'
      )}
    >
      <div className="relative flex items-center justify-center w-full h-full">
        <Globe
          size={fullyExpanded ? 28 : medium ? 22 : 14}
          className="text-brand-400 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          strokeWidth={1.5}
        />

        {LANG_COLORS.map(([color, label], i) => {
          const angle = (i / LANG_COLORS.length) * Math.PI * 2;
          const radius = fullyExpanded ? 16 : medium ? 13 : 8;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <span
              key={label}
              className={cn(
                'absolute rounded-full border border-background/80 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                fullyExpanded ? 'w-3 h-3' : medium ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5'
              )}
              style={{
                backgroundColor: color,
                transform: `translate(${x}px, ${y}px)`,
              }}
              title={label}
            />
          );
        })}
      </div>
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrollState, setScrollState] = useState<'initial' | 'medium' | 'expanded'>('initial');
  const moreRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ─── 3-state scroll tracking ───
  // initial (at top) → medium (any scroll, but < 80px) → expanded (> 80px)
  // When scrolling back up: stays medium until reaching exact top, then back to initial
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y === 0) setScrollState('initial');
          else if (y > 80) setScrollState('expanded');
          else setScrollState('medium');
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    // Initialize
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y === 0) setScrollState('initial');
      else if (y > 80) setScrollState('expanded');
      else setScrollState('medium');
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close More dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        moreRef.current &&
        !moreRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMoreOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isExpanded = scrollState === 'expanded';
  const isMedium = scrollState === 'medium';
  const isScrolled = isMedium || isExpanded;

  return (
    <nav
      className={cn(
        'fixed left-1/2 -translate-x-1/2 z-50 px-2 sm:px-4',
        'transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
        isScrolled ? 'top-2 sm:top-3' : 'top-[72px]'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between',
          'rounded-[60px]',
          'transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          // ── THEME: glass in both modes ──
          'bg-white/80 dark:bg-[#0a0e1a]/80',
          'backdrop-blur-[36px] saturate-[1.8]',
          'border',
          // Initial (at top) - most subtle
          !isScrolled && [
            'py-1.5 px-3 sm:px-4',
            'shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(99,102,241,0.06)]',
            'border-gray-200/50 dark:border-brand-400/20',
            'hover:border-brand-400/30 dark:hover:border-brand-400/40',
            'hover:shadow-[0_8px_32px_hsl(var(--brand-400)/0.1)] dark:hover:shadow-[0_8px_32px_hsl(var(--brand-400)/0.15)]',
            'min-w-[260px] sm:min-w-[340px] md:min-w-[auto]',
          ],
          // Medium (scrolled a little) - bigger than initial, smaller than expanded
          isMedium && [
            'py-3 px-4 sm:px-5',
            'shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(99,102,241,0.10)]',
            'border-brand-400/20 dark:border-brand-400/30',
            'hover:shadow-[0_12px_48px_hsl(var(--brand-400)/0.18)]',
            'min-w-[280px] sm:min-w-[400px] md:min-w-[480px]',
          ],
          // Expanded (scrolled far) - largest
          isExpanded && [
            'py-4 sm:py-5 px-5 sm:px-7',
            'shadow-[0_16px_56px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_56px_rgba(99,102,241,0.12)]',
            'border-brand-400/40 dark:border-brand-400/50',
            'hover:shadow-[0_16px_64px_hsl(var(--brand-400)/0.25)]',
            'min-w-[320px] sm:min-w-[460px] md:min-w-[620px]',
          ],
        )}
      >
        {/* Logo / Icon */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 mr-2 sm:mr-4 shrink-0 group">
          <NavIcon state={scrollState} />
          <span
            className={cn(
              'font-extrabold bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent',
              'transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
              isExpanded && 'text-2xl sm:text-3xl tracking-tight',
              isMedium && 'text-lg sm:text-xl tracking-tight',
              !isScrolled && 'text-xs sm:text-sm'
            )}
          >
            SPARSH
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href.split('#')[0]));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'relative px-3 lg:px-4 py-1.5 rounded-full',
                  'transition-all duration-300',
                  // Text size based on scroll state
                  isExpanded && 'text-sm lg:text-base',
                  isMedium && 'text-sm',
                  !isScrolled && 'text-xs',
                  // Active / inactive with best contrast in both modes
                  isActive
                    ? 'text-brand-500 dark:text-brand-300 bg-brand-400/12 font-semibold'
                    : 'text-gray-800 dark:text-white/90 hover:text-brand-500 dark:hover:text-brand-300',
                  'hover:bg-brand-400/8 hover:scale-105 active:scale-95',
                  'font-semibold'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-brand-500 dark:bg-brand-300" />
                )}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              onMouseEnter={() => setMoreOpen(true)}
              className={cn(
                'flex items-center gap-1 px-3 lg:px-4 py-1.5 rounded-full',
                'transition-all duration-300 font-semibold',
                isExpanded && 'text-sm lg:text-base',
                isMedium && 'text-sm',
                !isScrolled && 'text-xs',
                moreOpen
                  ? 'text-brand-500 dark:text-brand-300 bg-brand-400/12'
                  : 'text-gray-700 dark:text-white/85 hover:text-brand-500 dark:hover:text-brand-300',
                'hover:bg-brand-400/8 hover:scale-105 active:scale-95'
              )}
            >
              More
              <ChevronDown
                size={12}
                className={cn(
                  'transition-transform duration-200',
                  moreOpen && 'rotate-180'
                )}
              />
            </button>

            {moreOpen && (
              <div
                ref={dropdownRef}
                onMouseLeave={() => setMoreOpen(false)}
                className={cn(
                  'absolute top-full left-0 mt-2 w-64',
                  'rounded-xl p-2',
                  'bg-white/85 dark:bg-[#0a0e1a]/85 backdrop-blur-[36px] saturate-[1.8]',
                  'border border-gray-200/80 dark:border-brand-400/20',
                  'shadow-[0_16px_48px_rgba(0,0,0,0.2)] dark:shadow-[0_16px_48px_rgba(99,102,241,0.1)]',
                  'animate-in fade-in slide-in-from-top-2 duration-200',
                )}
              >
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Explore
                </div>
                <div className="h-px bg-gray-200 dark:bg-white/10 my-1" />

                <div className="space-y-0.5">
                  {MORE_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        'block px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                        'text-gray-800 dark:text-white/90',
                        'hover:text-brand-500 dark:hover:text-brand-300',
                        'hover:bg-brand-400/10 hover:translate-x-0.5'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'ml-1 lg:ml-2 flex h-8 w-8 items-center justify-center rounded-full',
              'transition-all duration-300',
              'text-gray-500 dark:text-gray-400',
              'hover:text-brand-500 dark:hover:text-brand-300',
              'hover:bg-brand-400/10 hover:scale-110 active:scale-90'
            )}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Book a Call */}
          <Link href="/contact" className="ml-2 lg:ml-3">
            <span
              className={cn(
                'inline-flex items-center px-5 lg:px-6 py-2 rounded-full font-semibold whitespace-nowrap',
                'bg-gradient-to-r from-brand-500 to-brand-600 text-white',
                'shadow-[0_4px_20px_hsl(var(--brand-400)/0.3)] dark:shadow-[0_4px_20px_hsl(var(--brand-400)/0.4)]',
                'transition-all duration-300',
                'hover:shadow-[0_8px_32px_hsl(var(--brand-400)/0.55)]',
                'hover:scale-105 hover:-translate-y-px active:scale-95',
                'text-base lg:text-lg'
              )}
            >
              Hire Me
            </span>
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-300 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-300 hover:bg-brand-400/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={cn(
            'mt-2 rounded-[24px] p-5',
            'bg-white/85 dark:bg-[#0a0e1a]/85 backdrop-blur-[36px] saturate-[1.8]',
            'border border-gray-200/80 dark:border-brand-400/20',
            'shadow-[0_16px_48px_rgba(0,0,0,0.2)] dark:shadow-[0_16px_48px_rgba(99,102,241,0.1)]',
            'md:hidden animate-in fade-in slide-in-from-top-2 duration-200',
          )}
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href.split('#')[0]));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'rounded-xl px-4 py-3 text-sm font-medium transition-colors text-center',
                    isActive
                      ? 'text-brand-500 dark:text-brand-300 bg-brand-400/10'
                      : 'text-gray-800 dark:text-white/90 hover:text-brand-500 dark:hover:text-brand-300 hover:bg-brand-400/8'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="px-4 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 text-center">
              Explore
            </div>

            {MORE_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-gray-800 dark:text-white/90 hover:text-brand-500 dark:hover:text-brand-300 hover:bg-brand-400/8 transition-colors text-center"
              >
                {item.label}
              </Link>
            ))}

            <div className="h-px bg-gray-200 dark:bg-white/10 my-2" />

            <Link href="/contact" onClick={() => setMobileOpen(false)} className="px-4">
              <span
                className={cn(
                  'inline-flex items-center justify-center w-full px-6 py-3.5 rounded-full text-base font-semibold whitespace-nowrap',
                  'bg-gradient-to-r from-brand-500 to-brand-600 text-white',
                  'shadow-[0_4px_20px_hsl(var(--brand-400)/0.3)]',
                  'transition-all duration-300 hover:shadow-[0_8px_32px_hsl(var(--brand-400)/0.5)]',
                  'hover:scale-[1.03] active:scale-[0.97] mt-1'
                )}
              >
                Hire Me
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
