'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Lenis from '@studio-freight/lenis';
import { Home, ArrowLeft, Search, Code2 } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Glow } from '@/components/ui/glow';

export default function NotFoundPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    function onFrame(time: number) { lenis.raf(time); }
    requestAnimationFrame(function animate(time: number) {
      onFrame(time);
      requestAnimationFrame(animate);
    });
    return () => { lenis.destroy(); };
  }, []);

  return (
    <main className="relative z-30 min-h-screen flex items-center justify-center">
      {/* Background layers */}
      <div className="absolute inset-0 section-glass">
        <div className="glass-overlay-bg" />
      </div>
      <Glow className="top-1/3 left-1/2 -translate-x-1/2" size={600} blur={140} />
      <DotPattern opacity={0.05} />

      <div className="container mx-auto max-w-2xl px-4 relative z-10">
        <div className="glass-content p-8 md:p-12 text-center">
          {/* Error code */}
          <div className="mb-6">
            <span className="text-[120px] md:text-[160px] font-bold leading-none tracking-tighter bg-gradient-to-b from-brand-300 via-brand-400 to-brand-600 bg-clip-text text-transparent">
              404
            </span>
          </div>

          {/* Divider line */}
          <div className="w-16 h-[2px] bg-gradient-to-r from-brand-400 to-brand-300 mx-auto mb-6 rounded-full" />

          {/* Heading */}
          <h1 className="display-2 mb-4 text-foreground">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base text-foreground/60 leading-relaxed mb-3 max-w-md mx-auto">
            The page you are looking for does not exist or has been moved.
            It might have been eaten by a 3D glitch.
          </p>

          {/* Fun hint */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 text-xs text-foreground/40 font-mono mb-8">
            <Code2 size={12} />
            <span>Error: 0x{Math.random().toString(16).slice(2, 8).toUpperCase()} — Resource not found</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/">
              <GlassButton variant="gradient" size="md">
                <Home size={14} />
                Back to Home
              </GlassButton>
            </Link>
            <Link href="/blog">
              <GlassButton variant="primary" size="md">
                <ArrowLeft size={14} />
                Browse Blog
              </GlassButton>
            </Link>
            <Link href="/projects">
              <GlassButton variant="ghost" size="md">
                <Search size={14} />
                View Projects
              </GlassButton>
            </Link>
          </div>
        </div>

        {/* Subtle footer hint */}
        <p className="text-center mt-8 text-[11px] text-foreground/20 font-mono">
          $ curl -I https://aurasparsh.dev{typeof window !== 'undefined' ? window.location.pathname : ''}
          <br />
          &gt; HTTP/2 404 Not Found
        </p>
      </div>
    </main>
  );
}
