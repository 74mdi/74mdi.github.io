'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/** Animated inline highlighter, following Fancy Components' Text Highlighter API. */
export default function TextHighlighter({
  children,
  className = '',
  highlightColor = 'var(--attie-highlight)',
  triggerType = 'inView',
  direction = 'ltr',
}: {
  children: ReactNode;
  className?: string;
  highlightColor?: string;
  triggerType?: 'auto' | 'hover' | 'inView';
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt';
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(triggerType === 'auto');
  useEffect(() => {
    if (triggerType === 'auto') { setActive(true); return; }
    if (triggerType === 'hover') return;
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setActive(true); observer.disconnect(); }
    }, { threshold: 0.5 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [triggerType]);
  return <span
    ref={ref}
    className={`text-highlighter ${active ? 'is-highlighted' : ''} direction-${direction} ${triggerType === 'hover' ? 'highlight-on-hover' : ''} ${className}`}
    style={{ '--highlight-color': highlightColor } as CSSProperties}
    onMouseEnter={triggerType === 'hover' ? () => setActive(true) : undefined}
    onMouseLeave={triggerType === 'hover' ? () => setActive(false) : undefined}
  >{children}</span>;
}
