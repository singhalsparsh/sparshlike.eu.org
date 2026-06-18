'use client';

import { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
import { Github, Linkedin, Twitter } from '@/components/ui/brand-icons';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { DotPattern } from '@/components/ui/dot-pattern';

export function ContactSection() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="relative section-padding z-20 section-glass">
      <div className="glass-overlay-bg" />
      <DotPattern opacity={0.04} />

      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="display-2 mb-4">
            Get in
            <span className="text-gradient"> Touch</span>
          </h2>
          <p className="max-w-2xl mx-auto text-foreground/60 text-sm md:text-lg leading-relaxed px-4">
            Have a project in mind or just want to say hello? I would love to
            hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 px-2 sm:px-0">
          {/* Left: Contact info */}
          <div className="space-y-4 md:space-y-6">
            <LiquidGlassCard className="p-5 md:p-8" interactive glowColor="hsl(var(--brand-400) / 0.15)">
              <h3 className="text-base md:text-xl font-semibold text-foreground mb-4 md:mb-6">
                Contact Information
              </h3>
              <div className="space-y-4 md:space-y-5">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-brand-500/15 shrink-0">
                    <Mail size={16} className="text-brand-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] md:text-xs text-foreground/40 font-medium">Email</div>
                    <a
                      href="mailto:hello@aurasparsh.dev"
                      className="text-xs md:text-base text-foreground/80 hover:text-brand-300 transition-colors truncate block"
                    >
                      hello@aurasparsh.dev
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-brand-500/15 shrink-0">
                    <MapPin size={16} className="text-brand-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] md:text-xs text-foreground/40 font-medium">Location</div>
                    <div className="text-xs md:text-base text-foreground/80">Remote / Worldwide</div>
                  </div>
                </div>
              </div>
            </LiquidGlassCard>

            {/* Social links */}
            <LiquidGlassCard className="p-5 md:p-8" glowColor="hsl(var(--brand-400) / 0.12)">
              <h3 className="text-sm md:text-lg font-semibold text-foreground mb-3 md:mb-4">
                Follow Me
              </h3>
              <div className="flex gap-2 md:gap-3">
                {[
                  { icon: Github, href: 'https://github.com/sparsh', label: 'GitHub' },
                  { icon: Linkedin, href: 'https://linkedin.com/in/sparsh', label: 'LinkedIn' },
                  { icon: Twitter, href: 'https://twitter.com/sparsh', label: 'Twitter' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-foreground/5 hover:bg-brand-500/20 text-foreground/60 hover:text-brand-300 transition-all border border-foreground/5 hover:border-brand-500/20"
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </LiquidGlassCard>
          </div>

          {/* Right: Contact form */}
          <LiquidGlassCard className="p-5 md:p-8" glowColor="hsl(var(--brand-400) / 0.1)">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-8 md:py-12">
                <div className="text-3xl md:text-4xl mb-3 md:mb-4 text-brand-400">&#10003;</div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  Message Sent!
                </h3>
                <p className="text-xs md:text-base text-foreground/60 text-center max-w-xs">
                  Thank you for reaching out. I will get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <h3 className="text-base md:text-xl font-semibold text-foreground mb-3 md:mb-4">
                  Send a Message
                </h3>
                <div>
                  <label htmlFor="contact-name" className="block text-xs md:text-sm font-medium text-foreground/50 mb-1.5 md:mb-2">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-foreground/[0.03] border border-foreground/10 px-4 md:px-5 py-3.5 md:py-3.5 text-sm md:text-base text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:bg-foreground/[0.05] transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs md:text-sm font-medium text-foreground/50 mb-1.5 md:mb-2">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-foreground/[0.03] border border-foreground/10 px-4 md:px-5 py-3.5 md:py-3.5 text-sm md:text-base text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:bg-foreground/[0.05] transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-xs md:text-sm font-medium text-foreground/50 mb-1.5 md:mb-2">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-foreground/[0.03] border border-foreground/10 px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:bg-foreground/[0.05] transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <GlassButton variant="gradient" size="md" type="submit" className="w-full text-sm py-3">
                  <Send size={16} />
                  Send Message
                </GlassButton>
              </form>
            )}
          </LiquidGlassCard>
        </div>
      </div>
    </section>
  );
}
