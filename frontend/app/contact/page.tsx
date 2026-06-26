import { ContactFormSection, ContactHero, ContactMapBand } from '@/components/contact';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { BreadcrumbJsonLd } from '@/components/seo';
import { contactPageContent } from '@/config/contact';
import { FOOTER_SECTION_BG } from '@/lib/footer-theme';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: contactPageContent.meta.title,
  description: contactPageContent.meta.description,
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="contact-page">
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      <ContactHero />
      <ContactFormSection />
      <ContactMapBand />
      <div style={{ backgroundColor: FOOTER_SECTION_BG }} data-header-theme="dark">
        <SiteFooter />
      </div>
    </div>
  );
}
