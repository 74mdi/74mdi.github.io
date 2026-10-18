'use client';

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
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ready = loaded && inView;

  useEffect(() => {
    const image = ref.current;
    if (!image) return;
    if (image.complete && image.naturalWidth > 0) setLoaded(true);
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0, rootMargin: '80px 0px' });
    observer.observe(image);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      src={src}
      alt={alt ?? ''}
      title={title}
      width={width}
      height={height}
      ref={ref}
      className={`mdx-image mdx-image-reveal ${ready ? 'is-visible' : ''} ${className}`}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
    />
  );
}
