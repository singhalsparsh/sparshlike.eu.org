'use client';

import { useState, useEffect, useCallback } from 'react';
import Lenis from '@studio-freight/lenis';
import { X, ExternalLink, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Github } from '@/components/ui/brand-icons';
import Link from 'next/link';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Glow } from '@/components/ui/glow';
import { allProjects, projectCategories } from '@/lib/portfolio-data';
import * as Dialog from '@radix-ui/react-dialog';

const PROJECTS_PER_PAGE = 3;

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE);

  const filteredProjects = activeFilter === 'All'
    ? allProjects
    : allProjects.filter((p) => p.category === activeFilter);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  function handleFilterChange(cat: string) {
    setActiveFilter(cat);
    setVisibleCount(PROJECTS_PER_PAGE);
    setSelectedProject(null);
  }

  function openProject(index: number) {
    const globalIndex = allProjects.findIndex(
      (p) => p.title === filteredProjects[index].title
    );
    setSelectedProject(globalIndex);
    setSlideIndex(0);
  }

  function closeProject() {
    setSelectedProject(null);
  }

  const goToPrev = useCallback(() => {
    if (selectedProject === null) return;
    setSlideIndex((prev) => Math.max(0, prev - 1));
  }, [selectedProject]);

  const goToNext = useCallback(() => {
    if (selectedProject === null) return;
    setSlideIndex((prev) =>
      Math.min(allProjects[selectedProject].screenshots.length - 1, prev + 1)
    );
  }, [selectedProject]);

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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selectedProject === null) return;
      if (e.key === 'Escape') closeProject();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, goToPrev, goToNext]);

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
              My Work
            </span>
            <h1 className="display-1 mb-6">
              Featured
              <span className="text-gradient block mt-1">Projects</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/60 leading-relaxed">
              A curated collection of projects that showcase my expertise in web development,
              3D graphics, and system design. Each one represents a unique challenge solved.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative section-padding section-glass">
        <div className="glass-overlay-bg" />
        <DotPattern opacity={0.04} />
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-12">
            {projectCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 ${
                  activeFilter === cat
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-[0_4px_20px_hsl(var(--brand-400)/0.3)]'
                    : 'bg-foreground/5 text-foreground/60 hover:text-foreground hover:bg-foreground/10 border border-foreground/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {visibleProjects.map((project, index) => (
              <LiquidGlassCard key={project.title} className="group cursor-pointer" interactive>
                <button onClick={() => openProject(index)} className="w-full text-left">
                  <div className={`h-36 sm:h-40 md:h-48 bg-gradient-to-br ${project.color} flex items-center justify-center rounded-t-2xl`}>
                    <div className="text-center p-4">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90 mb-1">
                        {project.title}
                      </div>
                      <div className="text-xs sm:text-sm text-white/60">{project.tagline}</div>
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 group-hover:text-brand-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs md:text-sm text-foreground/50 mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {project.tech.slice(0, 3).map((t) => (
                        <span key={t} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20">
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium text-foreground/40">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </LiquidGlassCard>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-foreground/40 text-lg">No projects in this category yet.</p>
            </div>
          )}

          {/* Load More Pagination */}
          {hasMore && (
            <div className="text-center mt-10 md:mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + PROJECTS_PER_PAGE)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-gray-500 dark:text-foreground/60 border border-gray-200/60 dark:border-white/10 bg-gray-100/50 dark:bg-foreground/5 hover:text-brand-400 dark:hover:text-brand-300 hover:bg-brand-400/10 hover:border-brand-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                Load More Projects
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {!hasMore && visibleCount > PROJECTS_PER_PAGE && (
            <div className="text-center mt-8 text-sm text-foreground/30">
              Showing all {filteredProjects.length} projects
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-12 md:mt-16">
            <Link href="/contact">
              <GlassButton variant="primary" size="lg">
                Have a project idea?
                <ArrowRight size={16} />
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>

      {/* === PREMIUM LIQUID GLASS MODAL === */}
      <Dialog.Root open={selectedProject !== null} onOpenChange={(open) => !open && closeProject()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 glass-overlay" />
          <Dialog.Content
            className={[
              'fixed z-50',
              'inset-0 flex flex-col items-center justify-center p-3 sm:p-0',
              'sm:block sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:right-auto',
              'sm:-translate-x-1/2 sm:-translate-y-1/2',
              'w-full sm:w-[85vw] md:w-[80vw] lg:w-[70vw] xl:max-w-4xl',
              'max-h-[100dvh] sm:max-h-[88vh]',
              'overflow-y-auto',
              'rounded-none sm:rounded-2xl',
              'glass-modal',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
            ].join(' ')}
          >
            <Glow className="top-0 right-0" size={300} blur={80} color="hsl(var(--brand-400))" />

            {selectedProject !== null && (
              <div className="relative w-full max-w-lg sm:max-w-none mx-auto p-5 sm:p-6 md:p-8 pt-14 sm:pt-8">
                <button onClick={closeProject} className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white/50 hover:text-white hover:bg-black/50 transition-all backdrop-blur-sm" aria-label="Close modal">
                  <X size={16} />
                </button>

                <div className="mb-5 md:mb-6 pr-8">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
                    {allProjects[selectedProject].title}
                  </h3>
                  <p className="text-sm md:text-base text-white/50">
                    {allProjects[selectedProject].tagline}
                  </p>
                </div>

                {/* Image Slider */}
                <div className="relative h-40 sm:h-52 md:h-64 lg:h-72 rounded-xl overflow-hidden mb-4 md:mb-6 bg-black/40">
                  <div className={`absolute inset-0 bg-gradient-to-br ${allProjects[selectedProject].color} flex items-center justify-center transition-opacity`}>
                    <div className="text-center p-4">
                      <div className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white/70">
                        {allProjects[selectedProject].title}
                      </div>
                      <div className="text-xs sm:text-sm text-white/40 mt-2">
                        {allProjects[selectedProject].tagline} &mdash; Slide {slideIndex + 1}
                      </div>
                    </div>
                  </div>

                  <button onClick={goToPrev} disabled={slideIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/50 text-white/60 hover:text-white hover:bg-black/70 transition-all disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm"
                    aria-label="Previous slide">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={goToNext} disabled={slideIndex === allProjects[selectedProject].screenshots.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/50 text-white/60 hover:text-white hover:bg-black/70 transition-all disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm"
                    aria-label="Next slide">
                    <ChevronRight size={18} />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
                    {allProjects[selectedProject].screenshots.map((_, i) => (
                      <button key={i} onClick={() => setSlideIndex(i)}
                        className={`rounded-full transition-all ${i === slideIndex ? 'bg-white w-5 md:w-6 h-2' : 'bg-white/30 hover:bg-white/50 w-2 h-2'}`}
                        aria-label={`Go to slide ${i + 1}`} />
                    ))}
                  </div>

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs text-white/60">
                    {slideIndex + 1} / {allProjects[selectedProject].screenshots.length}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-5 md:space-y-6">
                  <p className="text-sm md:text-base text-white/70 leading-relaxed">
                    {allProjects[selectedProject].longDescription || allProjects[selectedProject].description}
                  </p>

                  <div>
                    <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2.5">
                      Technology Stack
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allProjects[selectedProject].tech.map((t) => (
                        <span key={t} className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-brand-500/15 text-brand-300 border border-brand-500/25 backdrop-blur-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <a href={allProjects[selectedProject].liveUrl} target="_blank" rel="noopener noreferrer">
                      <GlassButton variant="gradient" size="md">
                        <ExternalLink size={14} />
                        Live Demo
                      </GlassButton>
                    </a>
                    <a href={allProjects[selectedProject].githubUrl} target="_blank" rel="noopener noreferrer">
                      <GlassButton variant="primary" size="md">
                        <Github size={14} />
                        Source Code
                      </GlassButton>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}
