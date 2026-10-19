import TextHighlighter from './TextHighlighter';

export default function SectionHead({ id, title, href, hint, onTitleClick, titleActionLabel }: { id: string; title: string; href?: string; hint?: string; onTitleClick?: () => void; titleActionLabel?: string }) {
  return <div className="section-head"><div className="section-head-row">
    <h2 id={id}>{onTitleClick ? <button className="section-title-toggle" type="button" onClick={onTitleClick} aria-label={titleActionLabel}><span key={title} className="chart-title-swap">{title}</span></button> : title}</h2>
    {href && <a href={href} target="_blank" rel="noreferrer"><TextHighlighter triggerType="hover">{hint ?? href.replace(/^https?:\/\//, '')}</TextHighlighter> ↗</a>}
  </div></div>;
}
