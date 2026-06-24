export const sectorsPageContent = {
  meta: {
    title: "Secteurs d'activité",
    description:
      'Construction, industrie, pharmaceutique, aménagement et énergie : découvrez les secteurs d’intervention d’ENOTEB au Maroc.',
  },
  hero: {
    titleLine1: 'Nos Secteurs',
    titleLine2: "d'Activité",
    description:
      'De la conception à la livraison clé en main, ENOTEB intervient sur les marchés les plus exigeants.',
    descriptionSecondary:
      'Construction, industrie, pharmaceutique, aménagement et énergies — une expertise pluridisciplinaire au service de vos projets.',
    imageSrc:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=85',
  },
  grid: {
    topRowSlugs: ['construction', 'industrie', 'pharmaceutique'],
    bottomRowSlugs: ['amenagement', 'energie-renouvelable'],
    ctaLabel: 'Voir les projets',
  },
  approach: {
    overline: 'Expertise intégrée',
    titleLine1: 'Une approche',
    titleLine2: 'transversale',
    items: [
      {
        title: 'Études de faisabilité',
        description:
          'Analyse technique, dimensionnement et chiffrage pour sécuriser vos décisions d’investissement dès la phase amont.',
        icon: 'compass' as const,
      },
      {
        title: "Bureau d'études",
        description:
          'Ingénierie, plans 2D/3D et coordination technique pour des ouvrages maîtrisés et conformes aux normes.',
        icon: 'drafting' as const,
      },
      {
        title: 'Management qualité',
        description:
          'Procédures, contrôles et suivi rigoureux pour garantir qualité, délais et budgets sur chaque chantier.',
        icon: 'shield' as const,
      },
    ],
    ctaBox: {
      title: 'Besoin d’une expertise technique pour votre prochain grand projet ?',
      description:
        'Nos équipes pluridisciplinaires vous accompagnent de l’étude à la réalisation, sur tous corps d’état.',
      buttonLabel: 'Contacter nos experts',
      href: '/contact',
    },
  },
  footer: {
    about:
      'Société marocaine experte en BTP et construction industrielle, ENOTEB intervient en entreprise générale sur marchés publics et privés.',
    servicesTitle: 'Services',
    companyTitle: "L'entreprise",
    contactTitle: 'Contact',
    companyLinks: [
      { label: 'Qui sommes-nous', href: '/qui-sommes-nous' },
      { label: 'Projets', href: '/projets' },
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Confidentialité', href: '/confidentialite' },
    ],
  },
} as const;
