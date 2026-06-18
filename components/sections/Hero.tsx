'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, Code2, Sparkles } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Glow } from '@/components/ui/glow';
import { AnimatedCounter } from '@/components/ui/animated-counter';

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      titleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.3'
      )
      .fromTo(
        statsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.2'
      );
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center z-20"
    >
      {/* Glass blur overlay over 3D canvas */}
      <div className="absolute inset-0 glass-backdrop-strong" />
      <Glow
        className="top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
        size={600}
        blur={120}
        color="hsl(var(--brand-400))"
      />
      <DotPattern opacity={0.08} />

      <div className="container relative z-10 mx-auto section-padding w-full">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left column: text */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <Sparkles size={14} className="text-brand-400 shrink-0" />
              <span className="text-xs md:text-sm font-medium text-brand-400 tracking-wider uppercase">
                Full Stack Developer
              </span>
            </div>

            <h1 ref={titleRef} className="display-1 mb-4 md:mb-6">
              Crafting
              <span className="text-gradient block mt-1 md:mt-2">
                Digital Experiences
              </span>
              <span className="block mt-1 md:mt-0">
                with Code &amp; Creativity
              </span>
            </h1>

            <p
              ref={subtitleRef}
              className="max-w-xl text-sm md:text-base lg:text-lg text-foreground/60 leading-relaxed mb-6 md:mb-8"
            >
              I build premium web applications with cutting-edge technology.
              From interactive 3D experiences to robust backend systems,
              I turn complex problems into elegant solutions.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-3 md:gap-4">
              <Link href="/projects">
                <GlassButton variant="gradient" size="md" className="text-xs md:text-sm">
                  View Projects
                  <ArrowRight size={14} />
                </GlassButton>
              </Link>
              <Link href="/contact">
                <GlassButton variant="primary" size="md" className="text-xs md:text-sm">
                  Get in Touch
                </GlassButton>
              </Link>
            </div>

            {/* Stats row */}
            <div
              ref={statsRef}
              className="mt-8 md:mt-12 flex gap-5 sm:gap-6 md:gap-8"
            >
              <div className="flex-1 sm:flex-initial">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                  <AnimatedCounter target={5} suffix="+" />
                </div>
                <div className="text-[11px] sm:text-xs md:text-sm text-foreground/40 whitespace-nowrap">Years Exp.</div>
              </div>
              <div className="flex-1 sm:flex-initial">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                  <AnimatedCounter target={50} suffix="+" />
                </div>
                <div className="text-[11px] sm:text-xs md:text-sm text-foreground/40 whitespace-nowrap">Projects</div>
              </div>
              <div className="flex-1 sm:flex-initial">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                  <AnimatedCounter target={30} suffix="+" />
                </div>
                <div className="text-[11px] sm:text-xs md:text-sm text-foreground/40 whitespace-nowrap">Clients</div>
              </div>
            </div>
          </div>

          {/* Right column: code decoration (hidden on small screens) */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center">
            <div className="glass-strong rounded-2xl p-5 md:p-6 w-full max-w-sm shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Code2 size={14} className="text-brand-400 shrink-0" />
                <span className="text-[10px] md:text-xs text-foreground/50 font-mono">
                  developer.tsx
                </span>
              </div>
              <pre className="font-mono text-[10px] md:text-xs text-foreground/70 leading-relaxed whitespace-pre-wrap">
                <code>{`const developer = {
  name: "Sparsh Singhal",
  role: "Full Stack Developer",
  stack: {
    frontend: ["React", "Next.js", "Three.js"],
    backend: ["Node.js", "Python", "Go"],
    database: ["PostgreSQL", "MongoDB"],
    cloud: ["AWS", "Vercel", "Netlify"],
  },
  currentFocus: "Building immersive
    web experiences with 3D
    & interactive animations.",
  motto: "Code is poetry
    in motion.",
};`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
