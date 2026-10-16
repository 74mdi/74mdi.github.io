import type { MetadataRoute } from 'next';
import { content } from '../src/content';
import { siteDescription } from '../src/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${content.name} — into the void`,
    short_name: content.name,
    description: siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0e2a',
    theme_color: '#0a0e2a',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
