'use client';

import React, { useCallback, useRef, type ElementType } from 'react';
import { motion, useAnimationFrame } from 'motion/react';
import { useMousePositionRef } from '../../../hooks/use-mouse-position-ref';

interface FontVariationAxis { name: string; min: number; max: number }
interface FontVariationMapping { x: FontVariationAxis; y: FontVariationAxis }
interface TextProps extends React.HTMLAttributes<HTMLElement> { children: React.ReactNode; as?: ElementType; fontVariationMapping: FontVariationMapping; containerRef: React.RefObject<HTMLDivElement | null> }

export default function VariableFontAndCursor({ children, as = 'span', fontVariationMapping, className, containerRef, ...props }: TextProps) {
  const mousePositionRef = useMousePositionRef(containerRef);
  const spanRef = useRef<HTMLElement>(null);
  const interpolate = useCallback((x: number, y: number) => {
    const container = containerRef.current;
    if (!container) return '';
    const xProgress = Math.min(Math.max(x / container.clientWidth, 0), 1);
    const yProgress = Math.min(Math.max(y / container.clientHeight, 0), 1);
    const xValue = fontVariationMapping.x.min + (fontVariationMapping.x.max - fontVariationMapping.x.min) * xProgress;
    const yValue = fontVariationMapping.y.min + (fontVariationMapping.y.max - fontVariationMapping.y.min) * yProgress;
    return `'${fontVariationMapping.x.name}' ${xValue}, '${fontVariationMapping.y.name}' ${yValue}`;
  }, [containerRef, fontVariationMapping]);
  useAnimationFrame(() => { if (spanRef.current) spanRef.current.style.fontVariationSettings = interpolate(mousePositionRef.current.x, mousePositionRef.current.y); });
  const MotionComponent = motion.create(as);
  return <MotionComponent ref={spanRef} className={className} data-text={children} {...props}><span className="inline-block">{children}</span></MotionComponent>;
}
