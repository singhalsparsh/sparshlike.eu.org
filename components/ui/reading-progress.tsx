'use client';

import { useState, useEffect } from 'react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const article = document.querySelector('article');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) { setProgress(100); return; }
      const pct = Math.min(100, Math.max(0, (-rect.top / total) * 100));
      setProgress(Math.round(pct));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (progress < 2 || progress > 98) return null;

  return (
    <div className="progress-pill" aria-hidden="true">
      <div className="progress-pill-track">
        <div className="progress-pill-fill" style={{ height: `${progress}%` }} />
      </div>
      <span className="progress-pill-label">{progress}%</span>
    </div>
  );
}
