'use client';

import { Code2, Database, Globe, Layers } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { DotPattern } from '@/components/ui/dot-pattern';

const highlights = [
  {
    icon: Code2,
    label: 'Core Languages',
    value: 'C++, Python, TypeScript, C',
    description: 'High-performance algorithms, system programming, and modern web application development.',
  },
  {
    icon: Database,
    label: 'AI / ML & Frameworks',
    value: 'Generative AI, PyTorch, APIs',
    description: 'Building generative diffusion platforms, model integration, and fast inference pipelines.',
  },
  {
    icon: Globe,
    label: 'Linux-Native Dev',
    value: 'Ubuntu 26.04 Native',
    description: '100% Linux environment for compiling, low-level testing, model workloads, and Git workflows.',
  },
  {
    icon: Layers,
    label: 'Problem Solving',
    value: '200+ LeetCode Solved',
    description: 'LeetCode 50 Days Badge 2026 holder with intensive focus on DSA, recursion, and trees.',
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
            First-year undergraduate student pursuing B.Tech in Computer Science and Engineering
            with a specialization in Artificial Intelligence at KIET Deemed to be University.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-2 sm:px-0">
          {/* Bio card - spans full width */}
          <LiquidGlassCard className="p-5 md:p-8 md:col-span-2" interactive glowColor="hsl(var(--brand-400) / 0.12)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="text-center sm:text-left">
                <h3 className="text-base md:text-xl font-semibold text-foreground mb-3 md:mb-4">
                  Building Intelligent Applications &amp; Systems with Modern Architecture
                </h3>
                <p className="text-xs md:text-base text-foreground/60 leading-relaxed mb-3 md:mb-4">
                  I focus on core problem-solving, building AI-integrated web applications, and low-level development—supported
                  by intensive Data Structures &amp; Algorithms practice in C++ and Python.
                </p>
                <p className="text-xs md:text-base text-foreground/60 leading-relaxed">
                  My development workflow is 100% Linux-native on Ubuntu 26.04, allowing seamless
                  integration with low-level systems, shell scripting, and computational model toolchains.
                </p>
              </div>
              <div className="glass-strong rounded-xl p-4 md:p-6 text-center sm:text-left">
                <div className="text-3xl md:text-5xl font-bold text-gradient mb-2">200+</div>
                <div className="text-xs md:text-sm text-foreground/60">Problems Solved (LeetCode 50 Days Badge 2026)</div>
                <div className="hairline my-3 md:my-4" />
                <div className="space-y-2 md:space-y-3">
                  <div>
                    <div className="text-xs md:text-sm text-foreground/80 font-medium">Academic &amp; Training Focus</div>
                    <div className="text-[10px] md:text-xs text-foreground/40 mt-1">
                      B.Tech CSE (AI) @ KIET (2026–2030) • DSA Trainee @ Coding Blocks • Discrete Math &amp; Systems
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
