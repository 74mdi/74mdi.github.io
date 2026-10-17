declare module '*.mdx' {
  import type { PostMetadata } from './src/content/posts/types';

  export const metadata: PostMetadata;
}
