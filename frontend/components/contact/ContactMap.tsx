import { siteConfig } from '@/config/site';
import { Container } from '@/components/ui/Container';

export function ContactMap() {
  return (
    <section className="bg-surface-muted py-section-sm lg:py-section">
      <Container>
        <h2 className="text-h2 text-neutral-900">Nous trouver</h2>
        <p className="mt-2 text-body text-neutral-600">{siteConfig.contact.address}</p>

        <div className="mt-8 overflow-hidden rounded-card border border-border shadow-card">
          <iframe
            title={`Carte Google Maps — ${siteConfig.name}`}
            src={siteConfig.maps.embedUrl}
            className="aspect-[16/9] w-full border-0 sm:aspect-[21/9]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </Container>
    </section>
  );
}
