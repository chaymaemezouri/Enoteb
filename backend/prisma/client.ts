import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

export function createPrismaClient(databaseUrl?: string): PrismaClient {
  const url = databaseUrl ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL est requis pour initialiser Prisma.');
  }

  const adapter = new PrismaMariaDb(url);
  return new PrismaClient({ adapter });
}
