import type { MetadataRoute } from 'next';
import { content } from '../src/content';
import { siteDescription } from '../src/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return {
    name: content.name,
    short_name: content.name,
    description: siteDescription,
    start_url: `${basePath}/`,
    display: 'standalone',
    background_color: '#0a0e2a',
    theme_color: '#0a0e2a',
    icons: [{ src: `${basePath}/icon.png`, sizes: '256x256', type: 'image/png', purpose: 'any' }],
  };
}
