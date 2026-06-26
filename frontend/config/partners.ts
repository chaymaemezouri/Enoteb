export const partnersContent = {
  overline: 'Partenariats',
  items: [
    { name: 'OCP', logo: '/images/partenaires/mono/ocp.png' },
    { name: 'Hikma', logo: '/images/partenaires/mono/hikma.png' },
    { name: 'SPIE', logo: '/images/partenaires/mono/spie.png' },
    { name: 'ONEE', logo: '/images/partenaires/mono/onee.png' },
    { name: 'EMMSA', logo: '/images/partenaires/mono/emmsa.png' },
    { name: 'OLA Energy', logo: '/images/partenaires/mono/ola-energy.png' },
    { name: 'JESA', logo: '/images/partenaires/mono/jesa.png' },
    { name: 'Grupo Soil', logo: '/images/partenaires/mono/grupo-soil.png' },
    { name: 'Valvtec', logo: '/images/partenaires/mono/valvtec.png' },
    { name: 'Medjool Star', logo: '/images/partenaires/mono/medjool-star.png' },
    { name: 'Herjimar', logo: '/images/partenaires/mono/herjimar.png' },
    { name: 'Horiwon', logo: '/images/partenaires/mono/horiwon.png' },
    { name: 'SADV', logo: '/images/partenaires/mono/sadv.png' },
  ],
} as const;

export type PartnerItem = (typeof partnersContent.items)[number];
