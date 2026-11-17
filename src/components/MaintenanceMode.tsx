"use client";

import { useEffect, useRef } from 'react';
import VariableFontAndCursor from './fancy/text/variable-font-and-cursor';

const rows = Array.from({ length: 14 }, (_, index) => index);
const azulGroup = 'azul! '.repeat(24);
const salamGroup = 'salam! '.repeat(24);

function MarqueeRows({ word, containerRef, background = false }: { word: string; containerRef: React.RefObject<HTMLDivElement | null>; background?: boolean }) {
  return (
    <div className={`marquee-layer${background ? ' marquee-layer-back' : ''}`} aria-hidden="true">
      {rows.map((row) => (
        <div className={`marquee-row ${row % 2 ? 'marquee-row-reverse' : ''}`} key={row}>
          <div className="marquee-track" style={{ '--marquee-duration': `${[32, 40, 55][row % 3]}s` } as React.CSSProperties}>
            {background ? <span className="marquee-group">{word}</span> : <VariableFontAndCursor className="marquee-group" fontVariationMapping={{ y: { name: 'wght', min: 100, max: 900 }, x: { name: 'slnt', min: 0, max: -10 } }} containerRef={containerRef}>{word}</VariableFontAndCursor>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MaintenanceMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorXRef = useRef<HTMLSpanElement>(null);
  const cursorYRef = useRef<HTMLSpanElement>(null);
  const cursorDotRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const update = (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      const x = clientX - (rect?.left ?? 0);
      const y = clientY - (rect?.top ?? 0);
      if (cursorXRef.current) cursorXRef.current.style.left = `${x}px`;
      if (cursorYRef.current) cursorYRef.current.style.top = `${y}px`;
      if (cursorDotRef.current) { cursorDotRef.current.style.left = `${x}px`; cursorDotRef.current.style.top = `${y}px`; }
    };
    const onMouseMove = (event: MouseEvent) => update(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => { const touch = event.touches[0]; if (touch) update(touch.clientX, touch.clientY); };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('touchmove', onTouchMove); };
  }, []);
  return <main ref={containerRef} className="maintenance-screen cursor-none"><MarqueeRows word={salamGroup} containerRef={containerRef} background /><MarqueeRows word={azulGroup} containerRef={containerRef} /><span ref={cursorXRef} className="maintenance-cursor-line maintenance-cursor-line-x" /><span ref={cursorYRef} className="maintenance-cursor-line maintenance-cursor-line-y" /><span ref={cursorDotRef} className="maintenance-cursor-dot" /></main>;
}
