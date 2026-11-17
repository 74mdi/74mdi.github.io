"use client";

import { useRef } from 'react';
import TextCursorProximity from './fancy/text/text-cursor-proximity';

const words = Array.from({ length: 72 }, (_, index) => index);

export default function MaintenanceMode() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main ref={containerRef} className="maintenance-screen">
      <p className="maintenance-copy">
        {words.map((word) => (
          <span className="maintenance-pair" key={word}>
            <span>azul!</span>{' '}
            <TextCursorProximity
              className="maintenance-salam"
              styles={{ opacity: { from: 0, to: 1 }, filter: { from: 'blur(8px)', to: 'blur(0px)' } }}
              falloff="linear"
              radius={115}
              containerRef={containerRef}
            >
              salam!
            </TextCursorProximity>{' '}
          </span>
        ))}
      </p>
    </main>
  );
}
