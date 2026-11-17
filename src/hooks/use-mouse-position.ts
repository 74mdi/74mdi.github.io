'use client';

import { useEffect, useState, type RefObject } from 'react';

export function useMousePosition(containerRef: RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const update = (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      setPosition({ x: clientX - (rect?.left ?? 0), y: clientY - (rect?.top ?? 0) });
    };
    const onMouseMove = (event: MouseEvent) => update(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => { const touch = event.touches[0]; if (touch) update(touch.clientX, touch.clientY); };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('touchmove', onTouchMove); };
  }, [containerRef]);

  return position;
}
