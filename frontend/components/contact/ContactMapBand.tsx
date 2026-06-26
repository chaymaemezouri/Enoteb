import { contactPageContent } from '@/config/contact';
import { siteConfig } from '@/config/site';
import { getGoogleMapsEmbedUrl } from '@/lib/maps';

export function ContactMapBand() {
  const { map } = contactPageContent;
  const embedUrl = getGoogleMapsEmbedUrl();

  return (
    <section className="contact-map-band" aria-label={map.ariaLabel} data-header-theme="dark">
      <iframe
        title={`Carte — ${siteConfig.name}, ${siteConfig.contact.address}`}
        src={embedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="contact-map-band__frame"
      />
    </section>
  );
}
