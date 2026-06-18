'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function LenisScript() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function onFrame(time: number) {
      lenis.raf(time);
    }

    requestAnimationFrame(function animate(time: number) {
      onFrame(time);
      requestAnimationFrame(animate);
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
