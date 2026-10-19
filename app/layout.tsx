import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/sections/Footer';
import { ToastProvider } from '@/components/ui/toast';
import { SkipLink } from '@/components/ui/skip-link';
import { MusicPlayerProvider } from '@/components/music';

// ── Lazy-loaded non-critical components (code-split, server-rendered) ──
const CustomCursor = dynamic(() => import('@/components/ui/custom-cursor').then((m) => m.CustomCursor));
const ScrollProgress = dynamic(() => import('@/components/ui/scroll-progress').then((m) => m.ScrollProgress));
const AnimatedBackground = dynamic(() => import('@/components/ui/animated-background').then((m) => m.AnimatedBackground));
const CommandPalette = dynamic(() => import('@/components/ui/command-palette').then((m) => m.CommandPalette));
const ContextMenu = dynamic(() => import('@/components/ui/context-menu').then((m) => m.ContextMenu));
const ConsoleWelcome = dynamic(() => import('@/components/ui/console-welcome').then((m) => m.ConsoleWelcome));
const ScrollToTop = dynamic(() => import('@/components/ui/scroll-to-top').then((m) => m.ScrollToTop));
const MusicPlayer = dynamic(() => import('@/components/music').then((m) => m.MusicPlayer));

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Sparsh Singhal | Systems & AI Developer',
  description:
    'Personal portfolio and technical ecosystem of Sparsh Singhal — Computer Science & Artificial Intelligence Undergraduate, Systems & AI Developer.',
  keywords: [
    'Sparsh Singhal',
    'AI Developer',
    'Systems Developer',
    'C++',
    'Python',
    'Next.js',
    'Generative AI',
    'portfolio',
  ],
  metadataBase: new URL('https://sparshlike.eu.org'),
  openGraph: {
    title: 'Sparsh Singhal | Computer Science & AI Undergraduate',
    description:
      'Building Intelligent Applications & Systems with Modern Architecture.',
    url: 'https://sparshlike.eu.org',
    siteName: 'Sparsh Singhal Portfolio',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sparsh Singhal | Systems & AI Developer',
    description:
      'Building Intelligent Applications & Systems with Modern Architecture.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} data-theme="dark">
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider>
          <SkipLink />
          <ToastProvider>
            <MusicPlayerProvider>
              <AnnouncementBar />
              <Nav />
              <ScrollProgress />
              <AnimatedBackground />
              <div id="main-content" className="relative z-10 pb-20 md:pb-24">
                {children}
              </div>
              <Footer />
              <CustomCursor />
              <ScrollToTop />
              <ContextMenu />
              <ConsoleWelcome />
              <CommandPalette />
              <MusicPlayer />
            </MusicPlayerProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
