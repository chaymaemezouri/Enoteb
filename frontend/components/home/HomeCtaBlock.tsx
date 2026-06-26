'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { homeContent } from '@/config/home';
import { siteConfig } from '@/config/site';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { fadeUpView } from './homeMotion';

const ctaLinkBase =
  'link-focus group inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] transition-[color,transform] duration-300 focus-visible:ring-[#FF6A1A]';

export function HomeCtaBlock() {
  const { cta } = homeContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className="home-cta-block relative border-t border-white/[0.06] py-12 home-shell sm:py-14 lg:py-16"
      aria-labelledby="home-cta-heading"
      data-hide-navbar-logo
    >
      <motion.div {...fadeUpView(0, reduced)}>
        <div className="home-cta__grid">
          <div className="home-cta__content min-w-0 max-w-xl">
            <SectionLabel>{cta.overline}</SectionLabel>

            <h2
              id="home-cta-heading"
              className="enoteb-title enoteb-title--section enoteb-title--on-dark mt-3 sm:mt-3.5"
            >
              {cta.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <p className="enoteb-lead enoteb-lead--on-dark mt-3 max-w-md">
              {cta.footerDescription}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-7">
              <Link
                href="/contact"
                className={`${ctaLinkBase} text-[#FF6A1A] hover:text-[#ff8a4c]`}
              >
                {cta.primaryLabel}
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </Link>
              <Link
                href="/projets"
                className={`${ctaLinkBase} font-medium text-white/[0.42] hover:text-[#FF6A1A]/85`}
              >
                {cta.secondaryLabel}
                <ArrowUpRight
                  className="h-3.5 w-3.5 opacity-70 transition-[transform,opacity] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </Link>
            </div>
          </div>

          <div className="home-cta__logo hidden items-center sm:flex" aria-hidden>
            <Image
              src={siteConfig.logo.src}
              alt=""
              width={290}
              height={194}
              quality={100}
              sizes="(min-width: 1024px) 290px, (min-width: 640px) 240px, 200px"
              className="h-auto w-full max-w-[200px] object-contain opacity-[0.48] sm:max-w-[240px] lg:max-w-[290px]"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
