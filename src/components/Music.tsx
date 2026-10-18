'use client';
import { useEffect, useState } from 'react';
import { content } from '../content';
import SectionHead from './SectionHead';
import ScrambleHover from '@/components/fancy/text/scramble-hover';

type Artist = { name: string; playcount: string; url: string };

function ArtistRow({ artist, index }: { artist: Artist; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  return <li className="artist-row-in" style={{animationDelay:`${index*.05+.5}s`}}>
    <a href={artist.url} target="_blank" rel="noreferrer" onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)} onFocus={()=>setIsHovered(true)} onBlur={()=>setIsHovered(false)}>
      <span className="artist-rank">{String(index+1).padStart(2,'0')}</span>
      <span className="artist-name"><ScrambleHover text={artist.name} scrambleSpeed={50} maxIterations={8} useOriginalCharsOnly className="cursor-pointer" isHovered={isHovered}/></span>
      <span className="artist-plays">{Number(artist.playcount).toLocaleString()} plays</span>
    </a>
  </li>;
}

export default function Music() {
  const { lastfm } = content;
  const [artists,setArtists] = useState<Artist[] | null>(null);
  const [failed,setFailed] = useState(false);
  useEffect(()=>{
    const ctrl=new AbortController();
    const basePath=process.env.NEXT_PUBLIC_BASE_PATH??'';
    fetch(`${basePath}/api/lastfm.json`,{signal:ctrl.signal}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(j=>{if(!Array.isArray(j?.artists))throw new Error();setArtists(j.artists);}).catch(e=>{if(e?.name!=='AbortError')setFailed(true);});
    return()=>ctrl.abort();
  },[]);
  return <section aria-labelledby="music-heading">
    <SectionHead id="music-heading" title="Top artists" href={`https://www.last.fm/user/${lastfm.user}`} hint={`last.fm/user/${lastfm.user}`} />
    {failed&&<p className="muted-copy">Couldn’t reach Last.fm right now — try the profile link above.</p>}
    {!failed&&<div className={`artist-list-space ${artists?.length===0?'is-settled':''}`} aria-busy={!artists}>
      {!failed&&!artists&&<div className="artist-skeleton" role="status" aria-label="Loading artist charts">{Array.from({length:8},(_,i)=><div className="artist-skeleton-row" key={i}><i/><i/><i/></div>)}</div>}
      {artists&&artists.length===0&&<p className="muted-copy">No scrobbles yet for this period.</p>}
      {artists&&artists.length>0&&<ol className="artist-list artist-list-morph is-visible">
        {artists.map((artist,index)=><ArtistRow key={artist.name} artist={artist} index={index}/>)}
      </ol>}
    </div>}
  </section>;
}
