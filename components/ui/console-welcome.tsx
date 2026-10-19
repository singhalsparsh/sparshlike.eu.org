'use client';

import { useEffect } from 'react';

const STYLES = {
  title: 'font-size: 24px; font-weight: 800; color: #6366f1;',
  subtitle: 'font-size: 14px; font-weight: 500; color: #a5b4fc;',
  link: 'font-size: 12px; color: #818cf8; text-decoration: underline;',
  muted: 'font-size: 11px; color: #64748b;',
  brand: 'font-size: 13px; font-weight: 600; color: #818cf8;',
};

const ASCII = `
   ╔══════════════════════════════════════════╗
   ║     ✦  SPARSH SINGHAL PORTFOLIO  ✦       ║
   ║     Built with Next.js + Three.js        ║
   ╚══════════════════════════════════════════╝
`;

export function ConsoleWelcome() {
  useEffect(() => {
    console.log(`%c${ASCII}`, 'color: #6366f1; font-weight: bold;');
    console.log('%c🚀 Welcome to Sparsh Singhal Portfolio!', STYLES.title);
    console.log('%c👨‍💻 Systems & AI Developer • KIET Undergrad', STYLES.subtitle);
    console.log('%c⚡ Tech Stack: C++ · Python · Generative AI · React · Next.js · Linux (Ubuntu 26.04)', STYLES.muted);
    console.log('%c🔗 %chttps://sparshlike.eu.org', STYLES.link, STYLES.link);
    console.log('%c📧 %chello@sparshlike.eu.org', STYLES.link, STYLES.link);
    console.log('%c💜 Open to Collaborations & Engineering Challenges!', STYLES.brand);
  }, []);

  return null;
}
