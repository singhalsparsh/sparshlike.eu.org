'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`copy-button ${copied ? 'copied' : ''}`}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      title={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {label && (
        <span className="ml-1 text-[10px] font-medium">
          {copied ? 'Copied!' : label}
        </span>
      )}
    </button>
  );
}
