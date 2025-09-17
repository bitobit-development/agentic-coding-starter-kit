"use client";

import { useEffect, useState } from 'react';

interface UseNumberAnimationOptions {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  formatter?: (value: number) => string;
}

export function useNumberAnimation({
  from = 0,
  to,
  duration = 1000,
  delay = 0,
  formatter = (value: number) => value.toString()
}: UseNumberAnimationOptions) {
  const [value, setValue] = useState(from);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setValue(to);
      return;
    }

    const startTime = Date.now() + delay;
    let animationFrame: number;

    const animate = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - startTime);
      const progress = Math.min(elapsed / duration, 1);

      // Use easeOutCubic for smooth deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = from + (to - from) * easedProgress;

      setValue(currentValue);

      if (progress < 1) {
        setIsAnimating(true);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    const timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [from, to, duration, delay]);

  return {
    value: formatter(Math.round(value)),
    isAnimating
  };
}