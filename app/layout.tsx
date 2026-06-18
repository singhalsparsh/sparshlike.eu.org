import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Nav } from '@/components/Nav';
import { CustomCursor } from '@/components/ui/custom-cursor';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { CommandPalette } from '@/components/ui/command-palette';
import { Footer } from '@/components/sections/Footer';
import { ToastProvider } from '@/components/ui/toast';
import { SkipLink } from '@/components/ui/skip-link';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { ContextMenu } from '@/components/ui/context-menu';
import { ConsoleWelcome } from '@/components/ui/console-welcome';
import { MusicPlayerProvider, MusicPlayer } from '@/components/music';
import { ErrorBoundary } from '@/components/ui/error-boundary';

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
  title: 'Sparsh Singhal | Full Stack Developer & 3D Web Engineer',
  description:
    'Premium portfolio of Sparsh Singhal, a full-stack developer specializing in interactive 3D web experiences, liquid glass design, and cutting-edge web applications.',
  keywords: [
    'full stack developer',
    '3D web',
    'Three.js',
    'Next.js',
    'portfolio',
    'web developer',
  ],
  openGraph: {
    title: 'Sparsh Singhal | Full Stack Developer & 3D Web Engineer',
    description:
      'Premium portfolio of Sparsh Singhal, a full-stack developer specializing in interactive 3D web experiences.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sparsh Singhal | Full Stack Developer',
    description:
      'Premium portfolio of Sparsh Singhal — full-stack developer specializing in interactive 3D web experiences.',
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
              <ErrorBoundary>
                <MusicPlayer />
              </ErrorBoundary>
            </MusicPlayerProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
