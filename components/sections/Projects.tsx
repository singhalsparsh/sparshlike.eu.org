'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Github } from '@/components/ui/brand-icons';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Glow } from '@/components/ui/glow';
import * as Dialog from '@radix-ui/react-dialog';

const projects = [
  {
    title: 'Keythm',
    tagline: 'Typing Test with Mechanical Audio',
    description:
      'A premium typing test application featuring per-key mechanical audio feedback using the Web Audio API. Includes 4 test modes, statistical anti-cheat detection, and full offline PWA support. Designed for typists who appreciate the feel of mechanical keyboards.',
    tech: ['Next.js', 'TypeScript', 'Web Audio API', 'PWA'],
    color: 'from-emerald-500 to-teal-500',
    screenshots: ['/assets/keythm-1.jpg', '/assets/keythm-2.jpg'],
    liveUrl: 'https://keythm.app',
    githubUrl: 'https://github.com/sparsh/keythm',
  },
  {
    title: 'NeuralStudio',
    tagline: 'Visual Deep Learning Studio',
    description:
      'A drag-and-drop deep learning studio that makes neural network design visual and intuitive. Integrates TensorFlow.js for in-browser training, supports API deployment of trained models, and provides real-time visualization of training progress.',
    tech: ['React', 'TensorFlow.js', 'XYFlow', 'Express'],
    color: 'from-teal-500 to-cyan-500',
    screenshots: ['/assets/neural-1.jpg', '/assets/neural-2.jpg'],
    liveUrl: 'https://neuralstudio.dev',
    githubUrl: 'https://github.com/sparsh/neuralstudio',
  },
  {
    title: 'Liquid Glass Portfolio',
    tagline: 'Premium 3D Portfolio',
    description:
      'A cutting-edge portfolio website featuring glassmorphism design, interactive 3D elements with Three.js, scroll-driven animations powered by GSAP, a custom cursor, and smooth dark/light mode transitions. Built for developers who want their work to make a statement.',
    tech: ['Three.js', 'GSAP', 'Tailwind CSS', 'Framer Motion'],
    color: 'from-emerald-400 to-green-500',
    screenshots: ['/assets/portfolio-1.jpg', '/assets/portfolio-2.jpg'],
    liveUrl: 'https://sparshlike.eu.org',
    githubUrl: 'https://github.com/singhalsparsh/portfolio',
  },
];

