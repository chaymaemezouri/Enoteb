'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  className?: string;
  immediate?: boolean;
}

export function AnimatedCounter({
  value,
  suffix = '',
  className,
  immediate = false,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotion();
  const active = immediate || inView;
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced || !active) {
      if (reduced) setDisplay(value);
      return;
    }

    let frame = 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduced, value]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {display}
      {suffix}
    </motion.span>
  );
}
