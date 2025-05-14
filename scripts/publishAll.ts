import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating therapists...');

  const result = await prisma.therapist.updateMany({
    data: {
      published: true,
      telehealth: true,
      inPerson: true,
      primaryZip: '90026',
      seoZip1: '90026',
      // Uncomment below if you want to tag them for later cleanup
      // testData: true,
    },
  });

  console.log(`✅ Successfully updated ${result.count} therapists.`);
}

main()
  .catch((error) => {
    console.error('❌ Failed to update therapists:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
