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

export function AboutFoundations() {
  const { foundations } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <AboutSection tone="sand" id="notre-histoire" aria-label="Mission, vision et valeurs">
      <AboutContainer>
        <motion.div {...fadeUpView(0, reduced)} className="about-v2-foundations__shell">
          <div className="about-v2-foundations__split">
            <article className="about-v2-foundations__mission p-8 sm:p-10 lg:p-11">
              <AboutLabel>{foundations.mission.label}</AboutLabel>
              <AboutTitle className="mt-5 text-[clamp(1.5rem,2.6vw,1.875rem)]">
                {foundations.mission.title}
              </AboutTitle>
              <AboutLead className="mt-4">{foundations.mission.text}</AboutLead>
            </article>

            <article className="about-v2-foundations__vision p-8 sm:p-10 lg:p-11">
              <AboutLabel>{foundations.vision.label}</AboutLabel>
              <AboutTitle light className="mt-5 text-[clamp(1.5rem,2.6vw,1.875rem)]">
                {foundations.vision.title}
              </AboutTitle>
              <AboutLead light className="mt-4">
                {foundations.vision.text}
              </AboutLead>
            </article>
          </div>

          <div className="about-v2-foundations__values-zone">
            <AboutLabel center>{foundations.valuesLabel}</AboutLabel>

            <div className="about-v2-values__grid" role="list">
              {foundations.values.map((value, index) => (
                <motion.article
                  key={value.title}
                  {...staggerItem(index, reduced)}
                  role="listitem"
                  className="about-v2-values__card"
                >
                  <AboutAccentMark />
                  <h3 className="about-v2-values__title">{value.title}</h3>
                  <p className="about-v2-values__text">{value.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      </AboutContainer>
    </AboutSection>
  );
}
