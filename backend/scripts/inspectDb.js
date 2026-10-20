const mongoose = require('mongoose');
const env = require('../src/config/env');
const Food = require('../src/models/Food');
const Category = require('../src/models/Category');
const User = require('../src/models/User');
const Order = require('../src/models/Order');
const DailyCounter = require('../src/models/DailyCounter');

async function inspect() {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('MongoDB Connected to:', env.mongodbUri);

    const foodCount = await Food.countDocuments();
    const catCount = await Category.countDocuments();
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const counterCount = await DailyCounter.countDocuments();

    console.log('COUNTS:', JSON.stringify({ foodCount, catCount, userCount, orderCount, counterCount }, null, 2));

    const allFoods = await Food.find({}).populate('category', 'name slug');
    console.log('--- ALL FOOD ITEMS (' + allFoods.length + ') ---');
    for (const f of allFoods) {
      const referencedCount = await Order.countDocuments({ 'items.food': f._id });
      console.log(`[${f._id}] "${f.name}" - ₹${f.price} | Category: ${f.category ? f.category.name : 'NONE'} (${f.category ? f.category.slug : 'NONE'}) | isAvailable: ${f.isAvailable} | Referenced in Orders: ${referencedCount}`);
    }

    const allCats = await Category.find({});
    console.log('--- ALL CATEGORIES (' + allCats.length + ') ---');
    allCats.forEach((c, idx) => {
      console.log(`${idx + 1}. [${c._id}] "${c.name}" (slug: ${c.slug}, active: ${c.isActive})`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Inspection error:', error);
    process.exit(1);
  }
}

inspect();
