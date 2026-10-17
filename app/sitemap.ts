import type { MetadataRoute } from 'next';
import { siteUrl } from '../src/lib/site';
import { mdxPosts } from '../src/content/posts/registry';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl.toString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...mdxPosts.map((post) => ({
      url: new URL(`/writing/${post.slug}/`, siteUrl).toString(),
      lastModified: new Date(`${post.date}T00:00:00Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
