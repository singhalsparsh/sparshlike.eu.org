'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUp, Mail, Heart, Star, Sparkles, Globe } from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/brand-icons';

export function Footer() {
  const [email, setEmail] = useState('');

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      // Placeholder — in production connect to an API
      alert(`Thanks for subscribing, ${email}!`);
      setEmail('');
    }
  }

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/sparsh', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/sparsh', label: 'LinkedIn' },
    { icon: Globe, href: 'https://x.com/sparsh', label: 'X / Twitter' },
    { icon: Globe, href: 'https://instagram.com/sparsh', label: 'Instagram' },
  ];

  const resourceLinks = [
    { label: 'Source Code', href: '#' },
    { label: 'Color Themes', href: '#' },
    { label: 'Uses', href: '/uses' },
    { label: 'Guestbook', href: '/guestbook' },
  ];

  return (
    <footer className="relative z-20 glass-footer">
      <div className="relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-8 sm:pb-10">
          {/* Main grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-4 text-center sm:text-left">
              <Link href="/" className="inline-flex items-center justify-center sm:justify-start gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
                  SPARSH
                </span>
              </Link>
              <p className="text-sm text-foreground/45 leading-relaxed max-w-xs mx-auto sm:mx-0 mb-5">
                Building premium digital experiences with cutting-edge technology.
                Let&apos;s create something remarkable together.
              </p>

              {/* Social links */}
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 hover:bg-brand-500/15 text-foreground/40 hover:text-brand-300 border border-foreground/5 hover:border-brand-500/20 transition-all"
                    aria-label={social.label}
                  >
                    <social.icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-4">
                Navigation
              </h4>
              <ul className="space-y-3 sm:space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/45 hover:text-brand-300 transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-0.5 h-0.5 rounded-full bg-brand-400/0 group-hover:bg-brand-400 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="text-center sm:text-left">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-4">
                Resources
              </h4>
              <ul className="space-y-3 sm:space-y-2.5">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/45 hover:text-brand-300 transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-0.5 h-0.5 rounded-full bg-brand-400/0 group-hover:bg-brand-400 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter / CTA */}
            <div className="lg:col-span-4 text-center sm:text-left">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-4">
                Stay Updated
              </h4>
              <p className="text-sm text-foreground/45 mb-4 leading-relaxed">
                Get notified about new blog posts, projects, and everything in between.
              </p>
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto sm:mx-0">
                <div className="flex-1 relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/25" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full rounded-full bg-foreground/[0.05] border border-foreground/10 pl-9 pr-4 py-3 sm:py-2.5 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 px-5 py-3 sm:py-2.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold hover:shadow-[0_4px_20px_hsl(var(--brand-400)/0.3)] transition-all hover:scale-[1.02]"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Divider */}
          <div className="hairline my-6 sm:my-8" />

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-foreground/30 text-center md:text-left">
              <Heart size={9} className="text-brand-400 shrink-0" />
              &copy; {new Date().getFullYear()} Sparsh Singhal. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] sm:text-xs text-foreground/25">
              <Star size={9} className="text-brand-400/50 shrink-0" />
              <span>Built with</span>
              <span className="text-foreground/40 font-medium">Next.js</span>
              <span className="text-foreground/20">&amp;</span>
              <span className="text-foreground/40 font-medium">Three.js</span>
              <span className="w-1 h-1 rounded-full bg-foreground/10 mx-0.5" />
              <span className="text-foreground/30">{new Date().getFullYear() - 2024}th edition</span>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[10px] sm:text-xs text-foreground/30 hover:text-brand-300 transition-colors group"
              aria-label="Back to top"
            >
              Back to top
              <ArrowUp size={10} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
