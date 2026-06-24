import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { createPrismaClient } from './client';

const prisma = createPrismaClient();

const PLACEHOLDER_SLUGS = [
  'extension-usine-agroalimentaire',
  'centre-recherche-pharmaceutique',
  'parc-solaire-photovoltaique',
] as const;

const sectors = [
  {
    name: 'Construction',
    slug: 'construction',
    description:
      'Terrassements, fondations, couverture, étanchéité, gros œuvre et ouvrages structurels pour marchés publics et privés.',
    order: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Aménagement',
    slug: 'amenagement',
    description:
      'Conception et réalisation d’espaces tertiaires, studios, halls d’affaires, villas et aménagements intérieurs avec perspectives 3D.',
    order: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Industrie',
    slug: 'industrie',
    description:
      'Charpente, structures lourdes, citernes, réservoirs, tuyauterie et installations pour l’industrie pétrolière, gazière et manufacturière.',
    order: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Pharmaceutique',
    slug: 'pharmaceutique',
    description:
      'Aménagement de zones stériles, salles blanches, laboratoires et environnements contrôlés pour l’industrie pharmaceutique.',
    order: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1579154204751-5661f58597a0?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Énergie',
    slug: 'energie-renouvelable',
    description:
      'Postes de transformation, pipelines, stations de dépotage et infrastructures énergétiques.',
    order: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1473341304170-f89fa6ea8405?auto=format&fit=crop&w=800&q=80',
  },
] as const;

function projectImage(seed: string): string {
  return `https://picsum.photos/seed/enoteb-${seed}/1200/800`;
}

