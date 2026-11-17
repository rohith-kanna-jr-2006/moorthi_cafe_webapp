const mongoose = require('mongoose');
const env = require('../src/config/env');
const { validateStagingSeed } = require('../src/utils/seedGuard');
const { upsertMenuData, SEED_LEGACY_NAMES, SECTION_CATEGORIES } = require('../src/services/menuSeedService');

async function seedMenu(options = {}) {
  const isDryRun = options.dryRun || process.argv.includes('--dry-run');
  const targetUri = options.targetUri || process.env.MONGODB_URI || env.mongodbUri;

  console.log('====================================================');
  console.log(`Hotel New Moorthi Cafe — Menu Migration ${isDryRun ? '[DRY-RUN MODE]' : '[LIVE EXECUTION]'}`);
  console.log(`Target URI: ${targetUri}`);
  console.log(`Environment: ${env.nodeEnv}`);
  console.log('====================================================\n');

  // Staging seed safety guard - MUST run BEFORE any database connection
  const guardResult = validateStagingSeed(
    env.nodeEnv,
    targetUri,
    process.env.ALLOW_STAGING_SEED,
    process.env.ALLOW_PRODUCTION_MIGRATION
  );

  if (!guardResult.authorized) {
    const errorMsg = guardResult.errors.join('; ');
    throw new Error(`[Staging Seed Guard] ${errorMsg}`);
  }

  console.log('[Staging Seed Guard] ✅ All staging safety checks passed');

  await mongoose.connect(targetUri);
  const dbName = mongoose.connection.name;
  console.log(`[Connected] Database: ${dbName}`);

  const result = await upsertMenuData({ isDryRun, dbName });

  console.log('\n--- MIGRATION EXECUTION REPORT ---');
  console.log(JSON.stringify(result.report, null, 2));

  await mongoose.disconnect();
  return result.report;
}

if (require.main === module) {
  seedMenu().catch((err) => {
    console.error('[SeedMenu Error]', err);
    process.exit(1);
  });
}

module.exports = seedMenu;
