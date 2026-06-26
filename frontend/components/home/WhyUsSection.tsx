'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { homeContent } from '@/config/home';
import { fadeUpView, HOME_EASE, HOME_VIEWPORT } from './homeMotion';

const NAVY = '#18212B';
const MUTED = '#68717D';
const ORANGE = '#FF6A1A';
const BG_SECTION = '#F6F2EA';
const TIMELINE_COLOR = 'rgba(255, 106, 26, 0.28)';

type WhyUsItem = (typeof homeContent.whyUs.items)[number];

function itemMotion(index: number, reduced: boolean) {
  return reduced
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: HOME_VIEWPORT,
        transition: { duration: 0.6, delay: 0.14 + index * 0.07, ease: HOME_EASE },
      };
}

function WhyUsReasonBlock({
  item,
  index,
  reduced,
  isLast,
}: {
  item: WhyUsItem;
  index: number;
  reduced: boolean;
  isLast: boolean;
}) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <motion.li {...itemMotion(index, reduced)} className="relative">
      <div
        className="group relative border-b border-[rgba(24,33,43,0.07)] py-4 transition-[background-color,transform] duration-300 sm:py-[1.125rem] lg:hover:translate-x-1 lg:hover:bg-[rgba(255,255,255,0.4)]"
        style={isLast ? { borderBottom: 'none' } : undefined}
      >
        <span
          className="pointer-events-none absolute -left-[1.375rem] top-[1.4rem] z-10 hidden h-[4px] w-[4px] -translate-x-1/2 rounded-full lg:block lg:top-[1.55rem]"
          style={{ backgroundColor: ORANGE, boxShadow: `0 0 0 2.5px ${BG_SECTION}` }}
          aria-hidden
        />

        <div className="flex gap-4">
          <span
            className="shrink-0 pt-px text-[0.625rem] font-semibold tabular-nums tracking-[0.14em]"
            style={{ color: ORANGE }}
          >
            {number}
          </span>

          <div className="min-w-0 flex-1">
            <h3
              className="text-base font-semibold leading-snug tracking-[-0.02em] sm:text-[1.0625rem]"
              style={{ color: NAVY }}
            >
              {item.title}
            </h3>
            <p
              className="mt-1.5 text-sm leading-[1.65] sm:mt-2 sm:text-[0.9375rem] sm:leading-[1.7]"
              style={{ color: MUTED }}
            >
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function WhyUsSection() {
  const { whyUs } = homeContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className="relative scroll-mt-28 overflow-x-hidden py-14 home-shell sm:py-20 md:py-28 lg:py-32"
      style={{ backgroundColor: BG_SECTION }}
      data-header-theme="light"
      aria-labelledby="why-us-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(24,33,43,0.014)_1px,transparent_1px),linear-gradient(90deg,rgba(24,33,43,0.014)_1px,transparent_1px)] bg-[size:80px_80px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_38%_at_100%_8%,rgba(255,106,26,0.06),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,106,26,0.1)] to-transparent"
        aria-hidden
      />

      <div className="why-us-section__inner relative w-full">
        <div className="why-us-section__grid">
          <div className="why-us-section__copy min-w-0">
            <motion.div {...fadeUpView(0, reduced)}>
              <div className="flex items-center gap-2.5">
                <span className="section-label-line" aria-hidden />
                <p className="section-label">{whyUs.overline}</p>
              </div>
            </motion.div>

            <motion.h2
              {...fadeUpView(0.08, reduced)}
              id="why-us-heading"
              className="why-us-section__title enoteb-title enoteb-title--section enoteb-title--on-light mt-5"
            >
              {whyUs.title}
            </motion.h2>

            <motion.p
              {...fadeUpView(0.16, reduced)}
              className="why-us-section__text enoteb-lead enoteb-lead--on-light mt-4"
            >
              {whyUs.description}
            </motion.p>

            <motion.div {...fadeUpView(0.24, reduced)} className="mt-7 lg:mt-8">
              <Link
                href={whyUs.ctaHref}
                className="link-focus inline-flex items-center gap-2.5 rounded-none border border-[#18212B]/14 bg-[#F6F2EA] px-5 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[#18212B] transition-colors duration-300 hover:border-[#FF6A1A]/50 hover:text-[#FF6A1A] focus-visible:ring-[#FF6A1A]"
              >
                {whyUs.ctaLabel}
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              </Link>
            </motion.div>
          </div>

          <div className="why-us-section__timeline relative min-w-0">
            <span
              className="pointer-events-none absolute bottom-3 left-0 top-3 hidden w-px lg:block"
              style={{ backgroundColor: TIMELINE_COLOR }}
              aria-hidden
            />

            <ul className="relative list-none pl-0 lg:pl-6" aria-label={whyUs.title}>
              {whyUs.items.map((item, index) => (
                <WhyUsReasonBlock
                  key={item.title}
                  item={item}
                  index={index}
                  reduced={reduced}
                  isLast={index === whyUs.items.length - 1}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
