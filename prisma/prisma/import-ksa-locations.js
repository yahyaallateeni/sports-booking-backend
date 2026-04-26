const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const REPO_URL = 'https://github.com/homaily/Saudi-Arabia-Regions-Cities-and-Districts.git';
const WORK_DIR = path.join(os.tmpdir(), 'ksa-locations-import');

function safeRemoveDir(targetPath) {
  try {
    fs.rmSync(targetPath, { recursive: true, force: true });
  } catch (_) {}
}

function ensureRepo() {
  safeRemoveDir(WORK_DIR);
  execSync(`git clone --depth 1 ${REPO_URL} "${WORK_DIR}"`, {
    stdio: 'inherit',
  });
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readDataset() {
  const candidateCityFiles = [
    path.join(WORK_DIR, 'json', 'cities.json'),
    path.join(WORK_DIR, 'cities.json'),
  ];

  const candidateDistrictFiles = [
    path.join(WORK_DIR, 'json', 'districts.json'),
    path.join(WORK_DIR, 'geojson', 'districts.geojson'),
    path.join(WORK_DIR, 'districts.json'),
    path.join(WORK_DIR, 'districts.geojson'),
  ];

  const cityFile = candidateCityFiles.find((p) => fs.existsSync(p));
  const districtFile = candidateDistrictFiles.find((p) => fs.existsSync(p));

  if (!cityFile) {
    throw new Error('لم يتم العثور على ملف cities.json داخل الـ dataset.');
  }

  if (!districtFile) {
    throw new Error('لم يتم العثور على ملف districts داخل الـ dataset.');
  }

  const citiesRaw = readJsonFile(cityFile);
  const districtsRaw = readJsonFile(districtFile);

  return {
    citiesRaw,
    districtsRaw,
    cityFile,
    districtFile,
  };
}

function slugifyArabic(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\u0621-\u064A\w-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getFirst(obj, keys) {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }
  return '';
}

function normalizeCities(citiesRaw) {
  const items = Array.isArray(citiesRaw)
    ? citiesRaw
    : Array.isArray(citiesRaw?.data)
      ? citiesRaw.data
      : [];

  return items
    .map((city) => {
      const nameAr = getFirst(city, [
        'nameAr',
        'name_ar',
        'city_name_ar',
        'city_ar',
        'ar',
        'name',
      ]);

      const slugSource = getFirst(city, [
        'slug',
        'city_slug',
        'nameEn',
        'name_en',
        'en',
        'name',
      ]);

      const slug = slugifyArabic(slugSource || nameAr);

      if (!nameAr || !slug) return null;

      return {
        nameAr: String(nameAr).trim(),
        slug,
        raw: city,
      };
    })
    .filter(Boolean);
}

function normalizeDistrictRows(districtsRaw) {
  if (Array.isArray(districtsRaw)) return districtsRaw;

  if (Array.isArray(districtsRaw?.data)) return districtsRaw.data;

  if (districtsRaw?.type === 'FeatureCollection' && Array.isArray(districtsRaw.features)) {
    return districtsRaw.features.map((feature) => ({
      ...(feature.properties || {}),
    }));
  }

  return [];
}

function buildCityIndexes(cities) {
  const bySlug = new Map();
  const byNameAr = new Map();

  for (const city of cities) {
    bySlug.set(city.slug, city);
    byNameAr.set(city.nameAr, city);
  }

  return { bySlug, byNameAr };
}

function normalizeDistricts(districtsRaw, cityIndexes) {
  const rows = normalizeDistrictRows(districtsRaw);

  return rows
    .map((row) => {
      const nameAr = getFirst(row, [
        'nameAr',
        'name_ar',
        'district_name_ar',
        'district_ar',
        'ar',
        'name',
      ]);

      const districtSlugSource = getFirst(row, [
        'slug',
        'district_slug',
        'nameEn',
        'name_en',
        'en',
        'name',
      ]);

      const districtSlug = slugifyArabic(districtSlugSource || nameAr);

      const citySlugCandidate = slugifyArabic(getFirst(row, [
        'citySlug',
        'city_slug',
        'cityNameEn',
        'city_name_en',
        'city_en',
      ]));

      const cityNameArCandidate = getFirst(row, [
        'cityNameAr',
        'city_name_ar',
        'city_ar',
      ]);

      let matchedCity = null;

      if (citySlugCandidate && cityIndexes.bySlug.has(citySlugCandidate)) {
        matchedCity = cityIndexes.bySlug.get(citySlugCandidate);
      } else if (cityNameArCandidate && cityIndexes.byNameAr.has(cityNameArCandidate)) {
        matchedCity = cityIndexes.byNameAr.get(cityNameArCandidate);
      }

      if (!nameAr || !districtSlug || !matchedCity) return null;

      return {
        citySlug: matchedCity.slug,
        nameAr: String(nameAr).trim(),
        slug: districtSlug,
      };
    })
    .filter(Boolean);
}

async function upsertCities(cities) {
  const createdMap = new Map();

  for (const city of cities) {
    const saved = await prisma.city.upsert({
      where: { slug: city.slug },
      update: {
        nameAr: city.nameAr,
      },
      create: {
        nameAr: city.nameAr,
        slug: city.slug,
      },
    });

    createdMap.set(city.slug, saved);
  }

  return createdMap;
}

async function upsertAreas(districts, createdCityMap) {
  let inserted = 0;

  for (const district of districts) {
    const city = createdCityMap.get(district.citySlug);
    if (!city) continue;

    await prisma.area.upsert({
      where: {
        cityId_slug: {
          cityId: city.id,
          slug: district.slug,
        },
      },
      update: {
        nameAr: district.nameAr,
      },
      create: {
        cityId: city.id,
        nameAr: district.nameAr,
        slug: district.slug,
      },
    });

    inserted += 1;
  }

  return inserted;
}

async function main() {
  console.log('Cloning source dataset...');
  ensureRepo();

  const { citiesRaw, districtsRaw, cityFile, districtFile } = readDataset();
  console.log(`Using cities file: ${cityFile}`);
  console.log(`Using districts file: ${districtFile}`);

  const cities = normalizeCities(citiesRaw);
  const cityIndexes = buildCityIndexes(cities);
  const districts = normalizeDistricts(districtsRaw, cityIndexes);

  console.log(`Normalized cities: ${cities.length}`);
  console.log(`Normalized districts: ${districts.length}`);

  const createdCityMap = await upsertCities(cities);
  const areaCountProcessed = await upsertAreas(districts, createdCityMap);

  const cityCount = await prisma.city.count();
  const areaCount = await prisma.area.count();

  console.log(`Cities in database: ${cityCount}`);
  console.log(`Areas in database: ${areaCount}`);
  console.log(`Areas processed in this run: ${areaCountProcessed}`);
}

main()
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    safeRemoveDir(WORK_DIR);
  });
