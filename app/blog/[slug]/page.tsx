'use client';

import { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Lenis from '@studio-freight/lenis';
import { ArrowLeft, Calendar, Clock, Terminal, ChevronRight } from 'lucide-react';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Glow } from '@/components/ui/glow';
import { GlassButton } from '@/components/ui/glass-button';
import { CopyButton } from '@/components/ui/copy-button';
import { ShareButton } from '@/components/ui/share-button';
import { ReadingProgress } from '@/components/ui/reading-progress';
import { RelatedPosts } from '@/components/ui/related-posts';
import { TextReveal } from '@/components/ui/text-reveal';
import { blogPosts } from '@/lib/portfolio-data';

// ─── Block-based content parser ───────────────────────────
type ContentBlock =
  | { type: 'h2'; content: string }
  | { type: 'h3'; content: string }
  | { type: 'p'; content: string }
  | { type: 'code'; content: string; language?: string }
  | { type: 'list'; items: string[] }
  | { type: 'spacer' };

function parseContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', content: line.replace('## ', '') });
      i++;
    } else if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', content: line.replace('### ', '') });
      i++;
    } else if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', content: codeLines.join('\n'), language: language || undefined });
      i++; // skip closing ```
    } else if (line.trim().startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].replace(/^- /, '').trim());
        i++;
      }
      blocks.push({ type: 'list', items });
    } else if (line.trim() === '') {
      blocks.push({ type: 'spacer' });
      i++;
    } else {
      const paragraphs: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].startsWith('##') &&
        !lines[i].startsWith('###') &&
        !lines[i].startsWith('```') &&
        !lines[i].trim().startsWith('- ')
      ) {
        paragraphs.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'p', content: paragraphs.join('\n') });
    }
  }

  return blocks;
}

// ─── Terminal code block component ────────────────────────
function TerminalCodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className="code-block-terminal relative">
      <div className="code-block-terminal-header">
        <span className="code-block-terminal-dot red" />
        <span className="code-block-terminal-dot yellow" />
        <span className="code-block-terminal-dot green" />
        <span className="code-block-terminal-title">
          {language ? `${language.toUpperCase()} ›` : 'terminal'}
        </span>
        {language && (
          <span className="ml-auto text-[10px] text-foreground/40 font-mono bg-white/5 px-2 py-0.5 rounded">
            {language}
          </span>
        )}
      </div>
      <CopyButton text={code} />
      <div className="code-block-terminal-body">
        <code>{code}</code>
      </div>
    </div>
  );
}

// ─── Render content blocks ────────────────────────────────
function renderBlocks(blocks: ContentBlock[]) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case 'h2':
        return (
          <h2 key={i} className="text-xl md:text-2xl font-semibold text-foreground mt-10 mb-4 leading-snug">
            {block.content}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={i} className="text-lg md:text-xl font-semibold text-foreground mt-8 mb-3 leading-snug">
            {block.content}
          </h3>
        );
      case 'p':
        return (
          <p key={i} className="text-base md:text-lg text-foreground/75 leading-[1.75] mb-5 max-w-none">
            {block.content}
          </p>
        );
      case 'code':
        return <TerminalCodeBlock key={i} code={block.content} language={block.language} />;
      case 'list':
        return (
          <ul key={i} className="space-y-2 mb-5">
            {block.items.map((item, j) => {
              // Handle **bold** markers within list items
              const rendered = item.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground/90 font-semibold">$1</strong>');
              return (
                <li key={j} className="flex items-start gap-2 text-base md:text-lg text-foreground/70 leading-relaxed">
                  <ChevronRight size={14} className="mt-1.5 shrink-0 text-brand-400" />
                  <span dangerouslySetInnerHTML={{ __html: rendered }} />
                </li>
              );
            })}
          </ul>
        );
      case 'spacer':
        return <div key={i} className="h-4" />;
      default:
        return null;
    }
  });
}

// ─── Page component ───────────────────────────────────────
export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  const blocks = useMemo(() => (post ? parseContent(post.content) : []), [post]);

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

  // ── Not found state ─────────────────────────────────
  if (!post) {
    return (
      <main className="relative z-30 min-h-screen pt-40">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="glass-content p-8 md:p-12">
            <span className="text-6xl font-bold text-gradient block mb-4">404</span>
            <h1 className="display-2 mb-4">Post Not Found</h1>
            <p className="text-foreground/60 mb-8 text-base">
              The blog post you are looking for does not exist or may have been moved.
            </p>
            <Link href="/blog">
              <GlassButton variant="gradient" size="md">
                <ArrowLeft size={14} />
                Back to Blog
              </GlassButton>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-30 min-h-screen">
      {/* Glass blur background over 3D canvas */}
      <div className="fixed inset-0 z-0 bg-background/30 backdrop-blur-[6px]" />
      <Glow className="top-1/4 left-1/2 -translate-x-1/2" size={500} blur={120} />
      <DotPattern opacity={0.04} />

      <ReadingProgress />

      <article className="relative z-10 container mx-auto max-w-4xl px-4 sm:px-6 section-padding pt-40">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-brand-300 transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Blog
        </Link>

        {/* Post header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-500/12 text-brand-300 border border-brand-500/25"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="display-1 mb-6 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-5 text-sm text-foreground/40">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {post.date}
            </span>
            <span className="w-px h-4 bg-foreground/10" />
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime}
            </span>
            <span className="w-px h-4 bg-foreground/10" />
            <ShareButton title={post.title} />
          </div>
        </header>

        {/* Glass-blur content wrapper */}
        <div className="glass-content p-6 sm:p-8 md:p-10 mb-8">
          {/* Content blocks */}
          <div className="prose-content">
            <TextReveal>{renderBlocks(blocks)}</TextReveal>
          </div>
        </div>

        {/* Related Posts */}
        <RelatedPosts currentSlug={post.slug} currentTags={post.tags} max={3} />

        {/* Article footer */}
        <div className="glass-content p-6 sm:p-8 mt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-foreground/50 flex items-center gap-1.5">
                <Calendar size={12} />
                Published on {post.date}
              </p>
              <p className="text-sm text-foreground/40 mt-0.5 flex items-center gap-1.5">
                <Clock size={12} />
                {post.readTime}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/blog">
                <GlassButton variant="primary" size="sm">
                  <ArrowLeft size={12} />
                  All Posts
                </GlassButton>
              </Link>
              <Link href="/contact">
                <GlassButton variant="gradient" size="sm">
                  Get in Touch
                </GlassButton>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
