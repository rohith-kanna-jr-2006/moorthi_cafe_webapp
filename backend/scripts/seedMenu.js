const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const env = require('../src/config/env');
const Food = require('../src/models/Food');
const Category = require('../src/models/Category');
const Order = require('../src/models/Order');

const SEED_LEGACY_NAMES = [
  'Golden Ghee Roast Masala Dosa',
  'Medu Vada (2 Pcs)',
  'Podi Thatte Idli (2 Pcs)',
  'South Indian Heritage Thali',
  'Kumbakonam Degree Filter Kaapi',
  'Elaneer Payasam',
  'Mysore Bonda (4 Pcs)',
];

async function seedMenu(options = {}) {
  const isDryRun = options.dryRun || process.argv.includes('--dry-run');
  const targetUri = options.targetUri || process.env.MONGODB_URI || env.mongodbUri;

  console.log('====================================================');
  console.log(`Hotel New Moorthi Cafe — Menu Migration ${isDryRun ? '[DRY-RUN MODE]' : '[LIVE EXECUTION]'}`);
  console.log(`Target URI: ${targetUri}`);
  console.log(`Environment: ${env.nodeEnv}`);
  console.log('====================================================\n');

  await mongoose.connect(targetUri);
  const dbName = mongoose.connection.name;
  console.log(`[Connected] Database: ${dbName}`);

  // Safety Assertion: refuse to run migration against production without explicit flag
  if (env.nodeEnv === 'production' && !process.env.ALLOW_PRODUCTION_MIGRATION) {
    throw new Error('[SECURITY GUARD] Production database migration blocked without explicit ALLOW_PRODUCTION_MIGRATION=true');
  }

  // Load audited import data
  const dataPath = path.resolve(__dirname, 'menuImportData.json');
  if (!fs.existsSync(dataPath)) {
    throw new Error(`menuImportData.json not found at: ${dataPath}`);
  }
  const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`[Dataset] Loaded ${dataset.items.length} items from ${dataPath}`);

  const report = {
    mode: isDryRun ? 'DRY-RUN' : 'LIVE',
    database: dbName,
    categories: {
      inserted: 0,
      updated: 0,
      legacyDeactivated: 0,
      totalActive: 0,
      totalPreserved: 0,
    },
    legacyFoods: {
      archivedReferenced: 0,
      archivedUnreferenced: 0,
      totalAudited: 0,
    },
    menuItems: {
      toInsert: 0,
      toUpdate: 0,
      alreadyExisting: 0,
      published: 0,
      draft: 0,
      verifiedPhotographs: 0,
      authenticIllustrations: 0,
      proprietaryReferenceAssets: 0,
      totalVerifiedAssetsOnDisk: 0,
    },
  };

  // 1. Process Categories
  const categoryMap = {};
  const sectionCategories = [
    { slug: 'chicken-dishes', nameTamil: 'சிக்கன் வகைகள்', nameEnglish: 'Chicken Dishes', sourceSectionNumber: 1, displayOrder: 1 },
    { slug: 'biryani-rice', nameTamil: 'பிரியாணி / அரிசி வகைகள்', nameEnglish: 'Biryani & Rice', sourceSectionNumber: 2, displayOrder: 2 },
    { slug: 'parotta-items', nameTamil: 'பரோட்டா வகைகள்', nameEnglish: 'Parotta & Breads', sourceSectionNumber: 3, displayOrder: 3 },
    { slug: 'nmc-specials', nameTamil: 'NMC ஸ்பெஷல்', nameEnglish: 'NMC Special Items', sourceSectionNumber: 4, displayOrder: 4 },
    { slug: 'grill-items', nameTamil: 'கிரில் வகைகள்', nameEnglish: 'Grill Items', sourceSectionNumber: 5, displayOrder: 5 },
    { slug: 'tandoori-seafood', nameTamil: 'தந்தூரி', nameEnglish: 'Tandoori & Seafood', sourceSectionNumber: 6, displayOrder: 6 },
    { slug: 'gravies-curries', nameTamil: 'வெஜ் / கிரேவி வகைகள்', nameEnglish: 'Veg & Non-Veg Gravies', sourceSectionNumber: 7, displayOrder: 7 },
    { slug: 'mutton-egg', nameTamil: 'மட்டன் வகைகள்', nameEnglish: 'Mutton & Egg Dishes', sourceSectionNumber: 8, displayOrder: 8 },
    { slug: 'dosa-items', nameTamil: 'தோசை வகைகள்', nameEnglish: 'Dosa Items', sourceSectionNumber: 9, displayOrder: 9 },
    { slug: 'salna-sides', nameTamil: 'சால்னா / சைட்ஸ்', nameEnglish: 'Salna, Sides & Extras', sourceSectionNumber: 10, displayOrder: 10 },
    { slug: 'rice-noodles-mains', nameTamil: 'Page 2 Mains & Varieties', nameEnglish: 'Rice, Noodles & Sides', sourceSectionNumber: 11, displayOrder: 11 },
  ];

  for (const cat of sectionCategories) {
    let existing = await Category.findOne({ slug: cat.slug });
    if (existing) {
      report.categories.updated++;
      if (!isDryRun) {
        existing.name = cat.nameEnglish;
        existing.nameTamil = cat.nameTamil;
        existing.nameEnglish = cat.nameEnglish;
        existing.sourceSectionNumber = cat.sourceSectionNumber;
        existing.displayOrder = cat.displayOrder;
        existing.isActive = true;
        await existing.save();
      }
      categoryMap[cat.slug] = existing._id;
    } else {
      report.categories.inserted++;
      if (!isDryRun) {
        const created = await Category.create({
          name: cat.nameEnglish,
          slug: cat.slug,
          nameTamil: cat.nameTamil,
          nameEnglish: cat.nameEnglish,
          sourceSectionNumber: cat.sourceSectionNumber,
          displayOrder: cat.displayOrder,
          isActive: true,
        });
        categoryMap[cat.slug] = created._id;
      }
    }
  }

  // Handle Legacy Categories Deactivation
  const activeSectionSlugs = sectionCategories.map(c => c.slug);
  const legacyCategories = await Category.find({ slug: { $nin: activeSectionSlugs } });
  for (const legCat of legacyCategories) {
    if (legCat.isActive) {
      report.categories.legacyDeactivated++;
      if (!isDryRun) {
        legCat.isActive = false;
        await legCat.save();
      }
    }
  }
  const totalCatCount = await Category.countDocuments();
  report.categories.totalActive = sectionCategories.length;
  report.categories.totalPreserved = totalCatCount + (isDryRun ? report.categories.inserted : 0);

  // 2. Audit & Safely Archive Legacy Defaults and Test Artifacts
  const existingFoods = await Food.find({});
  for (const f of existingFoods) {
    // If it has a sourceMenuRowKey, it is already an imported item
    if (f.sourceMenuRowKey) continue;

    report.legacyFoods.totalAudited++;
    const isLegacySeed = SEED_LEGACY_NAMES.includes(f.name);
    const orderCount = await Order.countDocuments({ 'items.food': f._id });

    if (orderCount > 0) {
      report.legacyFoods.archivedReferenced++;
      if (!isDryRun) {
        f.isLegacyDefault = true;
        f.isArchived = true;
        f.isAvailable = false;
        f.isPublished = false;
        await f.save();
      }
    } else {
      report.legacyFoods.archivedUnreferenced++;
      if (!isDryRun) {
        f.isLegacyDefault = isLegacySeed;
        f.isArchived = true;
        f.isAvailable = false;
        f.isPublished = false;
        await f.save();
      }
    }
  }

  // 3. Process 96 Menu Rows Idempotently
  for (const row of dataset.items) {
    const existingRow = await Food.findOne({ sourceMenuRowKey: row.sourceMenuRowKey });
    const catId = categoryMap[row.categorySlug];

    if (row.isPublished) report.menuItems.published++;
    else report.menuItems.draft++;

    if (row.onDisk) report.menuItems.totalVerifiedAssetsOnDisk++;

    if (row.imageStatus === 'VERIFIED_PHOTOGRAPH') {
      report.menuItems.verifiedPhotographs++;
    } else if (row.imageStatus === 'AUTHENTIC_ILLUSTRATIVE_ARTWORK') {
      report.menuItems.authenticIllustrations++;
    } else if (row.imageStatus === 'PROPRIETARY_REFERENCE_ILLUSTRATION') {
      report.menuItems.proprietaryReferenceAssets++;
    }

    if (existingRow) {
      report.menuItems.toUpdate++;
      if (!isDryRun) {
        existingRow.name = row.nameEnglish || row.name;
        existingRow.nameTamil = row.nameTamil;
        existingRow.nameEnglish = row.nameEnglish;
        existingRow.price = row.price;
        existingRow.pricePaise = row.pricePaise;
        existingRow.variants = row.variants;
        if (catId) existingRow.category = catId;
        existingRow.imageUrl = row.imageUrl;
        existingRow.imageAlt = row.imageAlt;
        existingRow.imageSource = row.imageSource;
        existingRow.imageLicense = row.imageLicense;
        existingRow.imageStatus = row.imageStatus;
        existingRow.isAvailable = row.isAvailable;
        existingRow.isPublished = row.isPublished;
        existingRow.needsVerification = row.needsVerification;
        existingRow.verificationNotes = row.verificationNotes;
        existingRow.isVeg = row.isVeg;
        existingRow.portion = row.portion;
        existingRow.prepTimeMinutes = row.prepTimeMinutes;
        existingRow.tags = row.tags;
        await existingRow.save();
      }
    } else {
      report.menuItems.toInsert++;
      if (!isDryRun) {
        await Food.create({
          sourceMenuRowKey: row.sourceMenuRowKey,
          slug: row.slug,
          name: row.nameEnglish || row.name,
          nameTamil: row.nameTamil,
          nameEnglish: row.nameEnglish,
          price: row.price,
          pricePaise: row.pricePaise,
          variants: row.variants,
          category: catId,
          imageUrl: row.imageUrl,
          imageAlt: row.imageAlt,
          imageSource: row.imageSource,
          imageLicense: row.imageLicense,
          imageStatus: row.imageStatus,
          isAvailable: row.isAvailable,
          isPublished: row.isPublished,
          needsVerification: row.needsVerification,
          verificationNotes: row.verificationNotes,
          isVeg: row.isVeg,
          portion: row.portion,
          prepTimeMinutes: row.prepTimeMinutes,
          tags: row.tags,
        });
      }
    }
  }

  console.log('\n--- MIGRATION EXECUTION REPORT ---');
  console.log(JSON.stringify(report, null, 2));

  await mongoose.disconnect();
  return report;
}

if (require.main === module) {
  seedMenu().catch(err => {
    console.error('[SeedMenu Error]', err);
    process.exit(1);
  });
}

module.exports = seedMenu;
