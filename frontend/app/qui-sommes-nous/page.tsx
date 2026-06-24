import type { Metadata } from 'next';
import {
  AboutClients,
  AboutCtaBanner,
  AboutDomains,
  AboutEngagements,
  AboutEquipment,
  AboutExperience,
  AboutFoundations,
  AboutHero,
  AboutHumanCapital,
  AboutIntro,
  AboutLegal,
  AboutOrgChart,
} from '@/components/about';
import { aboutContent } from '@/config/about';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: aboutContent.meta.title,
  description: aboutContent.meta.description,
  path: '/qui-sommes-nous',
  image: aboutContent.entreprise.imageSrc,
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutIntro />
      <AboutDomains />
      <AboutHumanCapital />
      <AboutEquipment />
      <AboutFoundations />
      <AboutEngagements />
      <AboutClients />
      <AboutOrgChart />
      <AboutExperience />
      <AboutLegal />
      <AboutCtaBanner />
    </>
  );
}
