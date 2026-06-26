'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { siteConfig } from '@/config/site';
import { fadeUpView } from './homeMotion';

export function OrangeCtaBanner() {
  const { orangeCta } = siteConfig;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className="cta-banner relative"
      data-header-theme="dark"
      aria-labelledby="cta-banner-heading"
      data-hide-navbar-logo
    >
      <motion.div
        {...fadeUpView(0, reduced)}
        className="cta-banner__inner home-shell relative z-10"
      >
        <div className="cta-banner__row">
          <span className="cta-banner__accent" aria-hidden />

          <div className="cta-banner__copy min-w-0">
            <SectionLabel>{orangeCta.overline}</SectionLabel>

            <h2
              id="cta-banner-heading"
              className="enoteb-title enoteb-title--section enoteb-title--on-dark cta-banner__title mt-4 sm:mt-5"
            >
              {orangeCta.title}
            </h2>

            <p className="cta-banner__description mt-3 max-w-md sm:mt-3.5">
              {orangeCta.description}
            </p>
          </div>

          <div className="cta-banner__aside shrink-0">
            <Link
              href={orangeCta.href}
              className="cta-banner__btn btn-orange-glass link-focus rounded-none group inline-flex items-center justify-center gap-2.5"
            >
              <span>{orangeCta.buttonLabel}</span>
              <span className="cta-banner__btn-icon" aria-hidden>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
