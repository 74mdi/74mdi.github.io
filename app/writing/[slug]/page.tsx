import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publishedPosts } from '../../../src/content/posts/registry';
import { siteUrl } from '../../../src/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = publishedPosts.find((item) => item.slug === slug);
  if (!post) return {};

  const url = new URL(`/writing/${post.slug}/`, siteUrl).toString();
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      images: [new URL('/opengraph-image', siteUrl).toString()],
      ...(post.date ? { publishedTime: new Date(`${post.date}T00:00:00Z`).toISOString() } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [new URL('/twitter-image', siteUrl).toString()],
    },
  };
}

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = publishedPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  const PostContent = post.Content;

  return (
    <main className="main-column writing-page">
      <Link href="/" className="writing-back">← Home</Link>
      <article className="writing-article">
        <header>
          {post.date && <p className="writing-date"><time dateTime={post.date}>{post.date}</time></p>}
          <h1>{post.title}</h1>
          <p className="writing-description">{post.description}</p>
        </header>
        <div className="mdx-content"><PostContent /></div>
      </article>
    </main>
  );
}
