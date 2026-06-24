'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { homeContent } from '@/config/home';
import { Container } from '@/components/ui/Container';
import { AnimatedCounter } from './AnimatedCounter';

const EASE = [0.16, 1, 0.3, 1] as const;

export function StatsSection() {
  const { stats } = homeContent;
  const reduced = useReducedMotion();

  return (
    <section className="relative border-y border-white/[0.08] bg-gradient-to-b from-[#50545c] to-[#52565e]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#F36A21]/50 via-[#F36A21]/15 to-transparent"
        aria-hidden
      />
      <Container className="lg:pl-[calc(2.75rem+2rem)] xl:pl-[calc(3rem+2.5rem)]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 lg:flex lg:items-stretch lg:gap-0 lg:py-16">
          {stats.items.map((item, index) => (
            <motion.div
              key={item.label}
              className="relative flex min-w-0 flex-1 flex-col lg:px-10 lg:first:pl-0 xl:px-12"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
            >
              {index > 0 ? (
                <span
                  className="absolute left-0 top-1 hidden h-10 w-px bg-white/10 lg:block"
                  aria-hidden
                />
              ) : null}
              <AnimatedCounter
                value={item.value}
                suffix={item.suffix}
                className="font-display text-[clamp(2rem,4vw,2.75rem)] font-bold leading-none tracking-[-0.03em] text-[#f7f5f0]"
              />
              <p className="mt-3 text-[0.625rem] font-semibold uppercase leading-snug tracking-[0.14em] text-white/45">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