const projects = [
  {
    name: 'Bâtiment administratif, buvette et 27 ateliers incubateur',
    slug: 'ocp-acx-khouribga-incubateur',
    sectorSlug: 'construction',
    client: 'Groupe OCP — SADV',
    location: 'Khouribga',
    description:
      'Travaux de construction et d’aménagement à OCP ACX Khouribga : bâtiment administratif, buvette et 27 ateliers incubateur.',
    mainImageUrl: projectImage('ocp-incubateur'),
  },
  {
    name: 'Mail Central, Médiathèque et Musée',
    slug: 'mail-central-mediatheque-khouribga',
    sectorSlug: 'amenagement',
    client: 'Groupe OCP — SADV',
    location: 'Khouribga',
    description:
      'Travaux divers de bâtiment et d’aménagement au Mail Central : médiathèque et musée.',
    mainImageUrl: projectImage('mail-central'),
  },
  {
    name: 'Réaménagement École 1337 — Makers in Residence',
    slug: 'ecole-1337-makers-khouribga',
    sectorSlug: 'amenagement',
    client: 'Groupe OCP — SADV',
    location: 'Khouribga',
    description:
      'Réaménagement de l’école 1337 — extension Makers in Residence au Mail Central Khouribga, 1er étage.',
    mainImageUrl: projectImage('ecole-1337-makers'),
  },
  {
    name: 'Aménagement restaurant École 1337',
    slug: 'restaurant-ecole-1337-khouribga',
    sectorSlug: 'amenagement',
    client: 'Groupe OCP — SADV',
    location: 'Khouribga',
    description:
      'Aménagement des cuisines et zone de stockage, installation des équipements de cuisine, fourniture et pose de monte-charges.',
    mainImageUrl: projectImage('restaurant-1337'),
  },
  {
    name: 'Aménagement injectable et annexes — Céphalosporine',
    slug: 'hikma-cephalosporine-had-soualem',
    sectorSlug: 'pharmaceutique',
    client: 'Groupe Hikma Pharmaceuticals',
    location: 'Had Soualem',
    description:
      'Travaux d’aménagement céphalosporine (CEA), réaménagement des vestiaires, CET d’entrepôt, portes pharmaceutiques, travaux en Corian.',
    mainImageUrl: projectImage('hikma-cephalo'),
  },
  {
    name: 'Réaménagement de 51 villas Marguerite',
    slug: 'villas-marguerite-benguerir',
    sectorSlug: 'construction',
    client: 'Groupe OCP — SADV',
    location: 'Benguerir',
    description:
      'Travaux de réaménagement de 51 villas Marguerite, tranche B à Benguerir.',
    mainImageUrl: projectImage('villas-benguerir'),
  },
  {
    name: 'Extension École primaire IPSE',
    slug: 'ecole-ipse-safi',
    sectorSlug: 'construction',
    client: 'Groupe OCP — SADV',
    location: 'Safi',
    description:
      'Travaux de construction de l’extension de l’école primaire IPSE à Safi.',
    mainImageUrl: projectImage('ecole-ipse'),
  },
  {
    name: 'Postes de transformation électriques',
    slug: 'postes-transformation-jorf-lasfar',
    sectorSlug: 'energie-renouvelable',
    client: 'SPIE MAROC S.A',
    location: 'Jorf Lasfar',
    description:
      'Travaux de construction génie civil de deux bâtiments pour postes de transformation électriques à OCP Jorf Lasfar.',
    mainImageUrl: projectImage('postes-jorf'),
  },
  {
    name: 'Structure de 5 réservoirs 5 000 m³',
    slug: 'reservoirs-tantan-one',
    sectorSlug: 'industrie',
    client: 'EMMSA MAROC S.A — ONE Tantan',
    location: 'Tantan',
    description:
      'Fabrication et montage de la structure de cinq réservoirs de 5 000 m³ pour le compte de ONE Tantan.',
    mainImageUrl: projectImage('reservoirs-tantan'),
  },
  {
    name: 'Station de dépotage fioul par wagons',
    slug: 'depotage-fioul-kenitra',
    sectorSlug: 'industrie',
    client: 'EMMSA MAROC S.A',
    location: 'Kénitra',
    description:
      'Construction d’une station de dépotage de fioul par wagons à ONE TAG Kénitra.',
    mainImageUrl: projectImage('depotage-kenitra'),
  },
  {
    name: 'Station de dépotage produits blancs par bateaux',
    slug: 'depotage-tanger-med',
    sectorSlug: 'industrie',
    client: 'EMMSA MAROC S.A',
    location: 'Tanger Med',
    description:
      'Construction d’une station de dépotage des produits blancs par bateaux — Jetty 2 Bis (génie civil, charpente, tuyauterie) à HTTSA Tanger Med.',
    mainImageUrl: projectImage('depotage-tanger'),
  },
  {
    name: 'Pipeline DN 500 OLA Energy',
    slug: 'pipeline-ola-energy-jorf',
    sectorSlug: 'energie-renouvelable',
    client: 'HERJIMAR MAROC',
    location: 'Jorf Lasfar',
    description:
      'Fabrication et pose du pipeline DN 500 depuis la chambre à vannes ANP Jorf Lasfar vers la nouvelle terminal OLA Energy.',
    mainImageUrl: projectImage('pipeline-ola'),
  },
  {
    name: 'Projet hydraulique packages Downstream OCP',
    slug: 'hydraulique-packages-jorf-lasfar',
    sectorSlug: 'industrie',
    client: 'EMMSA MAROC S.A',
    location: 'Jorf Lasfar',
    description:
      'Construction du projet hydraulique packages Downstream OCP Jorf Lasfar : génie civil, charpente, structures, réservoirs et tuyauterie.',
    mainImageUrl: projectImage('hydraulique-jorf'),
  },
  {
    name: 'Serres de séchage des dattes — Green House 02',
    slug: 'serres-dattes-boudnib',
    sectorSlug: 'construction',
    client: 'MEDJOOL STAR — Saham Groupe',
    location: 'Boudnib, Errachidia',
    description:
      'Fourniture et pose de structures de serres de séchage des dattes sur 783 m² : panneaux sandwich, polycarbonate, portes thermiques.',
    mainImageUrl: projectImage('serres-boudnib'),
  },
  {
    name: 'Réaménagement amphithéâtre',
    slug: 'amphitheatre-had-soualem',
    sectorSlug: 'amenagement',
    client: 'HIKMA PROMOPHARM',
    location: 'Casablanca — Had Soualem',
    description:
      'Réaménagement de l’amphithéâtre : moquette, chaises, peinture, système de sonorisation, visualisation et faux plafonds.',
    mainImageUrl: projectImage('amphi-had-soualem'),
  },
  {
    name: 'Bâche à eau et step de décantation',
    slug: 'bache-eau-sidi-maarouf',
    sectorSlug: 'pharmaceutique',
    client: 'SANTE PHARMA INDUSTRIE SPI',
    location: 'Casablanca — Sidi Maarouf',
    description:
      'Construction d’une bâche à eau et d’une step de décantation pour une unité pharmaceutique.',
    mainImageUrl: projectImage('bache-pharma'),
  },
  {
    name: 'Unité industrielle R+4 — 1 000 m²',
    slug: 'unite-industrielle-mohammedia',
    sectorSlug: 'industrie',
    client: 'VALVTEC INC',
    location: 'Mohammedia',
    description:
      'Construction d’une unité industrielle R+4 d’une superficie de 1 000 m² en zone industrielle de Mohammedia.',
    mainImageUrl: projectImage('unite-mohammedia'),
  },
  {
    name: 'Protection cathodique pipeline OLA Energy',
    slug: 'protection-cathodique-ola',
    sectorSlug: 'energie-renouvelable',
    client: 'OLA ENERGY',
    location: 'Jorf Lasfar',
    description:
      'Travaux de protection cathodique du pipeline OLA Energy sur 3 200 ml.',
    mainImageUrl: projectImage('cathodique-ola'),
  },
  {
    name: 'Remise en état circuit anti-incendie',
    slug: 'anti-incendie-tantan-agadir',
    sectorSlug: 'industrie',
    client: 'ONEE',
    location: 'Tantan / Agadir',
    description:
      'Remise en état du circuit anti-incendie de la centrale diesel Tantan et TAG Agadir.',
    mainImageUrl: projectImage('anti-incendie'),
  },
  {
    name: 'OPC et consulting — Hamria Terminal',
    slug: 'hamria-terminal-uae',
    sectorSlug: 'industrie',
    client: 'MDISCOVER LLC',
    location: 'Émirats arabes unis',
    description:
      'OPC et consulting : remise à niveau des pipes et réservoirs au terminal Hamria (UAE).',
    mainImageUrl: projectImage('hamria-uae'),
  },
] as const;

