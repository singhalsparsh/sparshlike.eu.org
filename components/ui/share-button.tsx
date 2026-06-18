'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';

interface ShareButtonProps {
  title: string;
  url?: string;
  variant?: 'icon' | 'button';
}

export function ShareButton({ title, url, variant = 'icon' }: ShareButtonProps) {
  const [shared, setShared] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  async function handleShare() {
    // Try native share (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // User cancelled
        return;
      }
    }

    // Fallback: copy link
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // Silent fail
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-brand-300 transition-colors share-pop"
        aria-label="Share this post"
        title={shared ? 'Link copied!' : 'Share'}
      >
        {shared ? <Check size={14} /> : <Share2 size={14} />}
        {shared ? 'Copied!' : 'Share'}
      </button>
    );
  }

  return (
    <GlassButton variant="primary" size="sm" onClick={handleShare}>
      {shared ? <Check size={14} /> : <Share2 size={14} />}
      {shared ? 'Link Copied' : 'Share Post'}
    </GlassButton>
  );
}
