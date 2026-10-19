'use client';

import { useState } from 'react';
import { content } from '../content';
import SectionHead from './SectionHead';
import ScrambleHover from '@/components/fancy/text/scramble-hover';
import { useLastFmData, type ChartItem } from './LastFmData';

function ChartRow({ item, index }: { item: ChartItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  return <li className="artist-row-in" style={{ animationDelay: `${index * 0.05 + 0.5}s` }}>
    <a href={item.url} target="_blank" rel="noreferrer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onFocus={() => setIsHovered(true)} onBlur={() => setIsHovered(false)}>
      <span className="artist-rank">{String(index + 1).padStart(2, '0')}</span>
      <span className="artist-name"><span><ScrambleHover text={item.name} scrambleSpeed={50} maxIterations={8} useOriginalCharsOnly className="cursor-pointer" isHovered={isHovered} /></span>{item.detail && <small className="artist-detail">{item.detail}</small>}</span>
      <span className="artist-plays">{Number(item.playcount).toLocaleString()} plays</span>
    </a>
  </li>;
}

export default function Music() {
  const { lastfm } = content;
  const { charts, failed, retry } = useLastFmData();
  const [chart, setChart] = useState<'artists' | 'songs'>('artists');
  const items = charts?.[chart];

  return <section aria-labelledby="music-heading">
    <SectionHead id="music-heading" title={chart === 'artists' ? 'Top artists' : 'Top songs'} onTitleClick={() => setChart((current) => current === 'artists' ? 'songs' : 'artists')} titleActionLabel={`Switch to ${chart === 'artists' ? 'top songs' : 'top artists'}`} href={`https://www.last.fm/user/${lastfm.user}`} hint={`last.fm/user/${lastfm.user}`} />
    {failed && <div className="network-message"><p>Couldn’t reach Last.fm right now — try the profile link above.</p><button type="button" onClick={retry}>Try again</button></div>}
    {!failed && <div className={`artist-list-space ${items?.length === 0 ? 'is-settled' : ''}`} aria-busy={!charts}>
      {!charts && <div className="artist-skeleton" role="status" aria-label={`Loading top ${chart}`}>
        {Array.from({ length: 8 }, (_, index) => <div className="artist-skeleton-row" key={index}><i /><i /><i /></div>)}
      </div>}
      {items && items.length === 0 && <p className="muted-copy">No scrobbles yet for this period.</p>}
      {items && items.length > 0 && <ol key={chart} className="artist-list artist-list-morph is-visible">
        {items.map((item, index) => <ChartRow key={`${item.url}-${index}`} item={item} index={index} />)}
      </ol>}
    </div>}
  </section>;
}
