'use client';

import { Code2, Database, Globe, Layers } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { DotPattern } from '@/components/ui/dot-pattern';

const highlights = [
  {
    icon: Code2,
    label: 'Frontend',
    value: 'React, Next.js, Three.js',
    description: 'Building beautiful, performant UIs with modern frameworks and 3D web graphics.',
  },
  {
    icon: Database,
    label: 'Backend',
    value: 'Node.js, Python, Go',
    description: 'Designing scalable APIs and microservices with robust architectures.',
  },
  {
    icon: Globe,
    label: 'Cloud',
    value: 'AWS, Vercel, Netlify',
    description: 'Deploying and managing infrastructure for high-availability applications.',
  },
  {
    icon: Layers,
    label: 'Full Stack',
    value: 'End-to-End Development',
    description: 'From concept to deployment, delivering complete solutions that exceed expectations.',
  },
];

export function About() {
  return (
    <section id="about" className="relative section-padding z-20 section-glass">
      <div className="glass-overlay-bg" />
      <DotPattern opacity={0.05} />

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="display-2 mb-4">
            About
            <span className="text-gradient"> Me</span>
          </h2>
          <p className="max-w-2xl mx-auto text-foreground/60 text-sm md:text-lg leading-relaxed px-4">
            I am a full-stack developer with a passion for building premium digital
            experiences. With over 5 years of experience, I specialize in creating
            applications that blend beautiful design with robust engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-2 sm:px-0">
          {/* Bio card - spans full width */}
          <LiquidGlassCard className="p-5 md:p-8 md:col-span-2" interactive glowColor="hsl(var(--brand-400) / 0.12)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="text-center sm:text-left">
                <h3 className="text-base md:text-xl font-semibold text-foreground mb-3 md:mb-4">
                  Building the Future, One Line of Code at a Time
                </h3>
                <p className="text-xs md:text-base text-foreground/60 leading-relaxed mb-3 md:mb-4">
                  My journey in software development started with curiosity and grew into
                  a craft. I believe in writing code that is clean, maintainable, and
                  delightful to use. Every project is an opportunity to push boundaries
                  and create something remarkable.
                </p>
                <p className="text-xs md:text-base text-foreground/60 leading-relaxed">
                  When I am not coding, you will find me exploring new technologies,
                  contributing to open source, or mentoring aspiring developers.
                </p>
              </div>
              <div className="glass-strong rounded-xl p-4 md:p-6 text-center sm:text-left">
                <div className="text-3xl md:text-5xl font-bold text-gradient mb-2">5+</div>
                <div className="text-xs md:text-sm text-foreground/60">Years of Experience</div>
                <div className="hairline my-3 md:my-4" />
                <div className="space-y-2 md:space-y-3">
                  <div>
                    <div className="text-xs md:text-sm text-foreground/80 font-medium">Technologies Mastered</div>
                    <div className="text-[10px] md:text-xs text-foreground/40 mt-1">
                      TypeScript, React, Next.js, Node.js, Python, AWS, Docker, Three.js, and more.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </LiquidGlassCard>

          {/* Highlight cards */}
          {highlights.map((item) => (
            <LiquidGlassCard key={item.label} className="p-4 md:p-6 text-center sm:text-left" interactive glowColor="hsl(var(--brand-400) / 0.1)">
              <div className="flex items-center justify-center sm:justify-start gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-brand-500/10">
                  <item.icon size={16} className="text-brand-400" />
                </div>
                <span className="text-xs md:text-sm font-medium text-brand-400">{item.label}</span>
              </div>
              <div className="text-sm md:text-lg font-semibold text-foreground mb-1 md:mb-2">{item.value}</div>
              <p className="text-[11px] md:text-sm text-foreground/50 leading-relaxed">{item.description}</p>
            </LiquidGlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
