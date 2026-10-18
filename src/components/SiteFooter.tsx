'use client';

import { useEffect, useState } from 'react';
import TextHighlighter from './TextHighlighter';
import type { BgTheme } from './CanvasBg';

const THEME_KEY = '7amdi-theme';

export default function SiteFooter({
  theme,
  onToggleTheme,
  className = '',
}: {
  theme?: BgTheme;
  onToggleTheme?: () => void;
  className?: string;
}) {
  const [localTheme, setLocalTheme] = useState<BgTheme>('navy');
  const [copyStatus, setCopyStatus] = useState<'copied' | 'failed' | null>(null);
  const activeTheme = theme ?? localTheme;

  useEffect(() => {
    if (theme !== undefined) return;
    const syncTheme = () => setLocalTheme(document.documentElement.dataset.theme === 'blue' ? 'blue' : 'navy');
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [theme]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('7amdi@tuta.io');
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
    window.setTimeout(() => setCopyStatus(null), 1800);
  }

  function toggleTheme() {
    if (onToggleTheme) {
      onToggleTheme();
      return;
    }
    const next = activeTheme === 'navy' ? 'blue' : 'navy';
    setLocalTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch { /* storage may be unavailable */ }
  }

  return (
    <footer className={`footer ${className}`}>
      <nav aria-label="Elsewhere">
        <button type="button" onClick={toggleTheme} aria-pressed={activeTheme === 'blue'}
          aria-label={`Switch to ${activeTheme === 'navy' ? 'light' : 'dark'} mode`} className="theme-link">
          <TextHighlighter triggerType="hover">{activeTheme === 'navy' ? 'Light mode' : 'Dark mode'}</TextHighlighter>
        </button>
        <a href="https://github.com/74mdi" target="_blank" rel="noreferrer"><TextHighlighter triggerType="hover">GitHub</TextHighlighter></a>
        <a href="https://www.instagram.com/qaiik/" target="_blank" rel="noreferrer"><TextHighlighter triggerType="hover">Instagram</TextHighlighter></a>
        <a href="https://x.com/74mdi" target="_blank" rel="noreferrer"><TextHighlighter triggerType="hover">X</TextHighlighter></a>
        <a href="https://www.tiktok.com/@ana7amdi" target="_blank" rel="noreferrer"><TextHighlighter triggerType="hover">TikTok</TextHighlighter></a>
        <button type="button" onClick={copyEmail} className="theme-link" aria-label="Copy 7amdi@tuta.io to clipboard">
          <TextHighlighter triggerType="hover">{copyStatus === 'copied' ? 'Copied!' : copyStatus === 'failed' ? 'Copy failed' : '7amdi@tuta.io'}</TextHighlighter>
        </button>
        <span className="sr-only" role="status" aria-live="polite">
          {copyStatus === 'copied' ? 'Email copied to clipboard.' : copyStatus === 'failed' ? 'Could not copy email address.' : ''}
        </span>
      </nav>
    </footer>
  );
}
