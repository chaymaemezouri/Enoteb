import {
  ActivityDomainsSection,
  CtaFooterSection,
  EnterpriseSection,
  HeroSection,
  PartnersSection,
  ProjectsPreview,
  WhyUsSection,
} from '@/components/home';
import { OrganizationJsonLd } from '@/components/seo';
import { homeContent } from '@/config/home';
import { api } from '@/lib/api';
import { createPageMetadata } from '@/lib/seo';
import type { ProjectSummary } from '@/types';

export const revalidate = 300;

export const metadata = createPageMetadata({
  title: 'Accueil',
  description: homeContent.hero.subtitle,
  path: '/',
});

async function getHomePageData(): Promise<{ projects: ProjectSummary[] }> {
  try {
    const projectsResponse = await api.getProjects({ limit: 4 }, { revalidate: 300 });
    return { projects: projectsResponse.data };
  } catch {
    return { projects: [] };
  }
}

export default async function HomePage() {
  const { projects } = await getHomePageData();

  return (
    <>
      <OrganizationJsonLd />
      <HeroSection />
      <PartnersSection placement="cta" />
      <EnterpriseSection />
      <ActivityDomainsSection />
      <ProjectsPreview projects={projects} />
      <WhyUsSection />
      <CtaFooterSection />
    </>
  );
}
