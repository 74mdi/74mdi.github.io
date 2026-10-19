'use client';

import { useEffect, useRef, useState } from 'react';
import { content } from '../content';
import { useLastFmData } from './LastFmData';

export default function ListeningNow() {
  const { charts } = useLastFmData();
  const track = charts?.nowPlaying;
  const ref = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [coverZoomed, setCoverZoomed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [track]);

  useEffect(() => {
    if (!coverZoomed) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!coverRef.current?.contains(event.target as Node)) setCoverZoomed(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCoverZoomed(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [coverZoomed]);

  if (!track) return null;
  const profileUrl = `https://www.last.fm/user/${content.lastfm.user}`;
  const trackUrl = track.url || profileUrl;
  const hasPlaceholderCover = track.image.includes('lastfm-img.freetls.fastly.net/i/u/174s/c3329f87d6a3e64034df59e9f01bd1bb.jpg');

  return <span ref={ref} className={`intro-listening ${visible ? 'is-visible' : ''}`}>
    <span className="intro-listening-copy">
      <span>{track.nowPlaying ? '· Listening now:' : '· Last played:'}</span>{' '}
      <a href={trackUrl} target="_blank" rel="noreferrer">{track.name}</a>
      {track.artist && <> — <span>{track.artist}</span></>}
    </span>
    {track.image && !hasPlaceholderCover && <button ref={coverRef} type="button" className={`intro-listening-cover ${coverZoomed ? 'is-zoomed' : ''}`} onClick={() => setCoverZoomed((zoomed) => !zoomed)} aria-label={`${coverZoomed ? 'Shrink' : 'Enlarge'} cover art for ${track.name}`} aria-expanded={coverZoomed}>
      <img src={track.image} alt="" loading="lazy" decoding="async" />
    </button>}
  </span>;
}
