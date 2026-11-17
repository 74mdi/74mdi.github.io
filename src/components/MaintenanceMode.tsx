"use client";

import { useRef } from 'react';
import VariableFontAndCursor from './fancy/text/variable-font-and-cursor';

export default function MaintenanceMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  return <main ref={containerRef} className="maintenance-screen maintenance-demo cursor-none"><VariableFontAndCursor className="maintenance-demo-word" fontVariationMapping={{ y: { name: 'wght', min: 100, max: 900 }, x: { name: 'slnt', min: 0, max: -10 } }} containerRef={containerRef}>azul!</VariableFontAndCursor></main>;
}
