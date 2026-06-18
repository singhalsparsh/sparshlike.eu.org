'use client';

import { DotPattern } from '@/components/ui/dot-pattern';

const skillCategories = [
  {
    category: 'Frontend',
    technologies: ['React', 'Next.js', 'TypeScript', 'Three.js', 'Tailwind CSS'],
    years: '5+',
    growth: '90%',
  },
  {
    category: 'Backend',
    technologies: ['Node.js', 'Python', 'Go', 'Express', 'GraphQL'],
    years: '4+',
    growth: '85%',
  },
  {
    category: 'Database',
    technologies: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'Supabase'],
    years: '4+',
    growth: '80%',
  },
  {
    category: 'Cloud & DevOps',
    technologies: ['AWS', 'Docker', 'Vercel', 'Netlify', 'CI/CD'],
    years: '3+',
    growth: '75%',
  },
  {
    category: '3D & Animation',
    technologies: ['Three.js', 'GSAP', 'Framer Motion', 'WebGL', 'Blender'],
    years: '3+',
    growth: '82%',
  },
  {
    category: 'Tools & Workflow',
    technologies: ['Git', 'Figma', 'VS Code', 'Jira', 'Notion'],
    years: '5+',
    growth: '95%',
  },
];

export function Skills() {
  return (
    <section id="skills" className="relative section-padding z-20 section-glass">
      {/* Glass backdrop overlay for readability over 3D */}
      <div className="glass-overlay-bg" />
      <DotPattern opacity={0.04} />

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="display-2 mb-4">
            Skills &amp;
            <span className="text-gradient"> Expertise</span>
          </h2>
          <p className="max-w-2xl mx-auto text-foreground/60 text-sm md:text-lg leading-relaxed px-4">
            A curated collection of technologies and tools I work with daily.
            Each skill represents years of hands-on experience and continuous learning.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-2 sm:px-0">
          {skillCategories.map((skill, index) => (
            <div key={skill.category}>
              <div className="group grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 py-3 sm:py-5 items-center hover:bg-foreground/[0.02] transition-colors rounded-lg px-2 sm:px-4 -mx-2 sm:-mx-4">
                {/* Category */}
                <div className="sm:col-span-3">
                  <span className="text-[11px] sm:text-sm font-semibold text-foreground tracking-wide uppercase">
                    {skill.category}
                  </span>
                </div>

                {/* Technologies */}
                <div className="sm:col-span-5">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {skill.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Years + Growth bar side by side on mobile */}
                <div className="flex sm:col-span-4 items-center justify-between sm:justify-start gap-2 sm:gap-4">
                  {/* Years */}
                  <div className="text-[11px] sm:text-sm text-foreground/40 shrink-0">
                    <span className="text-foreground/80 font-medium">{skill.years}</span> yrs
                  </div>

                  {/* Growth sparkline bar */}
                  <div className="flex-1 sm:flex-initial sm:w-24 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300 transition-all duration-500 group-hover:opacity-80"
                        style={{ width: skill.growth }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-brand-400 min-w-[2.5rem] text-right">
                      {skill.growth}
                    </span>
                  </div>
                </div>
              </div>
              {index < skillCategories.length - 1 && (
                <div className="hairline mx-2 sm:mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
