'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Testimonials } from '@/components/sections/Testimonials';
import { ContactSection } from '@/components/sections/Contact';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { DotPattern } from '@/components/ui/dot-pattern';
import { blogPosts } from '@/lib/portfolio-data';

export default function HomePage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function onFrame(time: number) {
      lenis.raf(time);
    }

    requestAnimationFrame(function animate(time: number) {
      onFrame(time);
      requestAnimationFrame(animate);
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative z-30">
      <Hero />

      {/* About Preview */}
      <About />

      {/* Featured Projects */}
      <Projects />

      {/* Latest Blog Posts Preview */}
      <section className="relative section-padding section-glass">
        <div className="glass-overlay-bg" />
        <DotPattern opacity={0.04} />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="display-2 mb-4">
              Latest from the
              <span className="text-gradient"> Blog</span>
            </h2>
            <p className="max-w-2xl mx-auto text-foreground/60 text-sm md:text-lg leading-relaxed px-4">
              Thoughts, tutorials, and insights on web development, 3D graphics,
              and building premium digital products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <LiquidGlassCard className="group cursor-pointer h-full" interactive>
                  <div className="p-4 sm:p-6 flex flex-col h-full">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      {post.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-2 group-hover:text-brand-300 transition-colors leading-snug sm:leading-normal">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-foreground/50 mb-4 flex-1 leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-foreground/5">
                      <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-foreground/40">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} className="sm:hidden" />
                          <Calendar size={12} className="hidden sm:block" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} className="sm:hidden" />
                          <Clock size={12} className="hidden sm:block" />
                          {post.readTime}
                        </span>
                      </div>
                      <span className="text-xs text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1">
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </LiquidGlassCard>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10 md:mt-12">
            <Link href="/blog">
              <GlassButton variant="primary" size="md">
                View All Posts
                <ArrowRight size={14} />
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Let's Work Together CTA */}
      <section className="relative section-padding section-glass">
        <div className="glass-overlay-bg" />
        <DotPattern opacity={0.04} />
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h2 className="display-2 mb-4">
            Let&apos;s Build Something
            <span className="text-gradient block mt-1">Amazing Together</span>
          </h2>
          <p className="text-foreground/60 text-sm md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            I am always open to discussing new projects, creative ideas, or opportunities
            to be part of your vision. Whether you need a full application, a 3D experience,
            or just want to brainstorm, I&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link href="/contact">
              <GlassButton variant="gradient" size="lg">
                Get in Touch
                <ArrowRight size={16} />
              </GlassButton>
            </Link>
            <Link href="/projects">
              <GlassButton variant="primary" size="lg">
                View My Work
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
