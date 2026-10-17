import type { ComponentType } from 'react';

export type PostMetadata = {
  title: string;
  description: string;
  date?: string;
  draft?: boolean;
};

export type RegisteredPost = PostMetadata & {
  slug: string;
  Content: ComponentType;
};
