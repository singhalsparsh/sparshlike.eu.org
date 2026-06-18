'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Glow } from '@/components/ui/glow';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { timeline, education, funFacts } from '@/lib/portfolio-data';
import { Code2, Briefcase, GraduationCap, Smile, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { GlassButton } from '@/components/ui/glass-button';

const skillAreas = [
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Framer Motion'],
    icon: Code2,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Python', 'Go', 'Express', 'GraphQL', 'PostgreSQL'],
    icon: Code2,
    color: 'from-teal-500 to-cyan-500',
  },
  {
    title: 'Cloud & DevOps',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Vercel', 'CI/CD', 'Netlify'],
    icon: Code2,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    title: '3D & Animation',
    skills: ['Three.js', 'GSAP', 'WebGL', 'Blender', 'Framer Motion', 'Lenis'],
    icon: Code2,
    color: 'from-purple-500 to-pink-500',
  },
];

export default function AboutPage() {
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
    <main className="relative z-30 min-h-screen">
      {/* Hero Section */}
      <section className="relative section-padding pt-40 pb-16 md:pb-24 section-glass">
        <div className="glass-overlay-bg" />
        <Glow className="top-1/4 left-1/2 -translate-x-1/2" size={500} blur={120} />
        <DotPattern opacity={0.05} />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-medium text-brand-400 tracking-wider uppercase">About Me</span>
            </div>
            <h1 className="display-1 mb-6">
              Building the
              <span className="text-gradient block mt-1">Future,</span>
              <span className="block mt-1">One Line at a Time</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/60 leading-relaxed max-w-2xl">
              I am a full-stack developer with 5+ years of experience crafting premium digital
              experiences. My passion lies at the intersection of beautiful design and robust
              engineering, creating applications that delight users and stand the test of time.
            </p>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="relative section-padding section-glass">
        <div className="glass-overlay-bg" />
        <DotPattern opacity={0.04} />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="display-2 mb-6">
                My <span className="text-gradient">Journey</span>
              </h2>
              <div className="space-y-4 text-foreground/60 text-sm md:text-base leading-relaxed">
                <p>
                  My journey in software development began with curiosity and grew into a lifelong
                  craft. I believe in writing code that is clean, maintainable, and delightful to use.
                  Every project is an opportunity to push boundaries and create something remarkable.
                </p>
                <p>
                  Over the past 5 years, I have worked with startups and established companies alike,
                  delivering solutions that span the full stack — from interactive 3D web experiences
                  to scalable backend systems handling millions of requests.
                </p>
                <p>
                  When I am not coding, you will find me exploring new technologies, contributing to
                  open source projects, or mentoring aspiring developers through community programs.
                </p>
              </div>
              <div className="mt-6 flex gap-3 md:gap-4 flex-wrap">
                <div className="glass-strong rounded-xl p-3 md:p-4 text-center flex-1 min-w-[80px] md:min-w-[100px]">
                  <div className="text-lg md:text-2xl font-bold text-gradient">5+</div>
                  <div className="text-[10px] md:text-xs text-foreground/40 mt-1">Years Exp.</div>
                </div>
                <div className="glass-strong rounded-xl p-3 md:p-4 text-center flex-1 min-w-[80px] md:min-w-[100px]">
                  <div className="text-lg md:text-2xl font-bold text-gradient">50+</div>
                  <div className="text-[10px] md:text-xs text-foreground/40 mt-1">Projects</div>
                </div>
                <div className="glass-strong rounded-xl p-3 md:p-4 text-center flex-1 min-w-[80px] md:min-w-[100px]">
                  <div className="text-lg md:text-2xl font-bold text-gradient">30+</div>
                  <div className="text-[10px] md:text-xs text-foreground/40 mt-1">Clients</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {skillAreas.map((area) => (
                <LiquidGlassCard key={area.title} className="p-4 md:p-5" glowColor="hsl(var(--brand-400) / 0.1)">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${area.color} flex items-center justify-center mb-3`}>
                    <area.icon size={14} className="text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{area.title}</h3>
                  <div className="flex flex-wrap gap-1">
                    {area.skills.slice(0, 3).map((s) => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                        {s}
                      </span>
                    ))}
                    {area.skills.length > 3 && (
                      <span className="text-[10px] text-foreground/40">+{area.skills.length - 3}</span>
                    )}
                  </div>
                </LiquidGlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="relative section-padding section-glass">
        <div className="glass-overlay-bg" />
        <DotPattern opacity={0.04} />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Briefcase size={18} className="text-brand-400" />
              <span className="text-xs font-medium text-brand-400 tracking-wider uppercase">Experience</span>
            </div>
            <h2 className="display-2 mb-4">
              Where I have <span className="text-gradient">Worked</span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-400/50 via-brand-400/20 to-transparent -translate-x-1/2" />

            <div className="space-y-12 md:space-y-16">
              {timeline.map((item, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className="absolute left-0 md:left-1/2 w-3 h-3 rounded-full bg-brand-400 border-2 border-background -translate-x-1/2 mt-1.5 z-10" />

                  {/* Content */}
                  <div className={`ml-6 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                    <LiquidGlassCard className="p-5 md:p-6" glowColor="hsl(var(--brand-400) / 0.08)">
                      <span className="text-[10px] md:text-xs font-medium text-brand-400 uppercase tracking-wider">
                        {item.period}
                      </span>
                      <h3 className="text-base md:text-lg font-semibold text-foreground mt-1">{item.role}</h3>
                      <p className="text-xs md:text-sm text-foreground/50 mb-2">{item.company}</p>
                      <p className="text-xs md:text-sm text-foreground/60 leading-relaxed">
                        {item.description}
                      </p>
                    </LiquidGlassCard>
                  </div>

                  {/* Empty space for the other side */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="relative section-padding section-glass">
        <div className="glass-overlay-bg" />
        <DotPattern opacity={0.04} />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap size={18} className="text-brand-400" />
              <span className="text-xs font-medium text-brand-400 tracking-wider uppercase">Education</span>
            </div>
            <h2 className="display-2 mb-4">
              <span className="text-gradient">Learning</span> Journey
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            {education.map((item) => (
              <LiquidGlassCard key={item.degree} className="p-6 md:p-8" glowColor="hsl(var(--brand-400) / 0.08)">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                    <GraduationCap size={20} className="text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-foreground">{item.degree}</h3>
                    <p className="text-sm text-brand-400">{item.school}</p>
                    <p className="text-xs text-foreground/40 mt-1">{item.year}</p>
                    <p className="text-sm text-foreground/60 mt-3 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Facts */}
      <section className="relative section-padding section-glass">
        <div className="glass-overlay-bg" />
        <DotPattern opacity={0.04} />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Smile size={18} className="text-brand-400" />
              <span className="text-xs font-medium text-brand-400 tracking-wider uppercase">Beyond Code</span>
            </div>
            <h2 className="display-2 mb-4">
              Fun <span className="text-gradient">Facts</span>
            </h2>
            <p className="text-foreground/60 text-sm md:text-base">
              A glimpse into the person behind the keyboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {funFacts.map((fact) => (
              <LiquidGlassCard key={fact.fact} className="p-5 md:p-6" glowColor="hsl(var(--brand-400) / 0.06)">
                <div className="text-2xl mb-3">{fact.emoji}</div>
                <p className="text-sm text-foreground/70 leading-relaxed">{fact.fact}</p>
              </LiquidGlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative section-padding section-glass">
        <div className="glass-overlay-bg" />
        <DotPattern opacity={0.04} />
        <div className="container mx-auto max-w-3xl relative z-10 text-center">
          <h2 className="display-2 mb-4">
            Want to work <span className="text-gradient">together?</span>
          </h2>
          <p className="text-foreground/60 text-sm md:text-base mb-8 max-w-xl mx-auto">
            I am always open to discussing new projects, creative ideas, or opportunities
            to be part of your vision.
          </p>
          <Link href="/contact">
            <GlassButton variant="gradient" size="lg">
              Get in Touch
              <ArrowRight size={14} />
            </GlassButton>
          </Link>
        </div>
      </section>
    </main>
  );
}
