'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ABOUT_CONTAINER, BG_WHITE, fadeUpView, SECTION_PADDING, SQUARE_CARD, staggerItem } from './aboutMotion';

export function AboutOrgChart() {
  const { orgChart } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className={SECTION_PADDING}
      style={{ backgroundColor: BG_WHITE }}
      data-header-theme="light"
    >
      <Container fluid className={ABOUT_CONTAINER}>
        <motion.div {...fadeUpView(0, reduced)} className="max-w-2xl">
          <SectionLabel>{orgChart.overline}</SectionLabel>
          <h2 className="section-title section-title--light mt-4">{orgChart.title}</h2>
        </motion.div>

        <motion.div
          {...fadeUpView(0.1, reduced)}
          className={`mt-10 border border-[#252A30]/12 bg-white p-6 sm:mt-12 sm:p-8 ${SQUARE_CARD}`}
        >
          <div className={`mx-auto max-w-md border border-[#FF6B1A]/40 bg-[#111820] px-6 py-4 text-center ${SQUARE_CARD}`}>
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-[#FF6B1A]">
              Direction
            </p>
            <p className="card-title card-title--dark mt-2 text-base font-semibold">
              {orgChart.root}
            </p>
          </div>

          <div className="mx-auto mt-6 h-8 w-px bg-[#252A30]/20" aria-hidden />

          <div className="mt-2 grid gap-4 lg:grid-cols-3">
            {orgChart.branches.map((branch, index) => (
              <motion.div
                key={branch.title}
                {...staggerItem(index, reduced)}
                className={`border border-[#252A30]/10 bg-[#F5F2EC] p-5 ${SQUARE_CARD}`}
              >
                <h3 className="text-[0.9375rem] font-semibold text-[#252A30]">{branch.title}</h3>
                <ul className="mt-3 space-y-2">
                  {branch.roles.map((role) => (
                    <li
                      key={role}
                      className="border-l-2 border-[#FF6B1A]/50 pl-3 text-[0.8125rem] leading-relaxed text-[#6B7078]"
                    >
                      {role}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
