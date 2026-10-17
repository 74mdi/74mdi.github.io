import App from '../src/App';
import CustomPosts from '../src/components/CustomPosts';
import { publishedPosts } from '../src/content/posts/registry';

export default function Page() {
  return <App writingSection={publishedPosts.length > 0 ? <CustomPosts /> : null} />;
}
