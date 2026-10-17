import type { MDXComponents } from 'mdx/types';

const components: MDXComponents = {
  a: (props) => <a {...props} className="mdx-link" />,
  img: (props) => <img {...props} className="mdx-image" loading="lazy" />,
  table: ({ children, ...props }) => (
    <div className="mdx-table-scroll">
      <table {...props}>{children}</table>
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
