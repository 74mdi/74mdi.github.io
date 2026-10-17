'use client';

import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

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
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const reduceMotion = useReducedMotion();
  const visible = inView || reduceMotion;

  return (
    <motion.li
      ref={ref}
      layout
      className="post-card writing-card"
      initial={reduceMotion ? false : {
        opacity: 0,
        filter: 'blur(16px)',
        y: 18,
        scale: 0.96,
        borderRadius: '46% 54% 58% 42% / 52% 44% 56% 48%',
      }}
      animate={visible ? {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        scale: 1,
        borderRadius: '1rem',
      } : {
        opacity: 0,
        filter: 'blur(16px)',
        y: 18,
        scale: 0.96,
        borderRadius: '46% 54% 58% 42% / 52% 44% 56% 48%',
      }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: Math.min(index, 8) * 0.07 }}
    >
      <Link href={`/writing/${slug}/`} className="writing-card-link">
        <span className="writing-card-title">{title}</span>
        <span className="writing-card-description">{description}</span>
        {date && formattedDate && <time dateTime={date}>{formattedDate}</time>}
      </Link>
    </motion.li>
  );
}
