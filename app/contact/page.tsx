'use client';

import { useState, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { Mail, MapPin, Send, Sparkles, Clock, Check, Globe, ArrowUpRight } from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/brand-icons';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Glow } from '@/components/ui/glow';

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

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
      {/* Hero */}
      <section className="relative section-padding pt-40 pb-16 md:pb-24 section-glass">
        <div className="glass-overlay-bg" />
        <Glow className="top-1/4 left-1/2 -translate-x-1/2" size={500} blur={120} />
        <DotPattern opacity={0.05} />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-brand-400" />
              <span className="text-xs font-medium text-brand-400 tracking-wider uppercase">Get in Touch</span>
            </div>
            <h1 className="display-1 mb-6">
              Let&apos;s
              <span className="text-gradient block mt-1">Connect</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/60 leading-relaxed max-w-2xl">
              Have a project in mind, a question, or just want to say hello? I would love
              to hear from you. I typically respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="relative section-padding section-glass">
        <div className="glass-overlay-bg" />
        <DotPattern opacity={0.04} />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Left Sidebar - Contact Info */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <LiquidGlassCard className="p-5 md:p-8" glowColor="hsl(var(--brand-400) / 0.12)">
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-5">
                  Contact Information
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-brand-500/15 shrink-0">
                      <Mail size={16} className="text-brand-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] md:text-xs text-foreground/40 font-medium">Email</div>
                      <a href="mailto:hello@aurasparsh.dev" className="text-xs md:text-sm text-foreground/80 hover:text-brand-300 transition-colors truncate block">
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
                      <div className="text-xs md:text-sm text-foreground/80">Remote / Worldwide</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-brand-500/15 shrink-0">
                      <Clock size={16} className="text-brand-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] md:text-xs text-foreground/40 font-medium">Response Time</div>
                      <div className="text-xs md:text-sm text-foreground/80">Within 24 hours</div>
                    </div>
                  </div>
                </div>
              </LiquidGlassCard>

              {/* Social Links */}
              <LiquidGlassCard className="p-5 md:p-8" glowColor="hsl(var(--brand-400) / 0.1)">
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-brand-400" />
                  Find Me Online
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { icon: Github, href: 'https://github.com/sparsh', label: 'GitHub', handle: '@sparsh', color: 'hover:border-[#333] hover:bg-[#333]/10' },
                    { icon: Linkedin, href: 'https://linkedin.com/in/sparsh', label: 'LinkedIn', handle: '/in/sparsh', color: 'hover:border-[#0a66c2] hover:bg-[#0a66c2]/10' },
                    { icon: Globe, href: 'https://x.com/sparsh', label: 'X (Twitter)', handle: '@sparsh', color: 'hover:border-foreground hover:bg-foreground/5' },
                    { icon: Globe, href: 'https://instagram.com/sparsh', label: 'Instagram', handle: '@sparsh', color: 'hover:border-[#e4405f] hover:bg-[#e4405f]/10' },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl bg-foreground/[0.03] border border-foreground/8 hover:border-brand-500/30 hover:bg-brand-500/10 transition-all duration-200 ${social.color}`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                        <social.icon size={18} className="text-foreground/50 group-hover:text-brand-300 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                          {social.label}
                        </div>
                        <div className="text-xs text-foreground/35 group-hover:text-foreground/50 transition-colors">
                          {social.handle}
                        </div>
                      </div>
                      <div className="shrink-0 w-8 h-8 rounded-full bg-foreground/5 group-hover:bg-brand-500/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <ArrowUpRight size={14} className="text-brand-300" />
                      </div>
                    </a>
                  ))}
                </div>
              </LiquidGlassCard>

              {/* Office Hours */}
              <LiquidGlassCard className="p-5 md:p-8" glowColor="hsl(var(--brand-400) / 0.08)">
                <h3 className="text-sm md:text-base font-semibold text-foreground mb-3">
                  Office Hours
                </h3>
                <div className="space-y-2 text-xs md:text-sm text-foreground/60">
                  <div className="flex justify-between">
                    <span>Mon - Fri</span>
                    <span className="text-foreground/80">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sat</span>
                    <span className="text-foreground/80">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sun</span>
                    <span className="text-brand-400">Closed</span>
                  </div>
                </div>
                <p className="text-[10px] md:text-xs text-foreground/40 mt-3">
                  All times are in EST (UTC -5). I try to respond to every message within 24 hours.
                </p>
              </LiquidGlassCard>
            </div>

            {/* Right - Contact Form */}
            <div className="lg:col-span-3">
              <LiquidGlassCard className="p-6 md:p-8 lg:p-10" glowColor="hsl(var(--brand-400) / 0.1)">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 md:py-16">
                    <div className="w-16 h-16 rounded-full bg-brand-500/15 flex items-center justify-center mb-4">
                      <Check size={28} className="text-brand-400" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-sm md:text-base text-foreground/60 text-center max-w-sm">
                      Thank you for reaching out! I have received your message and will
                      get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setFormState({ name: '', email: '', subject: '', message: '' }); }}
                      className="mt-6 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">
                        Send a Message
                      </h3>
                      <p className="text-xs md:text-sm text-foreground/40">
                        Fill out the form below and I will get back to you as soon as possible.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs md:text-sm font-medium text-foreground/50 mb-1.5">
                          Name <span className="text-brand-400">*</span>
                        </label>
                        <input id="contact-name" name="name" type="text" required
                          value={formState.name} onChange={handleChange}
                          className="w-full rounded-xl bg-foreground/[0.03] border border-foreground/10 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:bg-foreground/[0.05] transition-all"
                          placeholder="Your name" />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-xs md:text-sm font-medium text-foreground/50 mb-1.5">
                          Email <span className="text-brand-400">*</span>
                        </label>
                        <input id="contact-email" name="email" type="email" required
                          value={formState.email} onChange={handleChange}
                          className="w-full rounded-xl bg-foreground/[0.03] border border-foreground/10 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:bg-foreground/[0.05] transition-all"
                          placeholder="your@email.com" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="block text-xs md:text-sm font-medium text-foreground/50 mb-1.5">
                        Subject
                      </label>
                      <input id="contact-subject" name="subject" type="text"
                        value={formState.subject} onChange={handleChange}
                        className="w-full rounded-xl bg-foreground/[0.03] border border-foreground/10 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:bg-foreground/[0.05] transition-all"
                        placeholder="What is this about?" />
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-xs md:text-sm font-medium text-foreground/50 mb-1.5">
                        Message <span className="text-brand-400">*</span>
                      </label>
                      <textarea id="contact-message" name="message" required rows={5}
                        value={formState.message} onChange={handleChange}
                        className="w-full rounded-xl bg-foreground/[0.03] border border-foreground/10 px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 focus:bg-foreground/[0.05] transition-all resize-none"
                        placeholder="Tell me about your project, idea, or just say hello..." />
                    </div>

                    <GlassButton variant="gradient" size="lg" type="submit" className="w-full text-sm py-3.5">
                      <Send size={16} />
                      Send Message
                    </GlassButton>

                    <p className="text-[10px] md:text-xs text-foreground/30 text-center">
                      I will never share your email with third parties. By submitting, you agree
                      to my privacy policy.
                    </p>
                  </form>
                )}
              </LiquidGlassCard>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
