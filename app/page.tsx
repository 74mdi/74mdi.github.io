import App from '../src/App';
import CustomPosts from '../src/components/CustomPosts';
import { mdxPosts } from '../src/content/posts/registry';

export default function Page() {
  return <App writingSection={mdxPosts.length > 0 ? <CustomPosts /> : null} />;
}
