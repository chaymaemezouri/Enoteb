'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import {
  ABOUT_CONTAINER,
  BG_DARK,
  BG_WHITE,
  fadeUpView,
  SECTION_PADDING,
  SQUARE_CARD,
} from './aboutMotion';

type SplitSectionData = {
  overline: string;
  title: string;
  paragraphs: readonly string[];
  imageSrc: string;
  imageAlt: string;
};

function SplitSection({
  data,
  reversed = false,
  dark = false,
}: {
  data: SplitSectionData;
  reversed?: boolean;
  dark?: boolean;
}) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className={SECTION_PADDING}
      style={{ backgroundColor: dark ? BG_DARK : BG_WHITE }}
      data-header-theme={dark ? 'dark' : 'light'}
    >
      <Container fluid className={ABOUT_CONTAINER}>
        <div
          className={`grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14 ${
            reversed ? 'lg:[&>div:first-child]:order-2' : ''
          }`}
        >
          <motion.div {...fadeUpView(0, reduced)}>
            <SectionLabel>{data.overline}</SectionLabel>
            <h2
              className={`section-title mt-4 ${dark ? 'section-title--dark' : 'section-title--light'}`}
            >
              {data.title}
            </h2>
            <div className="mt-5 space-y-4">
              {data.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 40)}
                  className={dark ? 'card-description card-description--dark' : 'card-description card-description--light'}
                >
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...fadeUpView(0.1, reduced)}
            className={`relative aspect-[5/4] overflow-hidden border ${
              dark ? 'border-white/10' : 'border-[#252A30]/12'
            } ${SQUARE_CARD}`}
          >
            <Image
              src={data.imageSrc}
              alt={data.imageAlt}
              fill
              className="object-cover brightness-[0.92] contrast-[1.04]"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111820]/40 to-transparent"
              aria-hidden
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export function AboutHumanCapital() {
  return <SplitSection data={aboutContent.humanCapital} />;
}

export function AboutEquipment() {
  return <SplitSection data={aboutContent.equipment} reversed dark />;
}
