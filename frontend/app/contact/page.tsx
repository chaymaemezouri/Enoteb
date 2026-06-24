import { ContactDetails } from '@/components/contact/ContactDetails';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactMap } from '@/components/contact/ContactMap';
import { ContactSocialLinks } from '@/components/contact/ContactSocialLinks';
import { ContactWhatsApp } from '@/components/contact/ContactWhatsApp';
import { FadeIn } from '@/components/home/FadeIn';
import { PageHero } from '@/components/shared/PageHero';
import { createPageMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';

export const metadata = createPageMetadata({
  title: 'Contact',
  description:
    'Contactez eNoteb pour vos projets de construction et d’ingénierie industrielle. Formulaire, téléphone, email et WhatsApp.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        overline="Contact"
        title="Parlons de votre projet"
        description="Notre équipe est à votre écoute pour étudier vos besoins et vous proposer une réponse adaptée."
      />

      <section className="py-section-sm lg:py-section">
        <Container>
          <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
            <FadeIn className="lg:col-span-3">
              <ContactForm />
            </FadeIn>

            <FadeIn delay={0.1} className="lg:col-span-2">
              <ContactDetails />
            </FadeIn>
          </div>

          <div className="mt-8 space-y-8">
            <FadeIn delay={0.15}>
              <ContactWhatsApp />
            </FadeIn>

            <FadeIn delay={0.2}>
              <ContactSocialLinks />
            </FadeIn>
          </div>
        </Container>
      </section>

      <ContactMap />
    </>
  );
}
