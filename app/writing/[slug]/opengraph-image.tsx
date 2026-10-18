import { postStaticParams, publishedPosts } from '../../../src/content/posts/registry';
import { generatePostImage, imageSize } from '../../../src/lib/og-image';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const alt = 'A preview card for a 7amdi writing post.';
export const size = imageSize;
export const contentType = 'image/png';

export function generateStaticParams() {
  return postStaticParams;
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = publishedPosts.find((item) => item.slug === slug);
  return generatePostImage(
    post?.title ?? 'Writing by 7amdi',
    post?.description ?? 'Notes and things I make.',
  );
}
