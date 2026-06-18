'use client';

import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Glow } from '@/components/ui/glow';
import { blogPosts } from '@/lib/portfolio-data';

const POSTS_PER_PAGE = 3;

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

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

  // Reset pagination when search changes
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [searchQuery]);

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <main className="relative z-30 min-h-screen">
      {/* Hero */}
      <section className="relative section-padding pt-40 pb-16 md:pb-24 section-glass">
        <div className="glass-overlay-bg" />
        <Glow className="top-1/4 left-1/2 -translate-x-1/2" size={500} blur={120} />
        <DotPattern opacity={0.05} />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-medium text-brand-400 tracking-wider uppercase mb-4 block">
              Blog
            </span>
            <h1 className="display-1 mb-6">
              Latest Thoughts
              <span className="text-gradient block mt-1">&amp; Tutorials</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/60 leading-relaxed">
              Insights, tutorials, and deep dives into web development, 3D graphics,
              and building premium digital products.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-md mx-auto relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts by title, tag, or keyword..."
                className="glass-input w-full pl-11 pr-5 py-3.5 text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="relative section-padding section-glass">
        <div className="glass-overlay-bg" />
        <DotPattern opacity={0.04} />
        <div className="container mx-auto max-w-7xl relative z-10">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4 opacity-30">&#128269;</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
              <p className="text-sm text-foreground/40 mb-4">
                No blog posts match your search for &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {visiblePosts.map((post) => (
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
                        <p className="text-xs sm:text-sm text-foreground/50 mb-4 flex-1 leading-relaxed">
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

              {/* Pagination - Load More */}
              {hasMore && (
                <div className="text-center mt-10 md:mt-12">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + POSTS_PER_PAGE)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/70 hover:text-foreground hover:bg-foreground/10 text-sm font-medium transition-all"
                  >
                    Load More Posts
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {!hasMore && visibleCount > POSTS_PER_PAGE && (
                <div className="text-center mt-8 text-sm text-foreground/30">
                  Showing all {filteredPosts.length} posts
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative section-padding section-glass">
        <div className="glass-overlay-bg" />
        <DotPattern opacity={0.04} />
        <div className="container mx-auto max-w-3xl relative z-10 text-center">
          <h2 className="display-2 mb-4">
            Want to stay <span className="text-gradient">updated?</span>
          </h2>
          <p className="text-foreground/60 text-sm md:text-base mb-8 max-w-xl mx-auto">
            Follow me for more insights on web development, 3D graphics, and
            building premium digital experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <GlassButton variant="gradient" size="md">
                Subscribe by Email
                <ArrowRight size={14} />
              </GlassButton>
            </Link>
            <Link href="/">
              <GlassButton variant="primary" size="md">
                Back to Home
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
