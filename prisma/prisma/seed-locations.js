const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function ensureOtherCity() {
  return prisma.city.upsert({
    where: { slug: 'other' },
    update: { nameAr: 'أخرى' },
    create: {
      nameAr: 'أخرى',
      slug: 'other',
    },
  });
}

async function ensureOtherAreaForCity(cityId) {
  return prisma.area.upsert({
    where: {
      cityId_slug: {
        cityId,
        slug: 'other',
      },
    },
    update: { nameAr: 'أخرى' },
    create: {
      cityId,
      nameAr: 'أخرى',
      slug: 'other',
    },
  });
}

async function main() {
  const cities = await prisma.city.findMany({
    select: { id: true, nameAr: true, slug: true },
  });

  const otherCity = await ensureOtherCity();

  let processed = 0;

  for (const city of cities) {
    await ensureOtherAreaForCity(city.id);
    processed += 1;
  }

  await ensureOtherAreaForCity(otherCity.id);

  const otherAreasCount = await prisma.area.count({
    where: { slug: 'other' },
  });

  console.log(`Processed cities: ${processed}`);
  console.log(`Other city id: ${otherCity.id}`);
  console.log(`Other areas count: ${otherAreasCount}`);
}

main()
  .catch((error) => {
    console.error('Seed other location failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