const logos = [
  'Next.js', 'React', 'TypeScript', 'Node.js', 'Python',
  'AWS', 'Docker', 'GraphQL', 'PostgreSQL', 'MongoDB',
  'Three.js', 'GSAP', 'Tailwind', 'Framer', 'Vercel',
];

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  function openProject(index: number) {
    setSelectedProject(index);
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
      Math.min(projects[selectedProject].screenshots.length - 1, prev + 1)
    );
  }, [selectedProject]);

  // Keyboard navigation
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
    <section id="projects" className="relative section-padding section-glass">
      <div className="glass-overlay-bg" />
      <DotPattern opacity={0.04} />

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="display-2 mb-4">
            Featured
            <span className="text-gradient"> Projects</span>
          </h2>
          <p className="max-w-2xl mx-auto text-foreground/60 text-base md:text-lg leading-relaxed px-4">
            A selection of projects that showcase my passion for building
            exceptional digital experiences with modern technology.
          </p>
        </div>

        {/* Project cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-20">
          {projects.map((project, index) => (
            <LiquidGlassCard key={project.title} className="group cursor-pointer" interactive>
              <button
                onClick={() => openProject(index)}
                className="w-full text-left"
              >
                {/* Preview area */}
                <div
                  className={`h-36 sm:h-40 md:h-48 bg-gradient-to-br ${project.color} flex items-center justify-center`}
                >
                  <div className="text-center p-4">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90 mb-1">
                      {project.title}
                    </div>
                    <div className="text-xs sm:text-sm text-white/60">
                      {project.tagline}
                    </div>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-4 md:p-6 text-center sm:text-left">
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 group-hover:text-brand-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs md:text-sm text-foreground/50 mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 md:gap-2">
                    {project.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20"
                      >
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

        {/* Marquee logo strip */}
        <div className="relative overflow-hidden py-6 md:py-8">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10" />
          <div className="flex animate-marquee gap-8 md:gap-12 whitespace-nowrap">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={`${logo}-${i}`}
                className="inline-flex items-center text-foreground/15 hover:text-foreground/30 transition-colors text-sm md:text-lg font-semibold tracking-wider uppercase"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === PREMIUM LIQUID GLASS MODAL === */}
      <Dialog.Root
        open={selectedProject !== null}
        onOpenChange={(open) => !open && closeProject()}
      >
        <Dialog.Portal>
          {/* Overlay with strong blur */}
          <Dialog.Overlay className="fixed inset-0 z-50 glass-overlay" />

          {/* Modal content - liquid glass shell */}
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
            {/* Modal glow */}
            <Glow
              className="top-0 right-0"
              size={300}
              blur={80}
              color="hsl(var(--brand-400))"
            />

            {selectedProject !== null && (
              <div className="relative w-full max-w-lg sm:max-w-none mx-auto p-5 sm:p-6 md:p-8 pt-14 sm:pt-8">
                {/* Close button */}
                <button
                  onClick={closeProject}
                  className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white/50 hover:text-white hover:bg-black/50 transition-all backdrop-blur-sm"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>

                {/* Project title header */}
                <div className="mb-5 md:mb-6 pr-8">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1">
                    {projects[selectedProject].title}
                  </h3>
                  <p className="text-sm md:text-base text-foreground/60">
                    {projects[selectedProject].tagline}
                  </p>
                </div>

                {/* === IMAGE SLIDER === */}
                <div className="relative h-40 sm:h-52 md:h-64 lg:h-72 rounded-xl overflow-hidden mb-4 md:mb-6 bg-black/40">
                  {/* Slide content */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${projects[selectedProject].color} flex items-center justify-center transition-opacity`}
                  >
                    <div className="text-center p-4">
                      <div className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white/70">
                        {projects[selectedProject].title}
                      </div>
                      <div className="text-xs sm:text-sm text-white/40 mt-2">
                        {projects[selectedProject].tagline} - Slide {slideIndex + 1}
                      </div>
                    </div>
                  </div>

                  {/* Nav arrows */}
                  <button
                    onClick={goToPrev}
                    disabled={slideIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/50 text-white/60 hover:text-white hover:bg-black/70 transition-all disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={goToNext}
                    disabled={slideIndex === projects[selectedProject].screenshots.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/50 text-white/60 hover:text-white hover:bg-black/70 transition-all disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Dot indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
                    {projects[selectedProject].screenshots.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSlideIndex(i)}
                        className={`rounded-full transition-all ${
                          i === slideIndex
                            ? 'bg-white w-5 md:w-6 h-2'
                            : 'bg-white/30 hover:bg-white/50 w-2 h-2'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* Slide counter pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs text-foreground/70">
                    {slideIndex + 1} / {projects[selectedProject].screenshots.length}
                  </div>
                </div>

                {/* === PROJECT DETAILS === */}
                <div className="space-y-5 md:space-y-6">
                  {/* Description */}
                  <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
                    {projects[selectedProject].description}
                  </p>

                  {/* Tech stack */}
                  <div>
                    <div className="text-xs font-medium text-foreground/50 uppercase tracking-wider mb-2.5">
                      Technology Stack
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {projects[selectedProject].tech.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-brand-500/15 text-brand-300 border border-brand-500/25 backdrop-blur-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href={projects[selectedProject].liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GlassButton variant="gradient" size="md">
                        <ExternalLink size={14} />
                        Live Demo
                      </GlassButton>
                    </a>
                    <a
                      href={projects[selectedProject].githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
    </section>
  );
}
