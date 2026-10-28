import { PrismaClient } from '@prisma/client';
import { PROFILE_SEED } from '../src/seed/seed.data';

const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.profile.upsert({
    where: { id: 'main' },
    update: {},
    create: PROFILE_SEED,
  });
  console.log(`✅ Seed выполнен: ${profile.name}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
