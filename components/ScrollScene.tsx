'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // ── Scroll-driven 3D effects on the video wrapper ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
    tl.to(wrapper, {
      scale: 0.9,
      rotationX: 3,
      yPercent: 10,
      opacity: 0.6,
      ease: 'power1.out',
    });

    // About section — scale up and shift
    ScrollTrigger.create({
      trigger: '#about',
      start: 'top bottom',
      end: 'top center',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(wrapper, {
          scale: 1 + p * 0.3,
          x: p * -40,
          rotationY: p * -8,
          opacity: 0.5 + p * 0.2,
        });
      },
    });

    // Skills section — move right and shrink
    ScrollTrigger.create({
      trigger: '#skills',
      start: 'top bottom',
      end: 'top center',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(wrapper, {
          scale: 1.3 - p * 0.4,
          x: p * 50,
          rotationY: p * 6,
          opacity: 0.7 - p * 0.3,
        });
      },
    });

    // Projects section — tilt down
    ScrollTrigger.create({
      trigger: '#projects',
      start: 'top bottom',
      end: 'top center',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(wrapper, {
          scale: 0.9 + p * 0.2,
          y: p * 30,
          rotationX: p * 5,
          opacity: 0.4 + p * 0.2,
        });
      },
    });

    // Testimonials — fade out completely
    ScrollTrigger.create({
      trigger: '#testimonials',
      start: 'top bottom',
      end: 'top center',
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(wrapper, { opacity: 1 - self.progress });
      },
      onLeaveBack: () => {
        gsap.to(wrapper, { opacity: 0.6, duration: 0.5 });
      },
    });

    // Reset on scroll back to hero
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom center',
      onEnterBack: () => {
        gsap.to(wrapper, {
          scale: 1,
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          opacity: 0.8,
          duration: 0.8,
          ease: 'power2.out',
        });
      },
    });

    // ── Try to autoplay video on interaction ──
    function attemptPlay() {
      const v = videoRef.current;
      if (!v || v.paused) return;
      v.muted = true;
      v.loop = true;
      v.play().catch(() => {});
    }
    document.addEventListener('click', attemptPlay, { once: true });
    document.addEventListener('touchstart', attemptPlay, { once: true });

    // Try immediate play (may be blocked by browser)
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.loop = true;
      (v as any).playsInline = true;
      v.play().catch(() => {});
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      document.removeEventListener('click', attemptPlay);
      document.removeEventListener('touchstart', attemptPlay);
    };
  }, []);

  return (
    <div ref={containerRef} className="floating-canvas">
      <div
        ref={wrapperRef}
        className="absolute inset-0 flex items-center justify-center will-change-transform"
        style={{
          perspective: '1200px',
          opacity: 0.8,
        }}
      >
        {/* Ambient glow ring behind video */}
        <div className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-brand-500/5 blur-[120px] -z-10" />

        {/* Video element with subtle border */}
        <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px] rounded-full overflow-hidden border border-brand-400/15 shadow-[0_0_80px_hsl(var(--brand-400)/0.08),inset_0_0_80px_hsl(var(--brand-400)/0.03)]">
          {/* Glass overlay on video */}
          <div className="absolute inset-0 z-10 pointer-events-none rounded-full bg-gradient-to-b from-brand-400/5 via-transparent to-brand-600/10" />

          <video
            ref={videoRef}
            className="w-full h-full object-cover scale-110"
            muted
            loop
            playsInline
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%231a1a2e'/%3E%3Ccircle cx='200' cy='200' r='120' fill='none' stroke='%236366f1' stroke-width='1' opacity='0.3'/%3E%3Ccircle cx='200' cy='200' r='80' fill='none' stroke='%23818cf8' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E"
          >
            <source src="/assets/hero-loop.mp4" type="video/mp4" />
          </video>

          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-full border border-brand-400/10 -m-4" />
          <div className="absolute inset-0 rounded-full border border-brand-400/5 -m-8 hidden md:block" />

          {/* Orbiting dots - FIXED HYDRATION ERROR */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              const r = 50;
              // Round to 3 decimal places to prevent hydration mismatch
              const top = Math.round((50 + Math.sin(angle) * r) * 1000) / 1000;
              const left = Math.round((50 + Math.cos(angle) * r) * 1000) / 1000;
              return (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-brand-400/30"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    animation: `pulse-ring 2s ease-in-out ${i * 0.3}s infinite`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}