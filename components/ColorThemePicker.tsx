'use client';

import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export function ColorThemePicker() {
  const { colorTheme, setColorTheme, colorThemes } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-12 w-12 items-center justify-center rounded-full glass-strong text-foreground/80 hover:text-foreground transition-all hover:scale-110 shadow-lg"
        aria-label="Color theme picker"
      >
        <Palette size={20} />
      </button>

      {/* Theme picker panel */}
      {open && (
        <div className="absolute bottom-16 right-0 glass-strong rounded-2xl p-4 shadow-2xl min-w-[200px]">
          <div className="text-xs font-medium text-foreground/50 uppercase tracking-wider mb-3 px-1">
            Accent Color
          </div>
          <div className="flex flex-col gap-2">
            {colorThemes.map((ct) => (
              <button
                key={ct.id}
                onClick={() => {
                  setColorTheme(ct.id);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm ${
                  colorTheme === ct.id
                    ? 'bg-foreground/10 text-foreground'
                    : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                {/* Color swatch */}
                <span
                  className="h-5 w-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: ct.color }}
                >
                  {colorTheme === ct.id && <Check size={12} className="text-white" />}
                </span>
                <span className="font-medium">{ct.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {open && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
