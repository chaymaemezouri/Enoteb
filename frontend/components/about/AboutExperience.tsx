'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ABOUT_CONTAINER, BG_DARK, fadeUpView, SECTION_PADDING, SQUARE_CARD, staggerItem } from './aboutMotion';

export function AboutExperience() {
  const { experience } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className={SECTION_PADDING}
      style={{ backgroundColor: BG_DARK }}
      data-header-theme="dark"
    >
      <Container fluid className={ABOUT_CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
          <motion.div {...fadeUpView(0, reduced)}>
            <SectionLabel>{experience.overline}</SectionLabel>
            <h2 className="section-title section-title--dark mt-4">{experience.title}</h2>
            <div className="mt-5 space-y-4">
              {experience.paragraphs.map((p) => (
                <p key={p.slice(0, 32)} className="card-description card-description--dark">
                  {p}
                </p>
              ))}
            </div>
            <Link
              href="/projets"
              className="link-focus btn-primary btn-square group mt-8 inline-flex px-6 py-3"
            >
              {experience.ctaLabel}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </Link>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2">
            {experience.highlights.map((item, index) => (
              <motion.div
                key={item}
                {...staggerItem(index, reduced)}
                className={`border border-white/10 bg-white/[0.02] p-4 transition-colors duration-300 hover:border-[#FF6B1A]/30 ${SQUARE_CARD}`}
              >
                <span className="text-[0.625rem] font-semibold tabular-nums text-[#FF6B1A]/80">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 text-[0.875rem] leading-snug text-white/[0.78]">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
