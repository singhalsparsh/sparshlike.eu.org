'use client';

import { useState, useEffect, useCallback } from 'react';

const MESSAGES = [
  {
    icon: '📢',
    text: 'OPEN FOR WORK - Available for freelance and full-time opportunities',
  },
  {
    icon: '🚀',
    text: 'NEW PROJECT - Just launched a visual deep learning studio',
  },
  {
    icon: '💡',
    text: 'HIRING - Looking for exciting collaborations',
  },
];

const INTERVAL = 4200;

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % MESSAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-12">
      <div className="relative h-full bg-gradient-to-r from-brand-600/90 via-brand-500/90 to-brand-600/90 backdrop-blur-md">
        <div className="flex h-full items-center justify-center">
          <div className="relative h-6 w-full max-w-3xl overflow-hidden px-2 sm:px-4">
            {MESSAGES.map((msg, i) => (
              <div
                key={i}
                className={`absolute inset-0 flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-500 ${
                  i === current
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0'
                }`}
              >
                <span className="text-[10px] sm:text-sm shrink-0">{msg.icon}</span>
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-white truncate max-w-[85vw] sm:max-w-none">
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
