'use client';

import { useEffect, useState } from 'react';
import Reveal from './components/Reveal';
import Hero from './components/Hero';
import Music from './components/Music';
import Posts from './components/Posts';
import CanvasBg, { type BgTheme } from './components/CanvasBg';
import TextHighlighter from './components/TextHighlighter';

const THEME_KEY = '7amdi-theme';

export default function App() {
  // Keep the server render and the browser's first render identical. Restore
  // the saved preference after hydration to avoid mismatched toggle markup.
  const [theme, setTheme] = useState<BgTheme>('navy');
  const [themeReady, setThemeReady] = useState(false);
  const [emailCopyStatus, setEmailCopyStatus] = useState<'copied' | 'failed' | null>(null);
  useEffect(() => {
    try {
      setTheme(localStorage.getItem(THEME_KEY) === 'blue' ? 'blue' : 'navy');
    } catch { /* storage may be unavailable */ }
    setThemeReady(true);
  }, []);
  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* private mode etc. */ }
  }, [theme, themeReady]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('7amdi@tuta.io');
      setEmailCopyStatus('copied');
      window.setTimeout(() => setEmailCopyStatus(null), 1800);
    } catch {
      setEmailCopyStatus('failed');
      window.setTimeout(() => setEmailCopyStatus(null), 1800);
    }
  }

  return <div className="site-root">
    <CanvasBg theme={theme} />
    <main className="main-column">
      <Hero />
      <Reveal><Music /></Reveal>
      <Reveal><Posts /></Reveal>
      <Reveal><footer className="footer">
        <nav aria-label="Elsewhere">
          <button type="button" onClick={() => setTheme((t) => t === 'navy' ? 'blue' : 'navy')}
            aria-pressed={theme === 'blue'} aria-label={`Switch to ${theme === 'navy' ? 'light' : 'dark'} mode`}
            className="theme-link"><TextHighlighter triggerType="hover">{theme === 'navy' ? 'Light mode' : 'Dark mode'}</TextHighlighter></button>
          <a href="https://github.com/74mdi" target="_blank" rel="noreferrer"><TextHighlighter triggerType="hover">GitHub</TextHighlighter></a>
          <a href="https://www.instagram.com/qaiik/" target="_blank" rel="noreferrer"><TextHighlighter triggerType="hover">Instagram</TextHighlighter></a>
          <a href="https://x.com/74mdi" target="_blank" rel="noreferrer"><TextHighlighter triggerType="hover">X</TextHighlighter></a>
          <a href="https://www.tiktok.com/@ana7amdi" target="_blank" rel="noreferrer"><TextHighlighter triggerType="hover">TikTok</TextHighlighter></a>
          <button type="button" onClick={copyEmail} className="theme-link" aria-label="Copy 7amdi@tuta.io to clipboard">
            <TextHighlighter triggerType="hover">{emailCopyStatus === 'copied' ? 'Copied!' : emailCopyStatus === 'failed' ? 'Copy failed' : '7amdi@tuta.io'}</TextHighlighter>
          </button>
          <span className="sr-only" role="status" aria-live="polite">{emailCopyStatus === 'copied' ? 'Email copied to clipboard.' : emailCopyStatus === 'failed' ? 'Could not copy email address.' : ''}</span>
        </nav>
      </footer></Reveal>
    </main>
  </div>;
}
