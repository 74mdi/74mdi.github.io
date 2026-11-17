"use client";

import { useRef } from 'react';
import { useMousePosition } from '../hooks/use-mouse-position';
import VariableFontAndCursor from './fancy/text/variable-font-and-cursor';

export default function MaintenanceMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition(containerRef);
  return <main ref={containerRef} className="maintenance-screen maintenance-demo cursor-none"><div className="maintenance-demo-stage"><VariableFontAndCursor className="maintenance-demo-word" fontVariationMapping={{ y: { name: 'wght', min: 100, max: 900 }, x: { name: 'slnt', min: 0, max: -10 } }} containerRef={containerRef}>azul!</VariableFontAndCursor></div><div className="maintenance-demo-readout"><span>x: {Math.round(x)}</span><span>y: {Math.round(y)}</span></div><span className="maintenance-cursor-line maintenance-cursor-line-x" style={{ left: `${x}px` }} /><span className="maintenance-cursor-line maintenance-cursor-line-y" style={{ top: `${y}px` }} /><span className="maintenance-cursor-dot" style={{ left: `${x}px`, top: `${y}px` }} /></main>;
}
