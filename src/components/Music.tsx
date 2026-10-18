'use client';
import { useEffect, useState } from 'react';
import { content } from '../content';
import SectionHead from './SectionHead';
import ScrambleHover from '@/components/fancy/text/scramble-hover';

type ChartItem = { name: string; detail?: string; playcount: string; url: string };
type Charts = { artists: ChartItem[]; songs: ChartItem[] };

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
  useEffect(()=>{
    const ctrl=new AbortController();
    const basePath=process.env.NEXT_PUBLIC_BASE_PATH??'';
    fetch(`${basePath}/api/lastfm.json`,{signal:ctrl.signal}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(j=>{if(!Array.isArray(j?.artists)||!Array.isArray(j?.songs))throw new Error();setCharts(j);}).catch(e=>{if(e?.name!=='AbortError')setFailed(true);});
    return()=>ctrl.abort();
  },[]);
  const items=charts?.[chart];
  return <section aria-labelledby="music-heading">
    <SectionHead id="music-heading" title={chart==='artists'?'Top artists':'Top songs'} href={`https://www.last.fm/user/${lastfm.user}`} hint={`last.fm/user/${lastfm.user}`} />
    <div className="chart-switch" role="group" aria-label="Choose Last.fm chart">
      <button type="button" aria-pressed={chart==='artists'} onClick={()=>setChart('artists')}>Artists</button>
      <button type="button" aria-pressed={chart==='songs'} onClick={()=>setChart('songs')}>Songs</button>
    </div>
    {failed&&<p className="muted-copy">Couldn’t reach Last.fm right now — try the profile link above.</p>}
    {!failed&&<div className={`artist-list-space ${items?.length===0?'is-settled':''}`} aria-busy={!charts}>
      {!charts&&<div className="artist-skeleton" role="status" aria-label={`Loading top ${chart}`}>
        {Array.from({length:8},(_,i)=><div className="artist-skeleton-row" key={i}><i/><i/><i/></div>)}
      </div>}
      {items&&items.length===0&&<p className="muted-copy">No scrobbles yet for this period.</p>}
      {items&&items.length>0&&<ol className="artist-list artist-list-morph is-visible">
        {items.map((item,index)=><ChartRow key={`${item.url}-${index}`} item={item} index={index}/>)}
      </ol>}
    </div>}
  </section>;
}
