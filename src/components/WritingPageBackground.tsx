'use client';

import { useEffect, useState } from 'react';
import CanvasBg, { type BgTheme } from './CanvasBg';

export default function WritingPageBackground() {
  const [theme, setTheme] = useState<BgTheme>('navy');

  useEffect(() => {
    const syncTheme = () => setTheme(document.documentElement.dataset.theme === 'blue' ? 'blue' : 'navy');
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return <CanvasBg theme={theme} />;
}
