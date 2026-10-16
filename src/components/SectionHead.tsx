import TextHighlighter from './TextHighlighter';

export default function SectionHead({ id, title, href, hint }: { id: string; title: string; href?: string; hint?: string }) {
  return <div className="section-head"><div className="section-head-row">
    <h2 id={id}>{title}</h2>
    {href && <a href={href} target="_blank" rel="noreferrer"><TextHighlighter triggerType="hover">{hint ?? href.replace(/^https?:\/\//, '')}</TextHighlighter> ↗</a>}
  </div></div>;
}
