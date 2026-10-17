import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { content } from '../content';
import { signaturePaths } from '../signaturePaths';

export const imageSize = { width: 1200, height: 630 };

const font = (filename: string) =>
  readFile(path.join(process.cwd(), 'public', 'fonts', filename));

export async function generateSiteImage() {
  const [inter, instrumentSerif] = await Promise.all([
    font('inter-regular.ttf'),
    font('instrument-serif-italic.ttf'),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#b9c4ff', fontSize: 17, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            <span style={{ width: 30, height: 1, background: '#b9c4ff', display: 'flex' }} />
            7amdi · personal site
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
            {content.lines.map((line) => <div key={line}>{line}</div>)}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.18)', paddingTop: 20, color: 'rgba(255,255,255,.62)', fontSize: 16, letterSpacing: '0.06em' }}>
          <span>@{content.bluesky}</span>
          <span>TOP ARTISTS · LAST.FM / {content.lastfm.user}</span>
        </div>
      </div>
    ),
    {
      ...imageSize,
      fonts: [
        { name: 'Inter', data: inter, style: 'normal', weight: 400 },
        { name: 'Instrument Serif', data: instrumentSerif, style: 'italic', weight: 400 },
      ],
    },
  );
}

export async function generatePostImage(title: string, description: string) {
  const [inter, instrumentSerif] = await Promise.all([
    font('inter-regular.ttf'),
    font('instrument-serif-italic.ttf'),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 76px 52px',
          color: '#fff',
          background: 'radial-gradient(ellipse at 18% 15%, #202957 0%, #101735 36%, #0a0e2a 78%)',
          fontFamily: 'Inter',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 24, border: '1px solid rgba(255,255,255,.12)', borderRadius: 18, display: 'flex' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', maxWidth: 1020 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#b9c4ff', fontSize: 17, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            <span style={{ width: 30, height: 1, background: '#b9c4ff', display: 'flex' }} />
            7amdi · writing
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: 72, lineHeight: 1.08, color: '#fff' }}>{title}</div>
            <div style={{ fontSize: 23, lineHeight: 1.4, color: 'rgba(255,255,255,.76)' }}>{description}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.18)', paddingTop: 20, color: 'rgba(255,255,255,.62)', fontSize: 16, letterSpacing: '0.06em' }}>
          <span>7amdi</span>
          <span>74MDI.GITHUB.IO</span>
        </div>
      </div>
    ),
    {
      ...imageSize,
      fonts: [
        { name: 'Inter', data: inter, style: 'normal', weight: 400 },
        { name: 'Instrument Serif', data: instrumentSerif, style: 'italic', weight: 400 },
      ],
    },
  );
}
