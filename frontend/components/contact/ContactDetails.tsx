import { Mail, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { getPhoneTelHref } from '@/lib/contact';
import { Card } from '@/components/ui/Card';

export function ContactDetails() {
  const { contact } = siteConfig;

  return (
    <Card padding="lg" className="h-full">
      <h2 className="text-h3 text-neutral-900">Nos coordonnées</h2>
      <p className="mt-2 text-body-sm text-neutral-600">
        Vous pouvez aussi nous joindre directement par téléphone ou email.
      </p>

      <ul className="mt-8 space-y-6">
        {contact.phone ? (
          <li className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent">
              <Phone className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-body-sm font-medium text-neutral-900">Téléphone</p>
              <a
                href={getPhoneTelHref(contact.phone)}
                className="mt-1 inline-block text-body text-accent hover:text-accent-700"
              >
                {contact.phone}
              </a>
            </div>
          </li>
        ) : null}

        <li className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent">
            <Mail className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-body-sm font-medium text-neutral-900">Email</p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-1 inline-block text-body text-accent hover:text-accent-700"
            >
              {contact.email}
            </a>
          </div>
        </li>

        <li className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent">
            <MapPin className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <p className="text-body-sm font-medium text-neutral-900">Adresse</p>
            <address className="mt-1 not-italic text-body text-neutral-600">
              {contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
        </li>
      </ul>
    </Card>
  );
}
