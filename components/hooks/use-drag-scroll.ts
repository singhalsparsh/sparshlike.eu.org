'use client';

import { useRef, useCallback, useEffect } from 'react';

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    isDragging.current = true;
    startX.current = e.pageX - ref.current.offsetLeft;
    startY.current = e.pageY - ref.current.offsetTop;
    scrollLeft.current = ref.current.scrollLeft;
    scrollTop.current = ref.current.scrollTop;
    ref.current.classList.add('drag-scroll');
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const y = e.pageY - ref.current.offsetTop;
    const walkX = (x - startX.current) * 1.5;
    const walkY = (y - startY.current) * 1.5;
    ref.current.scrollLeft = scrollLeft.current - walkX;
    ref.current.scrollTop = scrollTop.current - walkY;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (ref.current) {
      ref.current.classList.remove('drag-scroll');
    }
  }, []);

  useEffect(() => {
    const current = ref.current;
    if (!current) return;

    current.addEventListener('mouseup', onMouseUp);
    current.addEventListener('mouseleave', onMouseUp);

    return () => {
      current.removeEventListener('mouseup', onMouseUp);
      current.removeEventListener('mouseleave', onMouseUp);
    };
  }, [onMouseUp]);

  return {
    ref,
    dragHandlers: {
      onMouseDown,
      onMouseMove,
    },
  };
}
