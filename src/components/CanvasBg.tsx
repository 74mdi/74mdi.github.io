'use client';
import { useEffect, useRef } from 'react';
export type BgTheme = 'navy' | 'blue';

export default function CanvasBg({ theme }: { theme: BgTheme }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const blue = theme === 'blue';
    const baseRGB: [number, number, number] = blue ? [243, 245, 255] : [10, 14, 42];
    const grainAlpha = blue ? [8, 22] : [30, 72];
    let raf = 0, w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const makeGrain = () => {
      const tile = document.createElement('canvas'); tile.width = tile.height = 160;
      const c = tile.getContext('2d'); if (!c) return tile;
      const img = c.createImageData(160, 160), d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.floor(Math.random() * 8); d[i] = baseRGB[0] + v; d[i+1] = baseRGB[1] + v; d[i+2] = baseRGB[2] + v;
        d[i+3] = Math.random() < .55 ? 0 : grainAlpha[0] + Math.random() * (grainAlpha[1] - grainAlpha[0]);
      }
      c.putImageData(img, 0, 0); return tile;
    };
    let grain = makeGrain(), lastGrain = 0;
    const draw = () => {
      ctx.clearRect(0,0,w,h);
      const pattern = ctx.createPattern(grain,'repeat'); if (pattern) { ctx.fillStyle=pattern; ctx.fillRect(0,0,w,h); }
    };
    draw();
    const onResize = () => { resize(); draw(); };
    const loop = (t: number) => {
      if (document.hidden) { raf = 0; return; }
      // Refresh the film grain a few times per second without repainting every frame.
      if (t - lastGrain > 140) {
        grain = makeGrain(); lastGrain = t;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };
    const onVisibilityChange = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (!reduced && !raf) raf = requestAnimationFrame(loop);
    };
    addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (!reduced && !document.hidden) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [theme]);
  return <canvas ref={ref} aria-hidden="true" className="canvas-bg" />;
}
