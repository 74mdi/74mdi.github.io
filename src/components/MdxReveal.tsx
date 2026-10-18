'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

const REVEAL_SELECTOR = [
  ':scope > h1', ':scope > h2', ':scope > h3', ':scope > h4', ':scope > h5', ':scope > h6',
  ':scope > p', ':scope > ul', ':scope > ol', ':scope > blockquote', ':scope > hr',
  ':scope > pre', ':scope > figure', ':scope > section', ':scope > dl',
  ':scope > .mdx-table-scroll', ':scope > .mdx-demo-callout',
].join(',');

export default function MdxReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const elements = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    if (elements.length === 0) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('mdx-morph-visible'));
      return;
    }

    elements.forEach((element) => element.classList.add('mdx-morph'));
    setReady(true);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('mdx-morph-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px 8% 0px' });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`mdx-content ${ready ? 'mdx-motion-ready' : ''} ${className}`}>
    {children}
  </div>;
}
