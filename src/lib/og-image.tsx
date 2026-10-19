import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { content } from '../content';
import { siteDescription } from './site';
import { signaturePaths } from '../signaturePaths';

export const imageSize = { width: 1200, height: 630 };

const font = (filename: string) =>
  readFile(path.join(process.cwd(), 'public', 'fonts', filename));

async function loadFonts() {
  const [inter, instrumentSerif] = await Promise.all([
    font('inter-regular.ttf'),
    font('instrument-serif-italic.ttf'),
  ]);
  return [
    { name: 'Inter', data: inter, style: 'normal' as const, weight: 400 as const },
    { name: 'Instrument Serif', data: instrumentSerif, style: 'italic' as const, weight: 400 as const },
  ];
}

export async function generateSiteImage() {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 76px 52px',
          color: '#fff',
          background: 'radial-gradient(ellipse at 18% 15%, #202957 0%, #101735 36%, #0a0e2a 78%)',
          fontFamily: 'Inter',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 24,
            border: '1px solid rgba(255,255,255,.12)',
            borderRadius: 18,
            display: 'flex',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#b9c4ff', fontSize: 17, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            7amdi
          </div>
          <svg
            width="780"
            height="120"
            viewBox="222.725 296.207 1152.488 133.118"
            aria-hidden="true"
          >
            {signaturePaths.map((d, index) => (
              <path key={index} d={d} fill="#ffffff" />
            ))}
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, color: 'rgba(255,255,255,.82)', fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: 31, lineHeight: 1.25 }}>
            {content.lines
              .filter((line) => !/\blast\.fm\b|\bkhrya\b/i.test(line))
              .map((line) => <div key={line}>{line}</div>)}
          </div>
          <div style={{ maxWidth: 1000, color: 'rgba(255,255,255,.72)', fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: 27, lineHeight: 1.35 }}>
            {siteDescription}
          </div>
        </div>
      </div>
    ),
    {
      ...imageSize,
      fonts,
    },
  );
}

export async function generatePostImage(title: string, description: string) {
  const fonts = await loadFonts();
  const titleSize = title.length > 48 ? 54 : title.length > 30 ? 64 : 72;
  const excerpt = description.length > 180 ? `${description.slice(0, 177).trimEnd()}…` : description;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '66px 76px 54px',
          color: '#fff',
          background: 'radial-gradient(ellipse at 18% 15%, #202957 0%, #101735 36%, #0a0e2a 78%)',
          fontFamily: 'Inter',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 24, border: '1px solid rgba(255,255,255,.12)', borderRadius: 18, display: 'flex' }} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#b9c4ff', fontSize: 17, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            <span style={{ width: 30, height: 1, background: '#b9c4ff', display: 'flex' }} />
            7amdi
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1000 }}>
            <div style={{ color: '#fff', fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: titleSize, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
              {title}
            </div>
            <div style={{ color: 'rgba(255,255,255,.68)', fontSize: 25, lineHeight: 1.5 }}>
              {excerpt}
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.18)', paddingTop: 20, color: 'rgba(255,255,255,.62)', fontSize: 16, letterSpacing: '0.06em' }}>
          <span>7amdi</span>
          <span>NOTES &amp; THINGS I MAKE</span>
        </div>
      </div>
    ),
    { ...imageSize, fonts },
  );
}
