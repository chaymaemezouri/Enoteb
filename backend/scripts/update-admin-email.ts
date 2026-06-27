import 'dotenv/config';
import { ADMIN_EMAIL, LEGACY_ADMIN_EMAIL } from '../src/common/constants/admin.constants';
import { createPrismaClient } from '../prisma/client';

async function main(): Promise<void> {
  const prisma = createPrismaClient();

  try {
    const admin =
      (await prisma.adminUser.findUnique({ where: { email: LEGACY_ADMIN_EMAIL } })) ??
      (await prisma.adminUser.findFirst({ orderBy: { createdAt: 'asc' } }));

    if (!admin) {
      console.error('Aucun compte administrateur trouvé en base.');
      process.exit(1);
    }

    if (admin.email === ADMIN_EMAIL) {
      console.log(`L'email admin est déjà défini sur ${ADMIN_EMAIL} (id: ${admin.id}).`);
      return;
    }

    const updated = await prisma.adminUser.update({
      where: { id: admin.id },
      data: { email: ADMIN_EMAIL },
    });

    console.log(`Email admin mis à jour : ${admin.email} → ${updated.email} (id: ${updated.id})`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error('Échec de la mise à jour de l’email admin :', error);
  process.exit(1);
});
