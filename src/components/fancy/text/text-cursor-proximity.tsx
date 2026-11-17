'use client';

import React, { forwardRef, useMemo, useRef, type CSSProperties, type ElementType } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'motion/react';
import { useMousePositionRef } from '../../../hooks/use-mouse-position-ref';

type CSSPropertiesWithValues = { [K in keyof CSSProperties]: string | number };
type StyleValue<T extends keyof CSSPropertiesWithValues> = { from: CSSPropertiesWithValues[T]; to: CSSPropertiesWithValues[T] };

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  as?: ElementType;
  styles: Partial<{ [K in keyof CSSPropertiesWithValues]: StyleValue<K> }>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
}

const TextCursorProximity = forwardRef<HTMLSpanElement, TextProps>(function TextCursorProximity(
  { children, as, styles, containerRef, radius = 50, falloff = 'linear', className, ...props },
  ref,
) {
  const MotionComponent = useMemo(() => motion.create(as ?? 'span'), [as]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const text = React.Children.toArray(children).join('');
  const letterProximities = useRef(Array(text.replace(/\s/g, '').length).fill(0).map(() => useMotionValue(0)));

  useAnimationFrame(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;
      const rect = letterRef.getBoundingClientRect();
      const x = rect.left + rect.width / 2 - containerRect.left;
      const y = rect.top + rect.height / 2 - containerRect.top;
      const distance = Math.hypot(mousePositionRef.current.x - x, mousePositionRef.current.y - y);
      const normalized = Math.min(Math.max(1 - distance / radius, 0), 1);
      const proximity = falloff === 'exponential' ? normalized ** 2 : falloff === 'gaussian' ? Math.exp(-((distance / (radius / 2)) ** 2) / 2) : normalized;
      letterProximities.current[index].set(proximity);
    });
  });

  const words = text.split(' ');
  let letterIndex = 0;
  return (
    <MotionComponent ref={ref} className={className} {...props}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block" aria-hidden="true">
          {word.split('').map((letter) => {
            const currentLetterIndex = letterIndex++;
            const proximity = letterProximities.current[currentLetterIndex];
            const transformedStyles = Object.entries(styles).reduce((acc, [key, value]) => {
              acc[key] = useTransform(proximity, [0, 1], [value.from, value.to]);
              return acc;
            }, {} as Record<string, unknown>);
            return <motion.span key={currentLetterIndex} ref={(element) => { letterRefs.current[currentLetterIndex] = element; }} className="inline-block" aria-hidden="true" style={transformedStyles}>{letter}</motion.span>;
          })}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </MotionComponent>
  );
});

export default TextCursorProximity;
