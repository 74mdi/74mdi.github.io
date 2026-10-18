import type { RegisteredPost } from './types';
import FirstNote, { metadata as firstNote } from '../../../content/posts/first-note.mdx';
import MarkdownShowcase, { metadata as markdownShowcase } from '../../../content/posts/markdown-mdx-showcase.mdx';

/*
 * Register each local article here after adding its .mdx file under
 * content/posts/. MDX metadata is exported from the article itself.
 */
export const mdxPosts: RegisteredPost[] = [
  { slug: 'a-small-corner-of-the-web', ...firstNote, Content: FirstNote },
  { slug: 'markdown-mdx-showcase', ...markdownShowcase, Content: MarkdownShowcase },
];

/** Posts with draft metadata are available locally but omitted from published routes. */
export const publishedPosts = mdxPosts.filter((post) => post.draft !== true);

/** Next static export requires one path when every article is currently a draft. */
export const postStaticParams = publishedPosts.length
  ? publishedPosts.map(({ slug }) => ({ slug }))
  : [{ slug: '__drafts-hidden' }];
