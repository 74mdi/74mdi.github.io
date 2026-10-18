import type { MDXComponents } from 'mdx/types';
import MdxImage from './src/components/MdxImage';

const components: MDXComponents = {
  a: (props) => <a {...props} className="mdx-link" />,
  img: (props) => <MdxImage src={props.src} alt={props.alt} title={props.title} width={props.width} height={props.height} className={props.className} />,
  table: ({ children, ...props }) => (
    <div className="mdx-table-scroll">
      <table {...props}>{children}</table>
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
