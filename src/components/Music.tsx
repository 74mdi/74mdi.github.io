'use client';
import { useEffect, useState } from 'react';
import { content } from '../content';
import SectionHead from './SectionHead';
import ScrambleHover from '@/components/fancy/text/scramble-hover';

type ChartItem = { name: string; detail?: string; playcount: string; url: string };
type NowPlaying = {
  name: string;
  artist: string;
  album: string;
  image: string;
  url: string;
  nowPlaying: boolean;
  playedAt: string;
};
type Charts = { artists: ChartItem[]; songs: ChartItem[]; nowPlaying: NowPlaying | null };

function ChartRow({ item, index }: { item: ChartItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  return <li className="artist-row-in" style={{animationDelay:`${index*.05+.5}s`}}>
    <a href={item.url} target="_blank" rel="noreferrer" onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)} onFocus={()=>setIsHovered(true)} onBlur={()=>setIsHovered(false)}>
      <span className="artist-rank">{String(index+1).padStart(2,'0')}</span>
      <span className="artist-name"><span><ScrambleHover text={item.name} scrambleSpeed={50} maxIterations={8} useOriginalCharsOnly className="cursor-pointer" isHovered={isHovered}/></span>{item.detail&&<small className="artist-detail">{item.detail}</small>}</span>
      <span className="artist-plays">{Number(item.playcount).toLocaleString()} plays</span>
    </a>
  </li>;
}

export default function Music() {
  const { lastfm } = content;
  const [charts,setCharts] = useState<Charts | null>(null);
  const [chart,setChart] = useState<'artists'|'songs'>('artists');
  const [failed,setFailed] = useState(false);
  const [attempt,setAttempt] = useState(0);
  const [coverOpen,setCoverOpen] = useState(false);
  useEffect(()=>{
    const ctrl=new AbortController();
    const basePath=process.env.NEXT_PUBLIC_BASE_PATH??'';
    setCharts(null);
    setFailed(false);
    fetch(`${basePath}/api/lastfm.json?v=2&retry=${attempt}`,{signal:ctrl.signal}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(j=>{
      if(!Array.isArray(j?.artists))throw new Error();
      setCharts({artists:j.artists,songs:Array.isArray(j.songs)?j.songs:[],nowPlaying:j.nowPlaying??null});
    }).catch(e=>{if(e?.name!=='AbortError')setFailed(true);});
    return()=>ctrl.abort();
  },[attempt]);
  const items=charts?.[chart];
  useEffect(()=>{
    if(!coverOpen)return;
    const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape')setCoverOpen(false);};
    window.addEventListener('keydown',onKeyDown);
    return()=>window.removeEventListener('keydown',onKeyDown);
  },[coverOpen]);
  return <section aria-labelledby="music-heading">
    {charts?.nowPlaying&&<div className="listening-now">
      {charts.nowPlaying.image&&<button type="button" className="listening-cover" onClick={()=>setCoverOpen(true)} aria-label={`Enlarge cover art for ${charts.nowPlaying.name}`}><img src={charts.nowPlaying.image} alt="" loading="lazy" decoding="async" /></button>}
      <div className="listening-copy">
        <p className="listening-label"><span className={charts.nowPlaying.nowPlaying?'listening-indicator is-playing':''} aria-hidden="true" />{charts.nowPlaying.nowPlaying?'Listening now':'Last played'}</p>
        <a className="listening-track" href={charts.nowPlaying.url||`https://www.last.fm/user/${lastfm.user}`} target="_blank" rel="noreferrer">{charts.nowPlaying.name}</a>
        <p className="listening-artist">{charts.nowPlaying.artist}{charts.nowPlaying.album?` · ${charts.nowPlaying.album}`:''}</p>
      </div>
    </div>}
    {charts?.nowPlaying?.image&&coverOpen&&<div className="cover-lightbox" onClick={()=>setCoverOpen(false)}>
      <div className="cover-lightbox-content" role="dialog" aria-modal="true" aria-label={`${charts.nowPlaying.name} cover art`} onClick={event=>event.stopPropagation()}>
        <button type="button" className="cover-lightbox-close" onClick={()=>setCoverOpen(false)} aria-label="Close enlarged cover">Close</button>
        <img src={charts.nowPlaying.image} alt={`Album cover for ${charts.nowPlaying.name}`} />
        <p>{charts.nowPlaying.name}{charts.nowPlaying.artist?` · ${charts.nowPlaying.artist}`:''}</p>
      </div>
    </div>}
    <SectionHead id="music-heading" title={chart==='artists'?'Top artists':'Top songs'} onTitleClick={()=>setChart(current=>current==='artists'?'songs':'artists')} titleActionLabel={`Switch to ${chart==='artists'?'top songs':'top artists'}`} href={`https://www.last.fm/user/${lastfm.user}`} hint={`last.fm/user/${lastfm.user}`} />
    {failed&&<div className="network-message"><p>Couldn’t reach Last.fm right now — try the profile link above.</p><button type="button" onClick={()=>setAttempt(value=>value+1)}>Try again</button></div>}
    {!failed&&<div className={`artist-list-space ${items?.length===0?'is-settled':''}`} aria-busy={!charts}>
      {!charts&&<div className="artist-skeleton" role="status" aria-label={`Loading top ${chart}`}>
        {Array.from({length:8},(_,i)=><div className="artist-skeleton-row" key={i}><i/><i/><i/></div>)}
      </div>}
      {items&&items.length===0&&<p className="muted-copy">No scrobbles yet for this period.</p>}
      {items&&items.length>0&&<ol key={chart} className="artist-list artist-list-morph is-visible">
        {items.map((item,index)=><ChartRow key={`${item.url}-${index}`} item={item} index={index}/>)}
      </ol>}
    </div>}
  </section>;
}
