import { partnersContent } from './partners';

export const homeContent = {
  hero: {
    backgroundWord: 'ENOTEB',
    title: "Donner forme à l'avenir",
    subtitle:
      'Études, bâtiment, aménagement et construction industrielle au service des projets exigeants.',
    videoSrc: '/videos/enoteb-hero.mp4',
    posterSrc: '/images/image.png',
    posterFallback:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80',
    primaryCta: 'Découvrir nos projets',
    secondaryCta: 'Nous contacter',
  },
  stats: {
    items: [
      { value: 14, suffix: '+', label: "Ans d'expérience" },
      { value: 100, suffix: '+', label: 'Projets réalisés' },
      { value: 5, suffix: '', label: 'Secteurs couverts' },
      { value: 10, suffix: '+', label: 'Partenaires de confiance' },
    ],
  },
  intro: {
    overline: "L'entreprise",
    title: 'Une référence marocaine du BTP et de la construction industrielle',
    titleLines: [
      'Une référence marocaine du\u00a0BTP',
      'et de la construction industrielle',
    ],
    textLines: [
      'ENOTEB accompagne les projets de bâtiment,',
      "d'aménagement et de construction industrielle",
      'avec une approche rigoureuse, des moyens\u00a0adaptés',
      'et une exigence constante de qualité, de coûts et de\u00a0délais.',
    ],
    ctaLabel: 'En savoir plus',
    imageSrc:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Chantier de construction ENOTEB',
    features: [
      {
        title: 'Professionnalisme',
        description: 'Équipes qualifiées et pilotage maîtrisé de bout en bout.',
      },
      {
        title: "Rigueur d'exécution",
        description: 'Méthodes structurées, contrôle qualité et respect des délais.',
      },
      {
        title: 'Moyens matériels performants',
        description: 'Parc équipements et organisation adaptés à chaque chantier.',
      },
    ],
  },
  activityDomains: {
    overline: "Domaines d'activités",
    title: "Trois pôles d'expertise au service de vos projets",
    description:
      'De la conception à la livraison clé en main, ENOTEB couvre l’ensemble de la chaîne de valeur du BTP et de l’industrie.',
    items: [
      {
        title: 'Étude et Conception',
        description:
          'Perspectives 3D, plans 2D, ingénierie et dimensionnement pour des projets maîtrisés dès la phase étude.',
        icon: 'design' as const,
        imageSrc: '/images/cards/Étude et Conception.png',
      },
      {
        title: 'Construction Industrielle',
        description:
          'Charpente, structures lourdes, réservoirs, tuyauterie et installations pour l’industrie, l’énergie et la pharmacie.',
        icon: 'industry' as const,
        imageSrc: '/images/cards/Construction Industrielle .png',
      },
      {
        title: 'Bâtiment & Travaux Publics',
        description:
          'Génie civil, bâtiments administratifs, terrassements et aménagements pour les marchés publics et privés.',
        icon: 'building' as const,
        imageSrc: '/images/cards/Bâtiment & Travaux Publics.png',
      },
    ],
  },
  projects: {
    overline: 'Réalisations',
    title: 'Projets récents',
    description:
      'Découvrez une sélection de réalisations menées avec rigueur, maîtrise technique et respect des exigences terrain.',
    ctaLabel: 'Voir tous les projets',
  },
  sectors: {
    overline: 'Secteurs',
    title: 'Nos domaines d’intervention',
    description:
      'Construction, industrie, énergie et infrastructures : ENOTEB intervient sur des marchés exigeants.',
  },
  whyUs: {
    overline: 'Pourquoi nous choisir',
    title: 'Une approche rigoureuse pour des projets maîtrisés',
    description:
      'ENOTEB accompagne chaque projet avec une organisation claire, une équipe qualifiée et des moyens adaptés, afin de garantir qualité d’exécution, respect des délais et maîtrise des coûts.',
    ctaLabel: 'Discuter d’un projet',
    ctaHref: '/contact',
    items: [
      {
        title: 'Maîtrise technique',
        description:
          'Une expertise terrain sur les projets de bâtiment, d’aménagement et de construction industrielle.',
      },
      {
        title: 'Respect des engagements',
        description:
          'Une planification structurée pour tenir les délais, les coûts et les exigences du chantier.',
      },
      {
        title: 'Qualité d’exécution',
        description:
          'Un suivi rigoureux à chaque étape pour garantir un résultat fiable et durable.',
      },
      {
        title: 'Moyens adaptés',
        description:
          'Des équipes qualifiées et des équipements performants pour répondre aux projets exigeants.',
      },
    ],
  },
  partners: partnersContent,
  cta: {
    overline: 'Contact',
    title: 'Un projet en tête ? Parlons-en.',
    titleLines: ['Un projet en tête ?', 'Parlons-en.'],
    description: 'Notre équipe vous répond sous 48 h ouvrées.',
    footerDescription:
      'Notre équipe vous accompagne avec réactivité pour étudier votre projet.',
    primaryLabel: 'Nous contacter',
    secondaryLabel: 'Voir nos réalisations',
  },
} as const;
