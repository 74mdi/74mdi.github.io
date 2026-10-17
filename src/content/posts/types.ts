import type { ComponentType } from 'react';

export type PostMetadata = {
  title: string;
  description: string;
  date: string;
};

export type RegisteredPost = PostMetadata & {
  slug: string;
  Content: ComponentType;
};
