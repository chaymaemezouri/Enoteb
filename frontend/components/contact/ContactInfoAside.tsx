import type { ComponentType, ReactNode } from 'react';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { FacebookIcon, LinkedinIcon, WhatsAppIcon } from '@/components/icons/SocialIcons';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { contactPageContent } from '@/config/contact';
import { siteConfig } from '@/config/site';
import { getPhoneTelHref, getWhatsAppUrl } from '@/lib/contact';
import { getActiveSocialLinks } from '@/lib/social';

const SOCIAL_ICONS = {
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
} as const;

function WhatsAppRowIcon({ className }: { className?: string }) {
  return <WhatsAppIcon className={className} />;
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <li className="contact-info-row">
      <span className="contact-info-row__icon">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div>
        <p className="contact-info-row__label">{label}</p>
        <div className="contact-info-row__value">{children}</div>
      </div>
    </li>
  );
}

export function ContactInfoAside() {
  const { info } = contactPageContent;
  const { contact } = siteConfig;
  const socialLinks = getActiveSocialLinks();
  const phone = contact.phone?.trim() ?? '';
  const whatsappNumber = siteConfig.whatsapp.number.trim();
  const whatsappUrl = getWhatsAppUrl();

  return (
    <aside className="contact-form-section__info" aria-labelledby="contact-info-title">
      <SectionLabel>{info.overline}</SectionLabel>
      <h2 id="contact-info-title" className="contact-info-aside__title">
        {info.title}
      </h2>

      <ul className="contact-info-aside__list">
        <InfoRow icon={Phone} label={info.phone}>
          {phone ? (
            <a href={getPhoneTelHref(phone)} className="contact-info-row__link">
              {phone}
            </a>
          ) : (
            <span className="contact-info-row__placeholder">{info.phonePlaceholder}</span>
          )}
        </InfoRow>

        <InfoRow icon={WhatsAppRowIcon} label={info.whatsapp}>
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-info-row__link"
            >
              {phone || whatsappNumber}
            </a>
          ) : (
            <span className="contact-info-row__placeholder">{info.whatsappPlaceholder}</span>
          )}
        </InfoRow>

        <InfoRow icon={Mail} label={info.email}>
          <a href={`mailto:${contact.email}`} className="contact-info-row__link">
            {contact.email}
          </a>
        </InfoRow>

        <InfoRow icon={MapPin} label={info.address}>
          <address className="not-italic">
            {contact.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </InfoRow>

        <InfoRow icon={Globe} label={info.website}>
          <a
            href={siteConfig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-info-row__link"
          >
            {siteConfig.url.replace(/^https?:\/\//, '')}
          </a>
        </InfoRow>
      </ul>

      {socialLinks.length > 0 ? (
        <div className="contact-info-aside__social">
          <p className="contact-info-aside__social-title">{info.socialTitle}</p>
          <div className="contact-info-aside__social-links">
            {socialLinks.map((link) => {
              const Icon = SOCIAL_ICONS[link.id];

              return (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-info-aside__social-link link-focus"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
