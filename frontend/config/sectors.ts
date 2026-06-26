export const sectorsPageContent = {
  meta: {
    title: "Secteurs d'activité",
    description:
      'Construction, industrie, pharmaceutique, aménagement et énergie : découvrez les secteurs d’intervention d’ENOTEB au Maroc.',
  },
  hero: {
    overline: 'Secteurs',
    titleLine1: 'Nos secteurs',
    titleLine2: "d'activité",
    description:
      'Des domaines d’intervention complémentaires — de la construction à l’industrie, de l’aménagement aux énergies.',
  },
  grid: {
    overline: 'Nos domaines',
    title: 'Nos domaines d’intervention',
    ctaLabel: 'Voir les projets',
  },
  sectorHero: {
    construction: {
      overline: 'Secteur construction',
      titleSuffix: 'Projets & réalisations',
    },
    amenagement: {
      overline: 'Secteur aménagement',
      titleSuffix: 'Projets & réalisations',
    },
    industrie: {
      overline: 'Secteur industrie',
      titleSuffix: 'Projets & réalisations',
    },
    pharmaceutique: {
      overline: 'Secteur pharmaceutique',
      titleSuffix: 'Projets & réalisations',
    },
    'energie-renouvelable': {
      overline: 'Secteur énergie',
      titleSuffix: 'Projets & réalisations',
    },
  } as Record<string, { overline: string; titleSuffix: string }>,
  approach: {
    overline: 'Méthode',
    titleLine1: 'Une chaîne de valeur',
    titleLine2: 'intégrée',
    intro:
      'De l’étude amont au contrôle qualité sur chantier, nos équipes couvrent l’ensemble du cycle projet.',
    items: [
      {
        title: 'Études de faisabilité',
        description:
          'Analyse technique, dimensionnement et chiffrage pour sécuriser vos décisions d’investissement dès la phase amont.',
      },
      {
        title: "Bureau d'études",
        description:
          'Ingénierie, plans 2D/3D et coordination technique pour des ouvrages maîtrisés et conformes aux normes.',
      },
      {
        title: 'Management qualité',
        description:
          'Procédures, contrôles et suivi rigoureux pour garantir qualité, délais et budgets sur chaque chantier.',
      },
    ],
    ctaBox: {
      title: 'Un projet industriel ou de construction à confier ?',
      description:
        'Nos équipes pluridisciplinaires vous accompagnent de l’étude à la réalisation, sur tous corps d’état.',
      buttonLabel: 'Contacter nos experts',
      href: '/contact',
    },
  },
} as const;
