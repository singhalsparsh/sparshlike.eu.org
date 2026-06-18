'use client';

import { useEffect } from 'react';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  handler: (e: KeyboardEvent) => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      for (const shortcut of shortcuts) {
        const matchKey = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchCtrl = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey;
        const matchMeta = shortcut.meta ? e.metaKey : !e.metaKey;
        const matchShift = shortcut.shift ? e.shiftKey : !e.shiftKey;

        if (matchKey && matchCtrl && matchMeta && matchShift) {
          e.preventDefault();
          shortcut.handler(e);
          return;
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [shortcuts]);
}
