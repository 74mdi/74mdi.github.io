import type { ReactNode } from 'react';

export default function MdxDemoCallout({ children }: { children: ReactNode }) {
  return <aside className="mdx-demo-callout">{children}</aside>;
}
