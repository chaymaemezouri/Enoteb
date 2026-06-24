import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité et protection des données personnelles — ENOTEB.',
  path: '/confidentialite',
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        overline="Données personnelles"
        title="Politique de confidentialité"
        description="Comment nous collectons, utilisons et protégeons vos informations."
      />
      <section className="py-section-sm lg:py-section">
        <Container>
          <div className="prose-neutral max-w-3xl space-y-6 text-body text-neutral-700">
            <p>
              Les données transmises via le formulaire de contact (nom, email, téléphone, message)
              sont utilisées uniquement pour répondre à votre demande.
            </p>
            <p>
              Elles ne sont ni vendues ni cédées à des tiers. Vous pouvez demander la modification
              ou la suppression de vos données en nous contactant à {siteConfig.contact.email}.
            </p>
            <p className="text-body-sm text-neutral-500">
              Ce texte sera complété conformément à la réglementation marocaine applicable avant la
              mise en production définitive.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
