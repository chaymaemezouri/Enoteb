import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Mentions légales',
  description: 'Mentions légales du site ENOTEB.',
  path: '/mentions-legales',
});

export default function LegalNoticePage() {
  const { legal, contact } = siteConfig;

  return (
    <>
      <PageHero
        overline="Informations légales"
        title="Mentions légales"
        description="Informations relatives à l’éditeur du site et à l’hébergement."
      />
      <section className="py-section-sm lg:py-section">
        <Container>
          <div className="prose-neutral max-w-3xl space-y-6 text-body text-neutral-700">
            <div>
              <h2 className="text-h3 text-neutral-900">Éditeur du site</h2>
              <dl className="mt-4 space-y-2">
                <div>
                  <dt className="font-medium text-neutral-900">Raison sociale</dt>
                  <dd>{legal.companyName}</dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">Forme juridique</dt>
                  <dd>{legal.legalForm}</dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">Siège social</dt>
                  <dd>
                    {contact.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">Capital social</dt>
                  <dd>{legal.capital}</dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">Registre de commerce</dt>
                  <dd>{legal.rc}</dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">ICE</dt>
                  <dd>{legal.ice}</dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${legal.directorEmail}`}
                      className="text-accent hover:text-accent-700"
                    >
                      {legal.directorEmail}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <p>
              Le site {siteConfig.url.replace('https://', '')} est édité par {legal.companyName},
              société spécialisée en BTP et construction industrielle au Maroc.
            </p>

            <p>
              Pour toute question relative à ce site, contactez-nous via la page Contact ou par
              email à {legal.directorEmail}.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
