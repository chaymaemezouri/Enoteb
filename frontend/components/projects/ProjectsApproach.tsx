'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { projectsPageContent } from '@/config/projects';
import { fadeUpView, PROJECTS_SHELL, staggerItem } from './projectsMotion';

export function ProjectsApproach() {
  const { approach } = projectsPageContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className="relative overflow-x-hidden py-20 sm:py-20 md:py-24 lg:py-28"
      style={{ backgroundColor: '#08111A' }}
      data-header-theme="dark"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_100%_0%,rgba(255,106,26,0.07),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,106,26,0.22)] to-transparent"
        aria-hidden
      />

      <div className={`relative ${PROJECTS_SHELL}`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-start lg:gap-12 xl:gap-16">
          <div>
            <motion.div {...fadeUpView(0, reduced)}>
              <div className="flex items-center gap-2.5">
                <span className="h-px w-7 shrink-0 bg-[#FF6A1A]/80" aria-hidden />
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.32em] text-[#FF6A1A]">
                  {approach.overline}
                </p>
              </div>
              <h2 className="mt-4 font-sans text-[clamp(1.5rem,3vw,2.125rem)] font-bold leading-[1.12] tracking-[-0.03em] text-[#F8F5EE]">
                <span className="block">{approach.titleLine1}</span>
                <span className="mt-1 block text-[#FF6A1A]">{approach.titleLine2}</span>
              </h2>
            </motion.div>

            <ul className="mt-8 space-y-0 sm:mt-10">
              {approach.items.map((item, index) => (
                <motion.li
                  key={item.title}
                  {...staggerItem(index, reduced)}
                  className="border-b border-white/[0.08] py-5 last:border-b-0"
                >
                  <div className="flex gap-4">
                    <span className="shrink-0 text-[0.625rem] font-semibold tabular-nums tracking-[0.14em] text-[#FF6A1A]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-[#F8F5EE]">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-lg text-[0.875rem] leading-relaxed text-[rgba(248,245,238,0.58)] sm:text-[0.9375rem]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.aside
            {...fadeUpView(0.15, reduced)}
            className="border border-white/[0.08] bg-[#071018] p-6 sm:p-7 lg:p-8"
          >
            <h3 className="text-[clamp(1.0625rem,1.8vw,1.25rem)] font-bold leading-snug tracking-[-0.02em] text-[#F8F5EE]">
              {approach.ctaBox.title}
            </h3>
            <p className="mt-3 text-[0.875rem] leading-relaxed text-[rgba(248,245,238,0.58)] sm:text-[0.9375rem]">
              {approach.ctaBox.description}
            </p>
            <Link
              href={approach.ctaBox.href}
              className="btn-orange-glass link-focus rounded-none mt-6 inline-flex items-center gap-2 px-5 py-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] focus-visible:ring-[#FF6A1A]"
            >
              {approach.ctaBox.buttonLabel}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
