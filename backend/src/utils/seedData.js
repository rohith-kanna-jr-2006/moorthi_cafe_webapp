const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User');
const Category = require('../models/Category');
const Food = require('../models/Food');
const Order = require('../models/Order');
const DailyCounter = require('../models/DailyCounter');

async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(env.mongodbUri);
    console.log('[Seed] Connected successfully.');

    // 1. Create or ensure Default Admin and Customer accounts
    const adminEmail = 'admin@moorthicafe.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const passwordHash = await User.hashPassword('AdminSecretPass123!');
      admin = await User.create({
        name: 'Moorthi Cafe Admin',
        email: adminEmail,
        phone: '+91 98765 00001',
        passwordHash,
        role: 'admin',
        isActive: true,
      });
      console.log('[Seed] Created default Admin: admin@moorthicafe.com / AdminSecretPass123!');
    }

    const customerEmail = 'customer@moorthicafe.com';
    let customer = await User.findOne({ email: customerEmail });
    if (!customer) {
      const passwordHash = await User.hashPassword('CustomerPass123!');
      customer = await User.create({
        name: 'Venkatesh Iyer',
        email: customerEmail,
        phone: '+91 98765 43210',
        passwordHash,
        role: 'customer',
        isActive: true,
      });
      console.log('[Seed] Created default Customer: customer@moorthicafe.com / CustomerPass123!');
    }

    // 2. Categories
    const categoriesData = [
      {
        name: 'Morning Tiffin',
        slug: 'morning-tiffin',
        description: 'Slow-fermented overnight rice-urad dal batters, stoneground chutneys & hot drumstick sambar',
        displayOrder: 1,
      },
      {
        name: 'Lunch Thalis & Meals',
        slug: 'lunch-thalis',
        description: 'Traditional leaf service thalis with kootu, poriyal, rasam, and payasam',
        displayOrder: 2,
      },
      {
        name: 'Evening Tiffin & Snacks',
        slug: 'evening-snacks',
        description: 'Crispy bhajis, bondas, medu vadas, and warm tea-time savouries',
        displayOrder: 3,
      },
      {
        name: 'Traditional Sweets',
        slug: 'traditional-sweets',
        description: 'Pure ghee Mysore Pak, Elaneer Payasam, and ceremonial sweets',
        displayOrder: 4,
      },
      {
        name: 'Degree Kaapi & Drinks',
        slug: 'beverages-kaapi',
        description: 'Authentic Kumbakonam brass davarah filter coffee and herbal coolers',
        displayOrder: 5,
      },
      {
        name: 'Podis & Pickles',
        slug: 'podis-pickles',
        description: 'Hand-pounded Gunpowder Idli Podi and heritage spiced condiments',
        displayOrder: 6,
      },
    ];

    const categoryMap = {};
    for (const cat of categoriesData) {
      let existingCat = await Category.findOne({ slug: cat.slug });
      if (!existingCat) {
        existingCat = await Category.create(cat);
        console.log(`[Seed] Created category: ${cat.name}`);
      }
      categoryMap[cat.slug] = existingCat._id;
    }

    // 3. Obsolete Demo Menu Seeding is permanently neutralized
    // Runtime source of truth is now managed via scripts/seedMenu.js
    console.log('[Seed] User authentication baseline ensured.');
    console.log('[Seed] Obsolete demo food creation neutralized. Official menu is managed via scripts/seedMenu.js');
    console.log('[Seed] Initialization completed successfully!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error(`[Seed Error] Seeding failed: ${error.message}`);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
