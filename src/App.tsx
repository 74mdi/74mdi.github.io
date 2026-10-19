'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Reveal from './components/Reveal';
import Hero from './components/Hero';
import Music from './components/Music';
import Posts from './components/Posts';
import CanvasBg, { type BgTheme } from './components/CanvasBg';
import SiteFooter from './components/SiteFooter';

const THEME_KEY = '7amdi-theme';

export default function App({ writingSection }: { writingSection?: ReactNode }) {
  // Keep the server render and the browser's first render identical. Restore
  // the saved preference after hydration to avoid mismatched toggle markup.
  const [theme, setTheme] = useState<BgTheme>('blue');
  const [themeReady, setThemeReady] = useState(false);
  useEffect(() => {
    try {
      setTheme(localStorage.getItem(THEME_KEY) === 'navy' ? 'navy' : 'blue');
    } catch { /* storage may be unavailable */ }
    setThemeReady(true);
  }, []);
  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* private mode etc. */ }
  }, [theme, themeReady]);

  return <div className="site-root">
    <CanvasBg theme={theme} />
    <main className="main-column">
      <Hero />
      <Reveal><Music /></Reveal>
      {writingSection && <Reveal>{writingSection}</Reveal>}
      <Reveal><Posts /></Reveal>
      <Reveal><SiteFooter theme={theme} onToggleTheme={() => setTheme((t) => t === 'navy' ? 'blue' : 'navy')} /></Reveal>
    </main>
  </div>;
}
