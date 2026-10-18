'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function WritingCard({
  slug,
  title,
  description,
  date,
  formattedDate,
  index,
}: {
  slug: string;
  title: string;
  description: string;
  date?: string;
  formattedDate?: string;
  index: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0, rootMargin: '80px 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className={`post-card writing-card writing-card-reveal ${visible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      <Link href={`/writing/${slug}/`} className="writing-card-link">
        <span className="writing-card-title">{title}</span>
        <span className="writing-card-description">{description}</span>
        {date && formattedDate && <time dateTime={date}>{formattedDate}</time>}
      </Link>
    </li>
  );
}
