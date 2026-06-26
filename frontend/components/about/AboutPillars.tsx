'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import {
  AboutAccentMark,
  AboutContainer,
  AboutLabel,
  AboutLead,
  AboutSection,
  AboutTitle,
} from './AboutLayout';
import { fadeUpView, staggerItem } from './aboutMotion';

export function AboutPillars() {
  const { pillars } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <AboutSection tone="sandSoft" aria-labelledby="about-pillars-title">
      <AboutContainer>
        <div className="about-v2-pillars">
          <motion.aside
            {...fadeUpView(0, reduced)}
            className="about-v2-pillars__aside"
          >
            <AboutLabel>
              <span id="about-pillars-title">{pillars.overline}</span>
            </AboutLabel>
            <AboutTitle className="mt-5 text-[clamp(1.625rem,3vw,2.25rem)] leading-[1.14]">
              {pillars.title}
            </AboutTitle>
            <AboutLead className="mt-5">{pillars.intro}</AboutLead>
          </motion.aside>

          <div className="about-v2-shell--light about-v2-pillars__list-shell">
            <div className="about-v2-pillars__list" role="list">
              {pillars.items.map((item, index) => (
                <motion.article
                  key={item.title}
                  {...staggerItem(index, reduced)}
                  role="listitem"
                  className="about-v2-pillars__item group"
                >
                  <AboutAccentMark />
                  <div className="min-w-0">
                    <h3 className="about-v2-pillars__item-title">{item.title}</h3>
                    <p className="about-v2-pillars__item-text">{item.description}</p>
                  </div>
                  <span className="about-v2-pillars__item-rule" aria-hidden />
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