async function main() {
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) {
    throw new Error(
      'SEED_ADMIN_PASSWORD est requis pour le seed (mot de passe admin non hardcodé).',
    );
  }

  console.log('Création des secteurs…');
  const sectorRecords = await Promise.all(
    sectors.map((sector) =>
      prisma.sector.upsert({
        where: { slug: sector.slug },
        update: {
          name: sector.name,
          description: sector.description,
          order: sector.order,
          imageUrl: sector.imageUrl,
        },
        create: sector,
      }),
    ),
  );

  const sectorBySlug = Object.fromEntries(
    sectorRecords.map((sector) => [sector.slug, sector]),
  );

  console.log('Création du compte administrateur…');
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email: 'admin@enoteb.local' },
    update: {
      passwordHash,
      name: 'Administrateur',
    },
    create: {
      email: 'admin@enoteb.local',
      passwordHash,
      name: 'Administrateur',
    },
  });

  console.log('Suppression des projets d’exemple…');
  await prisma.project.deleteMany({
    where: { slug: { in: [...PLACEHOLDER_SLUGS] } },
  });

  console.log('Création des réalisations ENOTEB…');
  for (const project of projects) {
    const sector = sectorBySlug[project.sectorSlug];
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        name: project.name,
        sectorId: sector.id,
        client: project.client,
        location: project.location,
        amount: null,
        showAmount: false,
        year: null,
        description: project.description,
        mainImageUrl: project.mainImageUrl,
        isPublished: true,
      },
      create: {
        name: project.name,
        slug: project.slug,
        sectorId: sector.id,
        client: project.client,
        location: project.location,
        amount: null,
        showAmount: false,
        year: null,
        description: project.description,
        mainImageUrl: project.mainImageUrl,
        isPublished: true,
      },
    });
  }

  console.log('Seed terminé avec succès.');
}

main()
  .catch((error) => {
    console.error('Erreur lors du seed :', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
