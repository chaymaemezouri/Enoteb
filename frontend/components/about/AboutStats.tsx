'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { AboutContainer, AboutLabel, AboutSection } from './AboutLayout';
import { fadeUpView } from './aboutMotion';

export function AboutStats() {
  const { stats } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <AboutSection tone="sand" className="about-v2-section--band" aria-label="Chiffres clés ENOTEB">
      <AboutContainer compact>
        <motion.div {...fadeUpView(0, reduced)} className="mb-6 sm:mb-7">
          <AboutLabel>{stats.overline}</AboutLabel>
        </motion.div>
        <ul className="about-v2-stats__list" role="list">
          {stats.items.map((stat, index) => (
            <motion.li
              key={stat.label}
              role="listitem"
              {...fadeUpView(index * 0.06, reduced)}
              className="about-v2-stats__item"
            >
              <span className="about-v2-stats__value">{stat.value}</span>
              <span className="about-v2-stats__label">{stat.label}</span>
            </motion.li>
          ))}
        </ul>
      </AboutContainer>
    </AboutSection>
  );
}
