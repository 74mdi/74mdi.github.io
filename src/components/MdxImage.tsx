'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type MdxImageProps = {
  src?: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function MdxImage({ src, alt, title, width, height, className = '' }: MdxImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const reduceMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [settled, setSettled] = useState(false);
  const ready = loaded && (inView || reduceMotion);

  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, []);

  const hidden = {
    opacity: 0,
    filter: 'blur(14px)',
    y: 16,
    scale: 0.96,
    borderRadius: '46% 54% 58% 42% / 52% 44% 56% 48%',
  };
  const shown = {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    scale: 1,
    borderRadius: '10px',
  };

  return (
    <motion.img
      src={src}
      alt={alt ?? ''}
      title={title}
      width={width}
      height={height}
      ref={ref}
      className={`mdx-image ${settled ? 'mdx-image-settled' : ''} ${className}`}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      onAnimationComplete={() => {
        if (ready) setSettled(true);
      }}
      initial={reduceMotion ? false : hidden}
      animate={reduceMotion || ready ? shown : hidden}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
