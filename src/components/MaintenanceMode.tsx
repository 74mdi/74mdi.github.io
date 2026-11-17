"use client";

const rows = Array.from({ length: 14 }, (_, index) => index);
const azulGroup = 'azul! '.repeat(24);
const salamGroup = 'salam! '.repeat(24);

function MarqueeRows({ word, background = false }: { word: string; background?: boolean }) {
  return (
    <div className={`marquee-layer${background ? ' marquee-layer-back' : ''}`} aria-hidden="true">
      {rows.map((row) => (
        <div className={`marquee-row ${row % 2 ? 'marquee-row-reverse' : ''}`} key={row}>
          <div className="marquee-track" style={{ '--marquee-duration': `${[32, 40, 55][row % 3]}s` } as React.CSSProperties}>
            <span className="marquee-group">{word}</span>
            <span className="marquee-group">{word}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MaintenanceMode() {
  return <main className="maintenance-screen"><MarqueeRows word={salamGroup} background /><MarqueeRows word={azulGroup} /></main>;
}
