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
    phone: undefined as string | undefined,
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
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.2!2d-13.2!3d27.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDA5JzAwLjAiTiAxM8KwMTInMDAuMCJX!5e0!3m2!1sfr!2sma!4v1700000000000!5m2!1sfr!2sma',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/enoteb',
    facebook: 'https://www.facebook.com/enoteb',
  },
  whatsapp: {
    number: '',
    defaultMessage: 'Bonjour, je souhaite obtenir des informations sur vos services ENOTEB.',
  },
  url: 'https://enoteb.ma',
  logo: {
    src: '/images/logo_enoteb.png',
  },
  seo: {
    defaultDescription:
      'ENOTEB conçoit et réalise des projets de construction, d’aménagement et d’ingénierie industrielle au Maroc — entreprise générale TCE pour marchés publics et privés.',
    logoPath: '/images/logo_enoteb.png',
  },
} as const;
