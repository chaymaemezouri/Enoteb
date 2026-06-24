'use client';

import Link from 'next/link';
import { ArrowUpRight, Compass, PenLine, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { sectorsPageContent } from '@/config/sectors';
import { Container } from '@/components/ui/Container';
import { fadeUpView, SECTORS_CONTAINER, staggerItem } from './sectorsMotion';

const ICONS: Record<(typeof sectorsPageContent.approach.items)[number]['icon'], LucideIcon> = {
  compass: Compass,
  drafting: PenLine,
  shield: ShieldCheck,
};

export function SectorsApproach() {
  const { approach } = sectorsPageContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="bg-[#111820] py-14 sm:py-16 lg:py-20" data-header-theme="dark">
      <Container fluid className={SECTORS_CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-start lg:gap-12 xl:gap-16">
          <div>
            <motion.div {...fadeUpView(0, reduced)}>
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-[#FF6B1A]">
                {approach.overline}
              </p>
              <h2 className="section-title section-title--dark mt-3 max-w-md">
                <span className="block">{approach.titleLine1}</span>
                <span className="block text-[#FF6B1A]">{approach.titleLine2}</span>
              </h2>
            </motion.div>

            <ul className="mt-8 space-y-7 sm:mt-10 sm:space-y-8">
              {approach.items.map((item, index) => {
                const Icon = ICONS[item.icon];
                return (
                  <motion.li
                    key={item.title}
                    {...staggerItem(index, reduced)}
                    className="flex gap-4 sm:gap-5"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-[#FF6B1A]/35 text-[#FF6B1A]">
                      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-[0.9375rem] font-bold uppercase tracking-[0.08em] text-[#F5F1EA]">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-lg text-[0.875rem] leading-relaxed text-[#F5F1EA]/62 sm:text-[0.9375rem]">
                        {item.description}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <motion.aside
            {...fadeUpView(0.15, reduced)}
            className="relative overflow-hidden bg-[#E8E4DC] p-6 sm:p-7 lg:p-8"
          >
            <div
              className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 text-[#111820]/[0.04]"
              aria-hidden
            >
              <PenLine className="h-full w-full" strokeWidth={0.75} />
            </div>

            <h3 className="relative text-[clamp(1.125rem,1.8vw,1.375rem)] font-bold leading-snug tracking-[-0.02em] text-[#252A30]">
              {approach.ctaBox.title}
            </h3>
            <p className="relative mt-3 text-[0.875rem] leading-relaxed text-[#6B7078] sm:text-[0.9375rem]">
              {approach.ctaBox.description}
            </p>
            <Link
              href={approach.ctaBox.href}
              className="link-focus relative mt-6 inline-flex items-center gap-2 bg-[#111820] px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-[#0B1117] focus-visible:ring-[#FF6B1A]"
            >
              {approach.ctaBox.buttonLabel}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </motion.aside>
        </div>
      </Container>
    </section>
  );
}
