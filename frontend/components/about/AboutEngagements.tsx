'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ABOUT_CONTAINER, BG_WHITE, fadeUpView, SECTION_PADDING, SQUARE_CARD, staggerItem } from './aboutMotion';

export function AboutEngagements() {
  const { engagements } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className={SECTION_PADDING}
      style={{ backgroundColor: BG_WHITE }}
      data-header-theme="light"
    >
      <Container fluid className={ABOUT_CONTAINER}>
        <motion.div {...fadeUpView(0, reduced)} className="max-w-2xl">
          <SectionLabel>{engagements.overline}</SectionLabel>
          <h2 className="section-title section-title--light mt-4">{engagements.title}</h2>
          <p className="section-description section-description--light mt-4">
            {engagements.description}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12">
          {engagements.items.map((item, index) => (
            <motion.article
              key={item.title}
              {...staggerItem(index, reduced)}
              className={`border border-[#252A30]/12 bg-white p-6 transition-colors duration-300 hover:border-[#FF6B1A]/35 ${SQUARE_CARD}`}
            >
              <span className="text-[0.6875rem] font-semibold tabular-nums text-[#FF6B1A]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="card-title card-title--light mt-3">{item.title}</h3>
              <p className="card-description card-description--light mt-2">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
