import type { MetadataRoute } from 'next';
import { siteUrl } from '../src/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl.toString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
