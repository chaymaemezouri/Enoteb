'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { homeContent } from '@/config/home';
import { Container } from '@/components/ui/Container';

const EASE = [0.16, 1, 0.3, 1] as const;

export function CtaSection() {
  const { cta } = homeContent;
  const reduced = useReducedMotion();

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <motion.div
          className="relative overflow-hidden bg-gradient-to-br from-[#50545c] to-[#52565e] px-8 py-16 sm:px-14 sm:py-20 lg:px-20 lg:py-24"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-72px' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_100%_50%,rgb(243_106_33_/_0.18),transparent_60%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-[#F36A21]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#F36A21]/10 blur-3xl"
            aria-hidden
          />

          <div className="relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="section-label">{cta.overline}</p>
              <h2 className="enoteb-title enoteb-title--section enoteb-title--on-dark mt-4">
                {cta.title}
              </h2>
              <p className="enoteb-lead enoteb-lead--on-dark mt-4">{cta.description}</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="link-focus group inline-flex items-center gap-2 rounded-full bg-[#F36A21] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#e05a18] focus-visible:ring-[#F36A21]"
              >
                {cta.primaryLabel}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href="/projets"
                className="link-focus inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-white/55 underline decoration-white/20 underline-offset-[5px] transition-colors hover:text-white/80 focus-visible:ring-white/30"
              >
                {cta.secondaryLabel}
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
