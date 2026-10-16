'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Fancy Components-style text scramble that resolves on hover. */
export default function ScrambleHover({
  text,
  className = '',
  scrambleSpeed = 50,
  maxIterations = 10,
  useOriginalCharsOnly = true,
  characters = 'ABCDEFGHIJKLMNO PQRSTUVWXYZ abcdefghijklmno pqrstuvwxyz !@#$%^&*()_+',
  isHovered = false,
}: {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  maxIterations?: number;
  useOriginalCharsOnly?: boolean;
  characters?: string;
  isHovered?: boolean;
}) {
  const [display, setDisplay] = useState(text);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplay(text);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [text]);

  const scramble = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    const original = Array.from(text);
    const pool = useOriginalCharsOnly ? original.filter((char) => !/\s/.test(char)) : Array.from(characters);
    if (!pool.length) return;
    let iteration = 0;
    timer.current = setInterval(() => {
      iteration += 1;
      const revealed = Math.floor((iteration / maxIterations) * original.length);
      setDisplay(original.map((char, index) => {
        if (/\s/.test(char) || index < revealed) return char;
        return pool[Math.floor(Math.random() * pool.length)];
      }).join(''));
      if (iteration >= maxIterations) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setDisplay(text);
      }
    }, scrambleSpeed);
  }, [characters, maxIterations, scrambleSpeed, text, useOriginalCharsOnly]);

  useEffect(() => { if (isHovered) scramble(); }, [isHovered, scramble]);

  return <span className={className} aria-label={text}>{display}</span>;
}
