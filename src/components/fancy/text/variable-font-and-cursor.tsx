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
  const innerRef = useRef<HTMLSpanElement>(null);
  const interpolate = useCallback((x: number, y: number) => {
    const container = containerRef.current;
    if (!container) return { settings: '', xProgress: 0.5, yProgress: 0.5 };
    const xProgress = Math.min(Math.max(x / container.clientWidth, 0), 1);
    const yProgress = Math.min(Math.max(y / container.clientHeight, 0), 1);
    const xValue = fontVariationMapping.x.min + (fontVariationMapping.x.max - fontVariationMapping.x.min) * xProgress;
    const yValue = fontVariationMapping.y.min + (fontVariationMapping.y.max - fontVariationMapping.y.min) * yProgress;
    return { settings: `'${fontVariationMapping.x.name}' ${xValue}, '${fontVariationMapping.y.name}' ${yValue}`, xProgress, yProgress };
  }, [containerRef, fontVariationMapping]);
  useAnimationFrame(() => {
    if (!spanRef.current) return;
    const { settings, xProgress, yProgress } = interpolate(mousePositionRef.current.x, mousePositionRef.current.y);
    spanRef.current.style.fontVariationSettings = settings;
    // Instrument Serif is static, so this keeps the cursor response visible as a graceful fallback.
    if (innerRef.current) {
      innerRef.current.style.transform = `skewX(${(-2.5 + xProgress * 5).toFixed(2)}deg)`;
      innerRef.current.style.fontWeight = String(Math.round(100 + yProgress * 800));
    }
  });
  const MotionComponent = motion.create(as);
  return <MotionComponent ref={spanRef} className={className} data-text={children} {...props}><span ref={innerRef} className="variable-font-inner">{children}</span></MotionComponent>;
}
