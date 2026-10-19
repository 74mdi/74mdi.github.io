'use client';

import { useEffect, useState } from 'react';
import CanvasBg, { type BgTheme } from './CanvasBg';
import SiteFooter from './SiteFooter';
import { signaturePaths } from '../signaturePaths';

const THEME_KEY = '7amdi-theme';

export default function NotFoundPage() {
  const [theme, setTheme] = useState<BgTheme>('blue');

  useEffect(() => {
    const syncTheme = () => setTheme(document.documentElement.dataset.theme === 'navy' ? 'navy' : 'blue');
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    const next = theme === 'navy' ? 'blue' : 'navy';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch { /* storage may be unavailable */ }
  }

  return <div className="site-root">
    <CanvasBg theme={theme} />
    <main className="main-column not-found-page">
      <a href="/" className="not-found-home" aria-label="7amdi home">
        <svg aria-hidden="true" className="signature-mark" xmlns="http://www.w3.org/2000/svg" viewBox="222.725 296.207 1152.488 133.118">
          {signaturePaths.map((path, index) => <path key={index} d={path} fill="currentColor" />)}
        </svg>
      </a>
      <section className="not-found-message" aria-labelledby="not-found-heading">
        <p className="not-found-code">404</p>
        <h1 id="not-found-heading">Nothing lives at this address.</h1>
        <a href="/" className="not-found-link">Back to 7amdi <span aria-hidden="true">↗</span></a>
      </section>
      <SiteFooter theme={theme} onToggleTheme={toggleTheme} className="not-found-footer" />
    </main>
  </div>;
}
