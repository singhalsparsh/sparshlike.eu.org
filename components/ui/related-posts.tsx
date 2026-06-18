import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { blogPosts, type BlogPost } from '@/lib/portfolio-data';

interface RelatedPostsProps {
  currentSlug: string;
  currentTags?: string[];
  max?: number;
}

export function RelatedPosts({ currentSlug, currentTags = [], max = 3 }: RelatedPostsProps) {
  // Score posts by shared tags
  const scored = blogPosts
    .filter((p) => p.slug !== currentSlug)
    .map((post) => ({
      post,
      score: currentTags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, max);

  if (scored.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-brand-400" />
        Related Posts
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scored.map(({ post }) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <LiquidGlassCard className="group cursor-pointer h-full" interactive>
              <div className="p-4 flex flex-col h-full">
                <div className="flex flex-wrap gap-1 mb-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-2 group-hover:text-brand-300 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-xs text-foreground/50 mb-3 flex-1 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-foreground/5">
                  <span className="text-[10px] text-foreground/40">{post.date}</span>
                  <span className="text-[10px] text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Read <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            </LiquidGlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
