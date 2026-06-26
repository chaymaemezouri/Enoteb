export const projectsPageContent = {
  meta: {
    title: 'Nos projets',
    description:
      'Découvrez les réalisations ENOTEB : construction, industrie, pharmaceutique, aménagement et énergies au Maroc.',
  },
  hero: {
    overline: 'Projets',
    titleLine1: 'Nos réalisations',
    titleLine2: 'Projets',
    description:
      'Des chantiers livrés avec rigueur, qualité et respect des délais pour les plus grands comptes nationaux.',
    descriptionSecondary:
      'OCP, Hikma, SPIE, ONEE et d’autres partenaires de confiance nous font confiance sur leurs ouvrages les plus exigeants.',
    imageSrc:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Chantier de construction et ingénierie industrielle',
    imageFallback: '/images/screen.png',
  },
  sectorHero: {
    construction: {
      overline: 'Secteur construction',
      titleSuffix: 'Réalisations',
      description:
        'Gros œuvre, coordination tous corps d’état et ouvrages de bâtiment livrés avec rigueur pour les marchés publics et privés.',
    },
    amenagement: {
      overline: 'Secteur aménagement',
      titleSuffix: 'Réalisations',
      description:
        'Conception, agencement et finitions premium pour espaces tertiaires, industriels et institutionnels.',
    },
    industrie: {
      overline: 'Secteur industrie',
      titleSuffix: 'Réalisations',
      description:
        'Charpente, structures lourdes, réservoirs et installations pour l’industrie et l’énergie au Maroc.',
    },
    pharmaceutique: {
      overline: 'Secteur pharmaceutique',
      titleSuffix: 'Réalisations',
      description:
        'Environnements contrôlés, salles blanches et ouvrages conformes aux exigences de l’industrie pharma.',
    },
    'energie-renouvelable': {
      overline: 'Secteur énergie',
      titleSuffix: 'Réalisations',
      description:
        'Infrastructures énergétiques, postes, pipelines et ouvrages techniques pour les grands opérateurs.',
    },
  } as Record<string, { overline: string; titleSuffix: string; description: string }>,
  listing: {
    subtitle: 'Parcourez nos chantiers livrés au Maroc, par secteur d’activité.',
    refineTitle: 'Filtrer',
    sectorLabel: 'Secteur',
    allSectorsLabel: 'Tous les secteurs',
    filterLabel: 'Filtrer par secteur',
    allLabel: 'Tous',
    resultsLabel: 'projet',
    resultsLabelPlural: 'projets',
    emptyTitle: 'Aucun projet trouvé',
    emptyAll:
      'Nos projets seront bientôt disponibles. Revenez prochainement ou contactez-nous pour en savoir plus.',
    emptySector:
      'Aucune réalisation publiée dans ce secteur pour le moment. Essayez un autre filtre ou revenez ultérieurement.',
  },
  approach: {
    overline: 'Excellence projet',
    titleLine1: 'Une exécution',
    titleLine2: 'maîtrisée',
    items: [
      {
        title: 'Planification rigoureuse',
        description:
          'Phasage, coordination des corps d’état et suivi des jalons pour tenir les engagements contractuels.',
        icon: 'calendar' as const,
      },
      {
        title: 'Contrôle qualité',
        description:
          'Procédures formalisées, contrôles terrain et traçabilité sur l’ensemble du cycle projet.',
        icon: 'shield' as const,
      },
      {
        title: 'Livraison clé en main',
        description:
          'De la conception à la mise en service, ENOTEB pilote vos ouvrages jusqu’à la réception finale.',
        icon: 'key' as const,
      },
    ],
    ctaBox: {
      title: 'Un projet industriel ou de construction à confier ?',
      description:
        'Parlons de vos contraintes techniques, de vos délais et de la meilleure organisation pour votre chantier.',
      buttonLabel: 'Demander un devis',
      href: '/contact',
    },
  },
  detail: {
    backLabel: 'Retour aux projets',
    descriptionHeading: 'Description du projet',
    technicalSheetTitle: 'Fiche technique',
    sectorLabel: 'Secteur',
    locationLabel: 'Localisation',
    amountLabel: "Montant d'investissement",
    yearLabel: 'Année de réalisation',
    clientLabel: 'Client',
    statusLabel: 'Statut',
    statusDelivered: 'Livré',
    similarProject: 'Vous avez un projet similaire ?',
    whatsappLabel: 'WhatsApp',
    contactExpertLabel: 'Contacter un expert',
    mapLabel: 'Carte interactive',
    highlightsBySector: {
      construction: [
        {
          title: 'Gros œuvre',
          description: 'Fondations, structure et enveloppe pour ouvrages durables et conformes.',
          icon: 'building' as const,
        },
        {
          title: 'Coordination TCE',
          description: 'Pilotage multi-corps d’état et respect des délais contractuels.',
          icon: 'layers' as const,
        },
      ],
      amenagement: [
        {
          title: 'Conception intégrée',
          description: 'Plans, perspectives et aménagements adaptés aux usages.',
          icon: 'compass' as const,
        },
        {
          title: 'Finitions premium',
          description: 'Qualité d’exécution et détails soignés pour espaces tertiaires.',
          icon: 'sparkles' as const,
        },
      ],
      industrie: [
        {
          title: 'Charpente métallique',
          description: 'Structures lourdes, réservoirs et ouvrages industriels.',
          icon: 'beam' as const,
        },
        {
          title: 'Tuyauterie & équipements',
          description: 'Réseaux process, pose et raccordements sur sites exigeants.',
          icon: 'pipe' as const,
        },
      ],
      pharmaceutique: [
        {
          title: 'Environnements contrôlés',
          description: 'Salles blanches et zones stériles selon normes sectorielles.',
          icon: 'shield' as const,
        },
        {
          title: 'Qualification',
          description: 'Procédures qualité et traçabilité pour l’industrie pharma.',
          icon: 'clipboard' as const,
        },
      ],
      'energie-renouvelable': [
        {
          title: 'Infrastructures énergie',
          description: 'Postes, pipelines et ouvrages pour réseaux énergétiques.',
          icon: 'zap' as const,
        },
        {
          title: 'Ingénierie terrain',
          description: 'Études, fabrication et mise en service clé en main.',
          icon: 'wrench' as const,
        },
      ],
    },
    defaultHighlights: [
      {
        title: 'Exécution terrain',
        description: 'Équipes expérimentées et procédures rigoureuses sur chantier.',
        icon: 'beam' as const,
      },
      {
        title: 'Qualité & délais',
        description: 'Suivi contractuel et livraison conforme aux exigences client.',
        icon: 'shield' as const,
      },
    ],
  },
} as const;
