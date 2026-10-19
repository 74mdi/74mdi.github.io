'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { content } from '../content';
import SectionHead from './SectionHead';
import TextHighlighter from './TextHighlighter';

type Facet={index:{byteStart:number;byteEnd:number};features:{ $type?:string;uri?:string;did?:string;tag?:string }[]};
type ImageView={thumb?:string;fullsize?:string;alt?:string;aspectRatio?:{width:number;height:number}};
type ExternalView={uri:string;title?:string;description?:string;thumb?:string};
type RecordView={$type?:string;uri?:string;author?:{handle?:string;displayName?:string;avatar?:string};value?:{text?:string}};
type EmbedView={$type?:string;images?:ImageView[];external?:ExternalView;record?:RecordView|{record?:RecordView};media?:EmbedView;thumbnail?:string;alt?:string};
type FeedPost={uri:string;record?:{text?:string;createdAt?:string;facets?:Facet[]};embed?:EmbedView;likeCount?:number;replyCount?:number;repostCount?:number};
type FeedResponse={feed?:{post:FeedPost}[]};

const arabicScript=/[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufeff]/;
function textDirection(text?:string){
  const arabic=!!text&&arabicScript.test(text);
  return {dir:arabic?'rtl' as const:'auto' as const,lang:arabic?'ar':undefined,className:arabic?'arabic-copy':''};
}

