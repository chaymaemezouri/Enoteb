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

export function AboutDna() {
  const { dna } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <AboutSection tone="deep" aria-labelledby="about-dna-title">
      <AboutContainer className="about-v2-editorial">
        <motion.header {...fadeUpView(0, reduced)} className="about-v2-editorial__head max-w-2xl">
          <AboutLabel>
            <span id="about-dna-title">{dna.overline}</span>
          </AboutLabel>
          <AboutTitle light className="mt-5 text-[clamp(1.75rem,3.2vw,2.375rem)] leading-[1.12]">
            Un savoir-faire construit sur{' '}
            <span className="text-[#FF6A1A]">l&apos;exigence</span>
          </AboutTitle>
          <AboutLead light className="mt-5 max-w-xl">
            {dna.description}
          </AboutLead>
        </motion.header>

        <div className="about-v2-shell--dark about-v2-dna__shell">
          <div className="about-v2-trio about-v2-trio--dna about-v2-trio--on-dark" role="list">
            {dna.lines.map((line, index) => (
              <motion.article
                key={line.title}
                {...staggerItem(index, reduced)}
                role="listitem"
                className="about-v2-trio__col"
              >
                <AboutAccentMark className="about-v2-accent-mark--on-dark" />
                <h3 className="about-v2-trio__title">{line.title}</h3>
                <p className="about-v2-trio__text">{line.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
