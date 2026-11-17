"use client";

import { useRef } from 'react';
import VariableFontAndCursor from './fancy/text/variable-font-and-cursor';
import { useMousePosition } from '../hooks/use-mouse-position';

const rows = Array.from({ length: 14 }, (_, index) => index);
const azulGroup = 'azul! '.repeat(24);
const salamGroup = 'salam! '.repeat(24);

function MarqueeRows({ word, containerRef, background = false }: { word: string; containerRef: React.RefObject<HTMLDivElement | null>; background?: boolean }) {
  return (
    <div className={`marquee-layer${background ? ' marquee-layer-back' : ''}`} aria-hidden="true">
      {rows.map((row) => (
        <div className={`marquee-row ${row % 2 ? 'marquee-row-reverse' : ''}`} key={row}>
          <div className="marquee-track" style={{ '--marquee-duration': `${[32, 40, 55][row % 3]}s` } as React.CSSProperties}>
            <VariableFontAndCursor className="marquee-group" fontVariationMapping={{ x: { name: 'slnt', min: -4, max: -14 }, y: { name: 'wght', min: 300, max: 650 } }} containerRef={containerRef}>{word}</VariableFontAndCursor>
            <VariableFontAndCursor className="marquee-group" fontVariationMapping={{ x: { name: 'slnt', min: -4, max: -14 }, y: { name: 'wght', min: 300, max: 650 } }} containerRef={containerRef}>{word}</VariableFontAndCursor>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MaintenanceMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition(containerRef);
  return <main ref={containerRef} className="maintenance-screen cursor-none"><MarqueeRows word={salamGroup} containerRef={containerRef} background /><MarqueeRows word={azulGroup} containerRef={containerRef} /><span className="maintenance-cursor-line maintenance-cursor-line-x" style={{ left: `${x}px` }} /><span className="maintenance-cursor-line maintenance-cursor-line-y" style={{ top: `${y}px` }} /><span className="maintenance-cursor-dot" style={{ left: `${x}px`, top: `${y}px` }} /></main>;
}
