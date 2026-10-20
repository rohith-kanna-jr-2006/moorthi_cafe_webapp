const mongoose = require('mongoose');
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

async function inspectAllFoods() {
  await mongoose.connect(env.mongodbUri);
  const foods = await Food.find({}).populate('category', 'name slug');
  console.log(`Inspecting ${foods.length} Food records individually:\n`);

  const report = [];

  for (const food of foods) {
    const orderCount = await Order.countDocuments({ 'items.food': food._id });
    const isLegacySeed = SEED_LEGACY_NAMES.includes(food.name);
    const isTestArtifact = food.name.startsWith('Ghee Podi Mini Idli') || food.name === 'Unauthorized Dish' || food.name === 'Nonexistent Category Dish';

    let classification = 'UNKNOWN_CUSTOM';
    if (isLegacySeed) classification = 'LEGACY_SEED_DEFAULT';
    else if (isTestArtifact) classification = 'TEST_ARTIFACT';

    let proposedAction = 'PRESERVE';
    if (orderCount > 0) {
      proposedAction = 'ARCHIVE_AND_DEACTIVATE (Has order references; DO NOT DELETE)';
    } else if (isTestArtifact) {
      proposedAction = 'SAFE_CLEANUP_OR_DEACTIVATE (0 order references)';
    } else if (isLegacySeed) {
      proposedAction = 'SAFE_DEACTIVATE_OR_REMOVE (0 order references)';
    }

    report.push({
      id: food._id.toString(),
      name: food.name,
      price: food.price,
      category: food.category ? `${food.category.name} (${food.category.slug})` : 'NONE',
      classification,
      orderReferences: orderCount,
      isAvailable: food.isAvailable,
      proposedAction,
    });
  }

  console.log(JSON.stringify(report, null, 2));

  const summary = {
    totalFoods: foods.length,
    legacySeedCount: report.filter(r => r.classification === 'LEGACY_SEED_DEFAULT').length,
    testArtifactCount: report.filter(r => r.classification === 'TEST_ARTIFACT').length,
    customCount: report.filter(r => r.classification === 'UNKNOWN_CUSTOM').length,
    referencedInOrders: report.filter(r => r.orderReferences > 0).length,
    unreferenced: report.filter(r => r.orderReferences === 0).length,
  };

  console.log('\n--- SUMMARY ---');
  console.log(JSON.stringify(summary, null, 2));

  await mongoose.disconnect();
}

inspectAllFoods().catch(err => {
  console.error(err);
  process.exit(1);
});
