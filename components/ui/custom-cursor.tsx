'use client';

import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let dotX = 0;
    let dotY = 0;

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.closest('[role="button"]') ||
        target.classList.contains('interactive') ||
        target.closest('.interactive');

      ring.classList.toggle('hovering', !!isClickable);
    }

    function onMouseLeave() {
      ring.style.opacity = '0';
      dot.style.opacity = '0';
    }

    function onMouseEnter() {
      ring.style.opacity = '1';
      dot.style.opacity = '1';
    }

    function animate() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      dot.style.left = `${dotX}px`;
      dot.style.top = `${dotY}px`;

      requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    animate();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
      />
    </>
  );
}
