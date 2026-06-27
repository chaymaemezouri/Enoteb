'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { sectorsPageContent } from '@/config/sectors';
import { fadeUpView, SECTORS_SHELL, staggerItem } from './sectorsMotion';

export function SectorsApproach() {
  const { approach } = sectorsPageContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className="sectors-approach relative overflow-x-hidden py-20 md:py-24 lg:py-28"
      data-header-theme="dark"
    >
      <div className="sectors-approach__glow pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,106,26,0.22)] to-transparent"
        aria-hidden
      />

      <div className={`relative ${SECTORS_SHELL}`}>
        <motion.header {...fadeUpView(0, reduced)} className="max-w-2xl">
          <h2 className="enoteb-title enoteb-title--section enoteb-title--on-dark">
            <span className="block">{approach.titleLine1}</span>
            <span className="mt-1 block text-[#FF6A1A] sm:mt-1.5">{approach.titleLine2}</span>
          </h2>
          <p className="enoteb-lead enoteb-lead--on-dark mt-4 sm:mt-5">{approach.intro}</p>
        </motion.header>

        <div className="sectors-approach__cards mt-10 sm:mt-12" role="list">
          {approach.items.map((item, index) => (
            <motion.article
              key={item.title}
              {...staggerItem(index, reduced)}
              role="listitem"
              className="sectors-approach__card"
            >
              <h3 className="sectors-approach__card-title">{item.title}</h3>
              <p className="sectors-approach__card-text">{item.description}</p>
            </motion.article>
          ))}
        </div>

        <motion.div {...fadeUpView(0.2, reduced)} className="sectors-approach__cta-panel">
          <div className="min-w-0">
            <h3 className="sectors-approach__cta-title">{approach.ctaBox.title}</h3>
            <p className="sectors-approach__cta-text">{approach.ctaBox.description}</p>
          </div>
          <Link
            href={approach.ctaBox.href}
            className="link-focus btn-orange-solid group mt-5 inline-flex shrink-0 items-center gap-2 rounded-none px-5 py-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white focus-visible:ring-[#e85f14] sm:mt-0"
          >
            {approach.ctaBox.buttonLabel}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
