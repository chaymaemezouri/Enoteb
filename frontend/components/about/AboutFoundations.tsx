'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import {
  ABOUT_CONTAINER,
  BG_LIGHT,
  fadeUpView,
  SECTION_PADDING,
  SQUARE_CARD,
  staggerItem,
} from './aboutMotion';

export function AboutFoundations() {
  const { foundations } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className={SECTION_PADDING}
      style={{ backgroundColor: BG_LIGHT }}
      data-header-theme="light"
    >
      <Container fluid className={ABOUT_CONTAINER}>
        <motion.div {...fadeUpView(0, reduced)} className="mx-auto max-w-2xl text-center">
          <SectionLabel centered>{foundations.overline}</SectionLabel>
          <h2 className="section-title section-title--light mt-4">{foundations.title}</h2>
        </motion.div>

        <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <motion.div
            {...fadeUpView(0.08, reduced)}
            className={`border border-[#252A30]/12 bg-white p-6 sm:p-8 lg:p-10 ${SQUARE_CARD}`}
          >
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-[#FF6B1A]">
              {foundations.mission.label}
            </p>
            <h3 className="card-title card-title--light mt-4 text-xl font-semibold sm:text-2xl">
              {foundations.mission.title}
            </h3>
            <p className="card-description card-description--light mt-4 max-w-2xl">
              {foundations.mission.text}
            </p>
            <p className={`mt-6 inline-flex border border-[#FF6B1A]/35 bg-[#FF6B1A]/10 px-3 py-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[#FF6B1A] ${SQUARE_CARD}`}>
              {foundations.mission.badge}
            </p>
          </motion.div>

          <motion.div
            {...fadeUpView(0.12, reduced)}
            className={`flex flex-col justify-center border border-[#252A30]/12 bg-[#111820] p-6 sm:p-8 ${SQUARE_CARD}`}
          >
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-[#FF6B1A]">
              {foundations.vision.label}
            </p>
            <h3 className="card-title card-title--dark mt-4 text-lg font-semibold">
              {foundations.vision.title}
            </h3>
            <p className="card-description card-description--dark mt-3">{foundations.vision.text}</p>
          </motion.div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {foundations.values.map((value, index) => (
            <motion.div
              key={value.title}
              {...staggerItem(index, reduced)}
              className={`border border-[#252A30]/12 bg-white p-5 sm:p-6 ${SQUARE_CARD}`}
            >
              <h4 className="text-[0.9375rem] font-semibold text-[#FF6B1A]">{value.title}</h4>
              <p className="card-description card-description--light mt-2 text-[0.875rem]">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
