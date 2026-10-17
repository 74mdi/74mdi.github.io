import Link from 'next/link';
import { mdxPosts } from '../content/posts/registry';
import SectionHead from './SectionHead';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

export default function CustomPosts() {
  if (mdxPosts.length === 0) return null;

  return (
    <section aria-labelledby="writing-heading">
      <SectionHead id="writing-heading" title="Writing" />
      <ul className="writing-list">
        {[...mdxPosts].sort((a, b) => b.date.localeCompare(a.date)).map((post) => (
          <li key={post.slug}>
            <Link href={`/writing/${post.slug}/`} className="post-card writing-card">
              <span className="writing-card-title">{post.title}</span>
              <span className="writing-card-description">{post.description}</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
