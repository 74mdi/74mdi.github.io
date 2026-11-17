'use client';

import { useRef } from 'react';
import TextCursorProximity from './fancy/text/text-cursor-proximity';

const repeats = Array.from({ length: 15 }, (_, index) => index);

export default function MaintenanceMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const proximityStyles = { opacity: { from: 0, to: 1 }, filter: { from: 'blur(7px)', to: 'blur(0px)' }, transform: { from: 'translateY(5px)', to: 'translateY(0px)' } };

  return (
    <main ref={containerRef} className="maintenance-screen">
      <div className="maintenance-noise" aria-hidden="true" />
      <header className="maintenance-header">
        <span className="maintenance-kicker">7amdi / maintenance mode</span>
        <span className="maintenance-status"><i /> temporarily offline</span>
      </header>
      <section className="maintenance-center">
        <p className="maintenance-eyebrow">a small pause in the signal</p>
        <h1 className="maintenance-title"><span>azul!</span> <TextCursorProximity className="maintenance-secret" styles={proximityStyles} falloff="linear" radius={130} containerRef={containerRef}>salam!</TextCursorProximity></h1>
        <p className="maintenance-note">move slowly through the words.<br />we’ll be back in a moment.</p>
      </section>
      <div className="maintenance-field" aria-hidden="true">
        {repeats.map((row) => <div className="maintenance-row" key={row}><TextCursorProximity className="maintenance-repeat maintenance-repeat-blue" styles={{ opacity: { from: 0.82, to: 1 }, color: { from: 'rgba(188, 204, 255, .24)', to: '#dce5ff' }, letterSpacing: { from: '0em', to: '.08em' } }} falloff="linear" radius={100} containerRef={containerRef}>azul!</TextCursorProximity><TextCursorProximity className="maintenance-repeat maintenance-repeat-salam" styles={proximityStyles} falloff="linear" radius={100} containerRef={containerRef}>salam!</TextCursorProximity></div>)}
      </div>
    </main>
  );
}
