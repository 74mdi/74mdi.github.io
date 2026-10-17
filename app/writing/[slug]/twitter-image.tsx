import { mdxPosts } from '../../../src/content/posts/registry';
import { generatePostImage, imageSize } from '../../../src/lib/og-image';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const alt = 'An article from 7amdi on a deep navy background.';
export const size = imageSize;
export const contentType = 'image/png';

export function generateStaticParams() {
  return mdxPosts.map(({ slug }) => ({ slug }));
}

export default async function TwitterImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = mdxPosts.find((item) => item.slug === slug);
  return generatePostImage(post?.title ?? 'Writing by 7amdi', post?.description ?? 'Notes from the web.');
}
