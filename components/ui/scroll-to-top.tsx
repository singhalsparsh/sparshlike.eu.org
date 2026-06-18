'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const circumference = 2 * Math.PI * 18; // r=18

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setProgress(pct);
      setVisible(scrollTop > 300);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Compute dash offset
  const offset = circumference - (progress / 100) * circumference;

  return (
    <button
      ref={btnRef}
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
      }`}
      aria-label="Scroll to top"
      title={`${Math.round(progress)}% scrolled`}
    >
      {/* Background circle */}
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 40 40">
        {/* Track */}
        <circle
          cx="20" cy="20" r="18"
          fill="none"
          stroke="hsl(var(--border) / 0.15)"
          strokeWidth="2"
        />
        {/* Progress */}
        <circle
          cx="20" cy="20" r="18"
          fill="none"
          stroke="hsl(var(--brand-400))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 4px hsl(var(--brand-400) / 0.5))`,
            transition: 'stroke-dashoffset 0.1s linear',
          }}
        />
      </svg>
      {/* Glass background */}
      <div className="absolute inset-0 rounded-full glass-strong" />
      {/* Arrow icon */}
      <ArrowUp size={18} className="relative z-10 text-foreground/70 hover:text-foreground transition-colors" />
    </button>
  );
}
