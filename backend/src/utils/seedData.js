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

    // 3. Signature Food Menu Items
    const foodItems = [
      {
        name: 'Golden Ghee Roast Masala Dosa',
        description: 'Crisp cone-rolled dosa cooked on seasoned cast iron with A2 cow ghee, stuffed with tempered spiced potato masala, served with 3 coconut chutneys and shallot sambar.',
        price: 160.0,
        category: categoryMap['morning-tiffin'],
        portion: '1 Plate (Single Cone)',
        prepTimeMinutes: 12,
        isVeg: true,
        isAvailable: true,
        tags: ['chef-special', 'wood-fired', 'pure-ghee'],
      },
      {
        name: 'Medu Vada (2 Pcs)',
        description: 'Crisp golden urad dal doughnuts studded with black peppercorns, fresh curry leaves and ginger. Served piping hot with coconut chutney.',
        price: 80.0,
        category: categoryMap['morning-tiffin'],
        portion: '2 Pieces',
        prepTimeMinutes: 5,
        isVeg: true,
        isAvailable: true,
        tags: ['chef-special'],
      },
      {
        name: 'Podi Thatte Idli (2 Pcs)',
        description: 'Plump steaming mallipoo rice cakes smeared lavishly in hand-pounded Gunpowder podi and hot melted golden cow butter.',
        price: 110.0,
        category: categoryMap['morning-tiffin'],
        portion: '2 Giant Idlis',
        prepTimeMinutes: 8,
        isVeg: true,
        isAvailable: true,
        tags: ['pure-ghee', 'stoneground'],
      },
      {
        name: 'South Indian Heritage Thali',
        description: 'Full feast on plantain leaf: Steamed Sona Masoori rice, Drumstick sambar, Tomato rasam, Vazhakkai poriyal, Keerai kootu, Appalam, Curd and Payasam.',
        price: 220.0,
        category: categoryMap['lunch-thalis'],
        portion: 'Full Lunch Thali',
        prepTimeMinutes: 15,
        isVeg: true,
        isAvailable: true,
        tags: ['chef-special', 'leaf-service'],
      },
      {
        name: 'Kumbakonam Degree Filter Kaapi',
        description: 'First decoction pull frothed with boiled full-cream farm milk and organic sugar. Served in traditional brass davarah tumbler.',
        price: 45.0,
        category: categoryMap['beverages-kaapi'],
        portion: '1 Davarah Tumbler (150ml)',
        prepTimeMinutes: 5,
        isVeg: true,
        isAvailable: true,
        tags: ['degree-blend', 'beverage'],
      },
      {
        name: 'Elaneer Payasam',
        description: 'Tender coconut pulp simmered gently with reduced cardamom milk, crushed cashews and saffron.',
        price: 95.0,
        category: categoryMap['traditional-sweets'],
        portion: '1 Bowl (180ml)',
        prepTimeMinutes: 5,
        isVeg: true,
        isAvailable: true,
        tags: ['chef-special', 'sweet'],
      },
      {
        name: 'Mysore Bonda (4 Pcs)',
        description: 'Deep-fried golden flour dumplings crisp outside and fluffy soft inside with ginger and green chillies.',
        price: 70.0,
        category: categoryMap['evening-snacks'],
        portion: '4 Pieces',
        prepTimeMinutes: 8,
        isVeg: true,
        isAvailable: true,
        tags: ['evening-snack'],
      },
    ];

    for (const food of foodItems) {
      const existingFood = await Food.findOne({ name: food.name });
      if (!existingFood) {
        await Food.create(food);
        console.log(`[Seed] Created dish: ${food.name} (₹${food.price})`);
      }
    }

    console.log('[Seed] Seeding completed successfully!');
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
