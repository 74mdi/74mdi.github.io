import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { postStaticParams, publishedPosts } from '../../../src/content/posts/registry';
import { siteUrl } from '../../../src/lib/site';
import MdxReveal from '../../../src/components/MdxReveal';
import SiteFooter from '../../../src/components/SiteFooter';
import WritingPageBackground from '../../../src/components/WritingPageBackground';

export const dynamicParams = false;

export function generateStaticParams() {
  return postStaticParams;
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
      ...(post.date ? { publishedTime: new Date(`${post.date}T00:00:00Z`).toISOString() } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
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
    <>
    <WritingPageBackground />
    <main className="main-column writing-page">
      <div className="writing-topbar">
        <Link href="/" className="writing-back">← Home</Link>
        {post.date && <time className="writing-date" dateTime={post.date}>{post.date}</time>}
      </div>
      <article className="writing-article">
        <header>
          <h1>{post.title}</h1>
          <p className="writing-description">{post.description}</p>
        </header>
        <MdxReveal><PostContent /></MdxReveal>
      </article>
      <SiteFooter className="writing-footer" />
    </main>
    </>
  );
}
