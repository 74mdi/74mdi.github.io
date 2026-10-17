import { publishedPosts } from '../content/posts/registry';
import SectionHead from './SectionHead';
import WritingCard from './WritingCard';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

export default function CustomPosts() {
  if (publishedPosts.length === 0) return null;

  return (
    <section aria-labelledby="writing-heading">
      <SectionHead id="writing-heading" title="Writing" />
      <ul className="writing-list">
        {[...publishedPosts].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).map((post, index) => (
          <WritingCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            description={post.description}
            date={post.date}
            formattedDate={post.date ? formatDate(post.date) : undefined}
            index={index}
          />
        ))}
      </ul>
    </section>
  );
}