function useFeed(){
  const [data,setData]=useState<FeedResponse|null>(null),[error,setError]=useState(false),[loading,setLoading]=useState(true),[attempt,setAttempt]=useState(0);
  useEffect(()=>{const ctrl=new AbortController();setLoading(true);setError(false);const q=new URLSearchParams({actor:content.bluesky,limit:'15',filter:'posts_no_replies'});
    fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?${q}`,{signal:ctrl.signal}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(setData).catch(e=>{if(e?.name!=='AbortError')setError(true);}).finally(()=>{if(!ctrl.signal.aborted)setLoading(false);});return()=>ctrl.abort();
  },[attempt]);
  return {data,error,loading,retry:()=>setAttempt(n=>n+1)};
}
function date(iso?:string){if(!iso)return '';const d=new Date(iso);return Number.isNaN(d.getTime())?'':new Intl.DateTimeFormat(undefined,{dateStyle:'medium'}).format(d);}
function postUrl(uri:string){return `https://bsky.app/profile/${content.bluesky}/post/${uri.split('/').pop()}`;}
function RichText({text,facets}:{text:string;facets?:Facet[]}){
  if(!facets?.length)return <>{text}</>;
  const bytes=new TextEncoder().encode(text),decoder=new TextDecoder(),parts:ReactNode[]=[];let cursor=0;
  [...facets].sort((a,b)=>a.index.byteStart-b.index.byteStart).forEach((f,i)=>{const {byteStart,byteEnd}=f.index;if(byteStart<cursor||byteEnd>bytes.length||byteStart>byteEnd)return;if(byteStart>cursor)parts.push(decoder.decode(bytes.slice(cursor,byteStart)));const label=decoder.decode(bytes.slice(byteStart,byteEnd));const link=f.features.find(x=>x.$type==='app.bsky.richtext.facet#link'),mention=f.features.find(x=>x.$type==='app.bsky.richtext.facet#mention'),tag=f.features.find(x=>x.$type==='app.bsky.richtext.facet#tag');
    const href=link?.uri??(mention?.did?`https://bsky.app/profile/${mention.did}`:tag?.tag?`https://bsky.app/hashtag/${encodeURIComponent(tag.tag)}`:undefined);
    parts.push(href?<a key={i} href={href} target="_blank" rel="noreferrer" className="rich-link"><TextHighlighter triggerType="hover">{label}</TextHighlighter></a>:label);cursor=byteEnd;
  });if(cursor<bytes.length)parts.push(decoder.decode(bytes.slice(cursor)));return <>{parts}</>;
}
function BlurImage({src,alt,className='',style}:{src?:string;alt:string;className?:string;style?:CSSProperties}){
  const [loaded,setLoaded]=useState(false);if(!src)return null;
  return <img src={src} alt={alt} loading="lazy" decoding="async" onLoad={()=>setLoaded(true)} style={style} className={`img-blur ${loaded?'img-loaded':''} ${className}`} />;
}
function Quote({record}:{record?:RecordView}){
  if(!record?.uri||record.$type!=='app.bsky.embed.record#viewRecord')return <p className="quote-unavailable">Quoted post is unavailable.</p>;
  const a=record.author,url=`https://bsky.app/profile/${a?.handle??''}/post/${record.uri.split('/').pop()}`;
  const displayName=a?.displayName||a?.handle||'Unknown';
  return <a className="quote-card" href={url} target="_blank" rel="noreferrer"><span className="quote-author">{a?.avatar&&<img src={a.avatar} alt=""/>}<span {...textDirection(displayName)}><TextHighlighter triggerType="hover">{displayName}</TextHighlighter></span>{a?.handle&&<small dir="ltr"><TextHighlighter triggerType="hover">@{a.handle}</TextHighlighter></small>}</span>{record.value?.text&&<span className={`quote-text ${textDirection(record.value.text).className}`} dir={textDirection(record.value.text).dir} lang={textDirection(record.value.text).lang}>{record.value.text}</span>}</a>;
}
function Media({embed,url}:{embed?:EmbedView;url:string}){
  if(!embed?.$type)return null;
  if(embed.$type==='app.bsky.embed.images#view')return embed.images?.length?<div className={`image-grid ${embed.images.length>1?'multiple':''}`}>{embed.images.slice(0,4).map((img,i)=><a key={i} href={url} target="_blank" rel="noreferrer" aria-label={img.alt?`Photo: ${img.alt}`:'View photo on Bluesky'}><BlurImage src={img.thumb??img.fullsize} alt={img.alt??''} style={img.aspectRatio&&embed.images?.length===1?{aspectRatio:`${img.aspectRatio.width}/${img.aspectRatio.height}`}:{}} /></a>)}</div>:null;
  if(embed.$type==='app.bsky.embed.external#view'&&embed.external){const ext=embed.external;let host='';try{host=new URL(ext.uri).hostname.replace(/^www\./,'');}catch{}return <a className="external-card" href={ext.uri} target="_blank" rel="noreferrer">{ext.thumb&&<BlurImage src={ext.thumb} alt=""/>}<span>{host&&<small dir="ltr">{host}</small>}{ext.title&&<strong {...textDirection(ext.title)}><TextHighlighter triggerType="hover">{ext.title}</TextHighlighter></strong>}{ext.description&&<em {...textDirection(ext.description)}>{ext.description}</em>}</span></a>;}
  if(embed.$type==='app.bsky.embed.video#view')return <a className="video-card" href={url} target="_blank" rel="noreferrer">{embed.thumbnail?<BlurImage src={embed.thumbnail} alt={embed.alt??''}/>:<span className="video-empty"/>}<b>▶ <TextHighlighter triggerType="hover">Watch on Bluesky</TextHighlighter></b></a>;
  if(embed.$type==='app.bsky.embed.record#view')return <Quote record={embed.record as RecordView}/>;
  if(embed.$type==='app.bsky.embed.recordWithMedia#view')return <div className="media-stack"><Media embed={embed.media} url={url}/><Quote record={(embed.record as {record?:RecordView}|undefined)?.record}/></div>;
  return null;
}
function PostCard({post,index}:{post:FeedPost;index:number}){
  const url=postUrl(post.uri),[visible,setVisible]=useState(false);
  const cardRef=useRef<HTMLElement>(null);
  useEffect(()=>{
    const element=cardRef.current;
    if(!element)return;
    if(!('IntersectionObserver' in window)){setVisible(true);return;}
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){setVisible(true);observer.disconnect();}
    },{threshold:0,rootMargin:'80px 0px'});
    observer.observe(element);
    return()=>observer.disconnect();
  },[]);
  const stats=[post.replyCount?`${post.replyCount} ${post.replyCount===1?'reply':'replies'}`:null,post.repostCount?`${post.repostCount} ${post.repostCount===1?'repost':'reposts'}`:null,post.likeCount?`${post.likeCount} ${post.likeCount===1?'like':'likes'}`:null].filter(Boolean);
  return <li>
    <article ref={cardRef} className={`post-card post-morph ${visible?'is-ready':''}`} style={{transitionDelay:`${Math.min(index,8)*70}ms`}} aria-busy={!visible}>
      {post.record?.text&&<p className={`post-text ${textDirection(post.record.text).className}`} dir={textDirection(post.record.text).dir} lang={textDirection(post.record.text).lang}><RichText text={post.record.text} facets={post.record.facets}/></p>}
      <Media embed={post.embed} url={url}/><div className="post-meta"><a href={url} target="_blank" rel="noreferrer"><time dateTime={post.record?.createdAt}><TextHighlighter triggerType="hover">{date(post.record?.createdAt)}</TextHighlighter></time></a>{stats.map(s=><span key={s}>{s}</span>)}</div>
    </article>
  </li>;
}
export default function Posts(){
  const {data,error,loading,retry}=useFeed();
  const posts=(data?.feed??[]).map(f=>f.post).filter(p=>(typeof p.record?.text==='string'&&p.record.text.trim().length>0)||p.embed?.$type);
  if(loading||(!error&&posts.length===0))return null;
  return <section aria-labelledby="posts-heading"><SectionHead id="posts-heading" title="Posts" href={`https://bsky.app/profile/${content.bluesky}`} hint={`@${content.bluesky}`}/>
    {error?<div className="network-message"><p>Couldn’t load the latest posts.</p><button type="button" onClick={retry}>Try again</button></div>
    :<ul className="posts-list">{posts.map((p,i)=><PostCard key={p.uri} post={p} index={i}/>)}</ul>}
  </section>;
}
