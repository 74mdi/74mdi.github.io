'use client';
import { useEffect, useRef } from 'react';
export type BgTheme = 'navy' | 'blue';

export default function CanvasBg({ theme }: { theme: BgTheme }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const blue = theme === 'blue';
    const baseRGB: [number, number, number] = blue ? [243, 245, 255] : [10, 14, 42];
    const grainAlpha = blue ? [2, 7] : [10, 24];
    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const makeGrain = () => {
      const tile = document.createElement('canvas'); tile.width = tile.height = 160;
      const c = tile.getContext('2d'); if (!c) return tile;
      const img = c.createImageData(160, 160), d = img.data;
      const noise = (seed: number) => {
        const value = Math.sin(seed * 127.1 + (blue ? 19.19 : 7.73)) * 43758.5453;
        return value - Math.floor(value);
      };
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.floor(noise(i) * 8); d[i] = baseRGB[0] + v; d[i+1] = baseRGB[1] + v; d[i+2] = baseRGB[2] + v;
        d[i+3] = noise(i + 1) < .55 ? 0 : grainAlpha[0] + noise(i + 2) * (grainAlpha[1] - grainAlpha[0]);
      }
      c.putImageData(img, 0, 0); return tile;
    };
    const grain = makeGrain();
    const draw = () => {
      ctx.clearRect(0,0,w,h);
      const pattern = ctx.createPattern(grain,'repeat'); if (pattern) { ctx.fillStyle=pattern; ctx.fillRect(0,0,w,h); }
    };
    const onResize = () => { resize(); draw(); };
    onResize();
    addEventListener('resize', onResize);
    return () => {
      removeEventListener('resize', onResize);
    };
  }, [theme]);
  return <canvas ref={ref} aria-hidden="true" className="canvas-bg" />;
}
