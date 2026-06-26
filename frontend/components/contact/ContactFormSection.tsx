'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { contactPageContent } from '@/config/contact';
import { ContactForm } from './ContactForm';
import { ContactInfoAside } from './ContactInfoAside';
import { CONTACT_SHELL, fadeUpView } from './contactMotion';

export function ContactFormSection() {
  const { main, form } = contactPageContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="contact-form-section" data-header-theme="dark">
      <div className={`${CONTACT_SHELL} contact-form-section__inner`}>
        <motion.div {...fadeUpView(0.06, reduced)} className="contact-form-section__shell">
          <div className="contact-form-section__grid">
            <ContactInfoAside />

            <div className="contact-form-section__form">
              <SectionLabel>{form.overline}</SectionLabel>
              <h2 className="contact-form-section__form-title">{form.title}</h2>
              <p className="contact-form-section__intro">{main.intro}</p>
              <ContactForm />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
