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
    const washRGB = blue ? '115, 132, 220' : '110, 128, 255';
    const washAlpha = blue ? [0.13, 0.09, 0.07] : [0.14, 0.1, 0.08];
    const grainAlpha = blue ? [8, 22] : [30, 72];
    let raf = 0, w = 0, h = 0, lastFrame = 0;
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
    const washes = [
      {x:.16,y:.2,r:.7,a:washAlpha[0],sx:.00012,sy:.00016,p:0},
      {x:.85,y:.75,r:.78,a:washAlpha[1],sx:.00009,sy:.00011,p:2.2},
      {x:.55,y:.04,r:.5,a:washAlpha[2],sx:.00014,sy:.0001,p:4.1},
    ];
    const draw = (t: number) => {
      ctx.clearRect(0,0,w,h);
      const pattern = ctx.createPattern(grain,'repeat'); if (pattern) { ctx.fillStyle=pattern; ctx.fillRect(0,0,w,h); }
      const base = Math.min(w,h);
      for (const b of washes) {
        const x=(b.x+Math.sin(t*b.sx+b.p)*.06)*w, y=(b.y+Math.cos(t*b.sy+b.p)*.06)*h;
        const r=b.r*base*(1+Math.sin(t*.00009+b.p)*.07), g=ctx.createRadialGradient(x,y,0,x,y,r);
        g.addColorStop(0,`rgba(${washRGB}, ${b.a})`); g.addColorStop(1,`rgba(${washRGB}, 0)`);
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      }
    };
    const onResize = () => { resize(); if (reduced) draw(0); };
    const loop = (t: number) => {
      if (document.hidden) { raf = 0; return; }
      // The washes remain fluid at 30fps, with less work on low-power devices.
      if (t - lastFrame >= 1000 / 30) {
        if (t - lastGrain > 700) { grain = makeGrain(); lastGrain = t; }
        draw(t);
        lastFrame = t;
      }
      raf = requestAnimationFrame(loop);
    };
    const onVisibilityChange = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (!reduced && !raf) raf = requestAnimationFrame(loop);
    };
    addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (reduced) draw(0);
    else if (!document.hidden) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [theme]);
  return <canvas ref={ref} aria-hidden="true" className="canvas-bg" />;
}
