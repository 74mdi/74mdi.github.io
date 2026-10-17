import type { ReactNode } from 'react';

export default function MdxDemoCallout({ children }: { children: ReactNode }) {
  return (
    <aside className="mdx-demo-callout">
      <span className="mdx-demo-label">React component</span>
      <div>{children}</div>
    </aside>
  );
}
