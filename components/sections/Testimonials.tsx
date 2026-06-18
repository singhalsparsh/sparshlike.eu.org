'use client';

import { Quote } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { DotPattern } from '@/components/ui/dot-pattern';

const testimonials = [
  {
    quote:
      'Working with Sparsh transformed our product. His attention to detail and code quality is exceptional. He delivered ahead of schedule and exceeded all expectations.',
    name: 'Daniel R.',
    role: 'CTO',
    company: 'TechVentures Inc.',
    initials: 'DR',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    quote:
      'Sparsh caught problems we did not even know existed. Fixed them without being asked. That is the kind of developer you want on your team.',
    name: 'James L.',
    role: 'Co-founder',
    company: 'StartupHub',
    initials: 'JL',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    quote:
      'The animations feel intentional, the typography is perfect. Three clients have asked us who built the site. His work speaks for itself.',
    name: 'Sofia M.',
    role: 'Creative Director',
    company: 'DesignStudio Co.',
    initials: 'SM',
    color: 'from-emerald-400 to-green-500',
  },
  {
    quote:
      'Sparsh is the most technically proficient developer I have worked with. His ability to translate complex requirements into elegant, performant solutions is remarkable. A true asset to any team.',
    name: 'Alex K.',
    role: 'Lead Engineer',
    company: 'ScaleUp Labs',
    initials: 'AK',
    color: 'from-teal-400 to-emerald-500',
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative section-padding z-20 section-glass">
      <div className="glass-overlay-bg" />
      <DotPattern opacity={0.04} />

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="display-2 mb-4">
            What People
            <span className="text-gradient"> Say</span>
          </h2>
          <p className="max-w-2xl mx-auto text-foreground/60 text-sm md:text-lg leading-relaxed px-4">
            Feedback from clients, employers, and collaborators I have had the
            privilege of working with.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {testimonials.map((item) => (
            <LiquidGlassCard
              key={item.name}
              className="p-5 md:p-6 flex flex-col text-center sm:text-left"
              interactive
              glowColor="hsl(var(--brand-400) / 0.1)"
            >
              {/* Quote icon */}
              <div className="mb-3 md:mb-4 flex justify-center sm:justify-start">
                <Quote size={18} className="text-brand-400/40" />
              </div>

              {/* Quote text */}
              <blockquote className="text-foreground/70 leading-relaxed mb-5 md:mb-6 flex-1 text-xs md:text-sm">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-3 md:pt-4 border-t border-foreground/5">
                <div
                  className={`h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-[10px] md:text-xs font-bold text-white shrink-0`}
                >
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-xs md:text-sm font-medium text-foreground truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] md:text-xs text-foreground/40 truncate">
                    {item.role}, {item.company}
                  </div>
                </div>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
