import type { RegisteredPost } from './types';
import FirstNote, { metadata as firstNote } from '../../../content/posts/first-note.mdx';

/*
 * Register each local article here after adding its .mdx file under
 * content/posts/. MDX metadata is exported from the article itself.
 */
export const mdxPosts: RegisteredPost[] = [
  { slug: 'a-small-corner-of-the-web', ...firstNote, Content: FirstNote },
];
