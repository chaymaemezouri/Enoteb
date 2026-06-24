'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ABOUT_CONTAINER, BG_LIGHT, fadeUpView, SECTION_PADDING, SQUARE_CARD } from './aboutMotion';

export function AboutLegal() {
  const { legal } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className={`${SECTION_PADDING} border-t border-[#252A30]/10`}
      style={{ backgroundColor: BG_LIGHT }}
      data-header-theme="light"
    >
      <Container fluid className={ABOUT_CONTAINER}>
        <motion.div {...fadeUpView(0, reduced)} className="max-w-3xl">
          <SectionLabel>{legal.overline}</SectionLabel>
          <h2 className="section-title section-title--light mt-4">{legal.title}</h2>

          <dl className={`mt-8 grid gap-px border border-[#252A30]/12 bg-[#252A30]/12 sm:grid-cols-2 ${SQUARE_CARD}`}>
            {legal.items.map((item) => (
              <div key={item.label} className="bg-white p-4 sm:p-5">
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#6B7078]">
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-[0.9375rem] text-[#252A30]">
                  {'href' in item && typeof item.href === 'string' ? (
                    <Link
                      href={item.href}
                      className="link-focus text-[#FF6B1A] transition-colors hover:text-[#e85f12]"
                    >
                      {item.value}
                    </Link>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </Container>
    </section>
  );
}
