export const siteConfig = {
  name: 'ENOTEB',
  tagline: 'BTP & construction industrielle',
  nav: [
    { label: 'Accueil', href: '/' },
    { label: 'Qui sommes-nous', href: '/qui-sommes-nous' },
    { label: 'Secteurs', href: '/secteurs' },
    { label: 'Projets', href: '/projets' },
    { label: 'Contact', href: '/contact' },
  ],
  footer: {
    about:
      'Entreprise marocaine de BTP et construction industrielle — études, réalisation et coordination tous corps d’état.',
    servicesTitle: 'Services',
    services: [
      { label: 'Construction', href: '/secteurs/construction' },
      { label: 'Aménagement', href: '/secteurs/amenagement' },
      { label: 'Industrie', href: '/secteurs/industrie' },
      { label: 'Pharmaceutique', href: '/secteurs/pharmaceutique' },
      { label: 'Énergie', href: '/secteurs/energie-renouvelable' },
    ],
    companyTitle: "L'entreprise",
    company: [
      { label: 'Qui sommes-nous', href: '/qui-sommes-nous' },
      { label: 'Projets', href: '/projets' },
      { label: 'Contact', href: '/contact' },
    ],
    legalTitle: 'Légal',
    legal: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Politique de confidentialité', href: '/confidentialite' },
    ],
    contactTitle: 'Contact',
  },
  contact: {
    email: 'm.elfilali@enoteb.com',
    /** Ex. +212 6 00 00 00 00 */
    phone: '',
    address: 'Laâyoune, Maroc',
    addressLines: ['Hay El Wahda 02, Av. Rass El Khaima, rue 29 n° 37', 'Laâyoune', 'MA'],
  },
  legal: {
    companyName: 'ENOTEB',
    legalForm: 'S.A.R.L',
    foundedYear: 2024,
    capital: '1 000 000,00 MAD',
    rc: '49755',
    ice: '003472877000087',
    directorEmail: 'm.elfilali@enoteb.com',
  },
  maps: {
    locationQuery:
      'Hay El Wahda 02, Av. Rass El Khaima, rue 29 n° 37, Laâyoune, Maroc',
    zoom: 17,
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/enoteb',
    facebook: 'https://www.facebook.com/enoteb',
  },
  whatsapp: {
    /** Format international sans +, ex. 212600000000 */
    number: '',
    defaultMessage: 'Bonjour, je souhaite obtenir des informations sur vos services ENOTEB.',
  },
  url: 'https://enoteb.ma',
  logo: {
    src: '/images/logo_enoteb.png',
  },
  orangeCta: {
    overline: 'Contact',
    title: 'Prêt à démarrer votre projet ?',
    description: 'Nos experts sont à votre disposition pour étudier vos besoins.',
    buttonLabel: 'Contactez-nous',
    href: '/contact',
    secondaryLabel: 'Voir nos réalisations',
    secondaryHref: '/projets',
  },
  seo: {
    defaultDescription:
      'ENOTEB conçoit et réalise des projets de construction, d’aménagement et d’ingénierie industrielle au Maroc — entreprise générale TCE pour marchés publics et privés.',
    logoPath: '/images/logo_enoteb.png',
  },
} as const;
