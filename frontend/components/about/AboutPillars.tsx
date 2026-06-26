'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { AboutContainer, AboutLead, AboutSection, AboutTitle } from './AboutLayout';
import { fadeUpView, staggerItem } from './aboutMotion';

export function AboutPillars() {
  const { pillars } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <AboutSection tone="sandSoft" aria-labelledby="about-pillars-title">
      <AboutContainer>
        <motion.header
          {...fadeUpView(0, reduced)}
          className="about-v2-pillars__header"
        >
          <AboutTitle
            id="about-pillars-title"
            className="about-v2-pillars__title text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.12]"
          >
            {pillars.title}
          </AboutTitle>
          <AboutLead className="about-v2-pillars__intro">{pillars.intro}</AboutLead>
        </motion.header>

        <ul className="about-v2-pillars__grid" role="list">
          {pillars.items.map((item, index) => (
            <motion.li
              key={item.title}
              {...staggerItem(index, reduced)}
              role="listitem"
              className="about-v2-pillars__card"
            >
              <span className="about-v2-pillars__index" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="about-v2-accent-mark about-v2-pillars__mark" aria-hidden />
              <h3 className="about-v2-pillars__card-title">{item.title}</h3>
              <p className="about-v2-pillars__card-text">{item.description}</p>
            </motion.li>
          ))}
        </ul>
      </AboutContainer>
    </AboutSection>
  );
}
