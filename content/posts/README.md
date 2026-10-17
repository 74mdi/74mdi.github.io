# Local MDX posts

Write articles as `.mdx` files in this folder. An article must export metadata:

```mdx
export const metadata = {
  title: 'A post title',
  description: 'A short summary for the homepage and search results.',
  date: '2026-10-17',
  draft: false,
}

# A post title

Write with Markdown, or include React components with MDX. Posts support headings,
quotes, nested lists, tables, task lists, links, images, footnotes, inline HTML,
emoji/emoticons, typographic punctuation, and syntax-highlighted fenced code.

Set `draft: true` to keep a post out of the homepage, writing routes, and sitemap.
The `date` is optional; omit it for an undated post. Named MDX exports are also
available for values used by components in that file.
```

Then import the file in `src/content/posts/registry.ts` and add it to `mdxPosts`:

```ts
import Example, { metadata as exampleMetadata } from '../../../content/posts/example.mdx';

export const mdxPosts: RegisteredPost[] = [
  { slug: 'example', ...exampleMetadata, Content: Example },
];
```

The slug becomes `/writing/example/`. Posts are prerendered for static hosting.
