'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ABOUT_CONTAINER, fadeUpView } from './aboutMotion';

export function AboutHero() {
  const { hero } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className="relative min-h-[min(72vh,640px)] overflow-hidden bg-[#111820]"
      data-header-theme="dark"
    >
      <Image
        src={hero.imageSrc}
        alt=""
        fill
        className="object-cover brightness-[0.45] contrast-[1.05]"
        sizes="100vw"
        priority
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#111820]/92 via-[#111820]/55 to-[#111820]/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111820]/80 via-transparent to-[#111820]/30"
        aria-hidden
      />

      <Container fluid className={`relative z-10 flex min-h-[min(72vh,640px)] items-end pb-14 pt-28 sm:pb-16 sm:pt-32 ${ABOUT_CONTAINER}`}>
        <motion.div {...fadeUpView(0, reduced)} className="max-w-2xl">
          <SectionLabel>{hero.overline}</SectionLabel>
          <h1 className="section-title section-title--dark mt-4 max-w-xl sm:mt-5">
            {hero.title}
          </h1>
          <p className="section-description section-description--dark mt-4 max-w-lg sm:mt-5">
            {hero.description}
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
