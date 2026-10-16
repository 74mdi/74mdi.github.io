'use client';

import { useEffect, useRef } from 'react';
import { content } from '../content';
import { signaturePaths } from '../signaturePaths';

export default function Hero() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paths.forEach((path) => { path.style.fillOpacity = '1'; path.style.strokeOpacity = '0'; });
      return;
    }
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.fillOpacity = '0';
      path.style.strokeOpacity = '1';
      path.style.strokeWidth = '3';
    });
    void svg.getBoundingClientRect();
    paths.forEach((path, index) => {
      const start = 0.2 + index * 0.25;
      path.style.transition = [
        `stroke-dashoffset 1s cubic-bezier(0.45, 0, 0.25, 1) ${start}s`,
        `fill-opacity 0.55s ease ${start + 0.75}s`,
        `stroke-opacity 0.4s ease ${start + 0.9}s`,
      ].join(', ');
      path.style.strokeDashoffset = '0';
      path.style.fillOpacity = '1';
      path.style.strokeOpacity = '0';
    });
  }, []);

  return <header className="hero hero-in">
    <div className="hero-name">
      <h1 aria-label={content.name}>
        <svg ref={svgRef} aria-hidden="true" className="signature-mark" xmlns="http://www.w3.org/2000/svg" viewBox="222.725 296.207 1152.488 133.118">
          {signaturePaths.map((d, index) => <path key={index} d={d} fill="currentColor" stroke="currentColor" />)}
        </svg>
      </h1>
    </div>
    <div className="intro">{content.lines.map((line, index) => <p key={index}>{line}</p>)}</div>
  </header>;
}
