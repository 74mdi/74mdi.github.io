'use client';

import { useEffect, useRef, useState } from 'react';
import { content } from '../content';
import { useLastFmData } from './LastFmData';

export default function ListeningNow() {
  const { charts } = useLastFmData();
  const track = charts?.nowPlaying;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);

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
    if (!coverOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCoverOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [coverOpen]);

  if (!track) return null;
  const profileUrl = `https://www.last.fm/user/${content.lastfm.user}`;
  const trackUrl = track.url || profileUrl;

  return <>
    <div ref={ref} className={`intro-listening ${visible ? 'is-visible' : ''}`}>
      {track.image && <button type="button" className="intro-listening-cover" onClick={() => setCoverOpen(true)} aria-label={`Enlarge cover art for ${track.name}`}>
        <img src={track.image} alt="" loading="lazy" decoding="async" />
      </button>}
      <p className="intro-listening-line">
        <span>{track.nowPlaying ? 'Listening now' : 'Last played'}</span>
        <a href={trackUrl} target="_blank" rel="noreferrer">{track.name}</a>
        {track.artist && <span className="intro-listening-artist">— {track.artist}</span>}
      </p>
    </div>
    {track.image && coverOpen && <div className="cover-lightbox" onClick={() => setCoverOpen(false)}>
      <div className="cover-lightbox-content" role="dialog" aria-modal="true" aria-label={`${track.name} cover art`} onClick={(event) => event.stopPropagation()}>
        <button type="button" className="cover-lightbox-close" onClick={() => setCoverOpen(false)} aria-label="Close enlarged cover">Close</button>
        <img src={track.image} alt={`Album cover for ${track.name}`} />
        <p>{track.name}{track.artist ? ` · ${track.artist}` : ''}</p>
      </div>
    </div>}
  </>;
}
