'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { Container } from '@/components/ui/Container';
import { ABOUT_CONTAINER, fadeUpView, SQUARE_BTN } from './aboutMotion';

export function AboutCtaBanner() {
  const { cta } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="bg-[#FF6B1A] py-12 sm:py-14" data-header-theme="dark">
      <Container fluid className={ABOUT_CONTAINER}>
        <motion.div
          {...fadeUpView(0, reduced)}
          className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="max-w-xl">
            <h2 className="text-[clamp(1.375rem,2.5vw,1.875rem)] font-bold leading-tight tracking-[-0.03em] text-white">
              {cta.title}
            </h2>
            <p className="mt-2 text-[0.9375rem] text-white/85">{cta.description}</p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className={`link-focus inline-flex items-center justify-center gap-2 border border-[#111820] bg-[#111820] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#0B1117] ${SQUARE_BTN}`}
            >
              {cta.primaryLabel}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/projets"
              className={`link-focus inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white/90 underline decoration-white/40 underline-offset-4 transition-colors hover:text-white ${SQUARE_BTN}`}
            >
              {cta.secondaryLabel}
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
