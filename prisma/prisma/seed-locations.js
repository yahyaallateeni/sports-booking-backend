const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function upsertCityWithAreas(city) {
  const createdCity = await prisma.city.upsert({
    where: { slug: city.slug },
    update: { nameAr: city.nameAr },
    create: {
      nameAr: city.nameAr,
      slug: city.slug,
    },
  });

  for (const area of city.areas) {
    await prisma.area.upsert({
      where: {
        cityId_slug: {
          cityId: createdCity.id,
          slug: area.slug,
        },
      },
      update: {
        nameAr: area.nameAr,
      },
      create: {
        cityId: createdCity.id,
        nameAr: area.nameAr,
        slug: area.slug,
      },
    });
  }

  return createdCity;
}

async function main() {
  const cities = [
    {
      nameAr: 'الرياض',
      slug: 'riyadh',
      areas: [
        { nameAr: 'الملز', slug: 'al-malaz' },
        { nameAr: 'النرجس', slug: 'al-narjis' },
        { nameAr: 'الياسمين', slug: 'al-yasmin' },
        { nameAr: 'العارض', slug: 'al-arid' },
      ],
    },
    {
      nameAr: 'جدة',
      slug: 'jeddah',
      areas: [
        { nameAr: 'الصفا', slug: 'al-safa' },
        { nameAr: 'الروضة', slug: 'al-rawdah' },
        { nameAr: 'أبحر', slug: 'obhur' },
        { nameAr: 'الحمراء', slug: 'al-hamra' },
      ],
    },
    {
      nameAr: 'الدمام',
      slug: 'dammam',
      areas: [
        { nameAr: 'الشاطئ', slug: 'al-shatea' },
        { nameAr: 'النور', slug: 'al-noor' },
        { nameAr: 'الفيصلية', slug: 'al-faisaliyah' },
        { nameAr: 'الندى', slug: 'al-nada' },
      ],
    },
  ];

  for (const city of cities) {
    await upsertCityWithAreas(city);
  }

  const cityCount = await prisma.city.count();
  const areaCount = await prisma.area.count();

  console.log(`Cities seeded: ${cityCount}`);
  console.log(`Areas seeded: ${areaCount}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
