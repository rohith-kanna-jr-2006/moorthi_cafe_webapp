require('./setupTestEnv');
const app = require('../src/app');
const { connectDB, mongoose } = require('../src/config/db');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Food = require('../src/models/Food');
const { generateToken } = require('../src/controllers/authController');

let serverInstance;
let baseUrl;

async function seedTestFixtures() {
  // Ensure default Admin exists in test DB
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
  }

  // Ensure default Customer exists in test DB
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
  }

  // Ensure baseline category exists in test DB
  let testCat = await Category.findOne({ slug: 'morning-tiffin' });
  if (!testCat) {
    testCat = await Category.create({
      name: 'Morning Tiffin',
      slug: 'morning-tiffin',
      description: 'Breakfast specialties',
      displayOrder: 1,
      isActive: true,
    });
  }

  // Ensure test foods required by order calculation tests exist in test DB
  let dosa = await Food.findOne({ name: 'Golden Ghee Roast Masala Dosa' });
  if (!dosa) {
    await Food.create({
      name: 'Golden Ghee Roast Masala Dosa',
      price: 160.0,
      pricePaise: 16000,
      category: testCat._id,
      isAvailable: true,
      isPublished: true,
      isVeg: true,
      portion: '1 Plate',
      prepTimeMinutes: 12,
    });
  }

  let vada = await Food.findOne({ name: 'Medu Vada (2 Pcs)' });
  if (!vada) {
    await Food.create({
      name: 'Medu Vada (2 Pcs)',
      price: 80.0,
      pricePaise: 8000,
      category: testCat._id,
      isAvailable: true,
      isPublished: true,
      isVeg: true,
      portion: '2 Pieces',
      prepTimeMinutes: 5,
    });
  }
}

async function setupTestServer() {
  await connectDB();

  // Safety Assertion: refuse to run tests if connected to dev or prod database!
  const dbName = mongoose.connection.name;
  if (!dbName.includes('test')) {
    throw new Error(`[CRITICAL SAFETY GUARD] Automated tests must strictly connect to an isolated test database! Aborting because connected to: ${dbName}`);
  }

  await seedTestFixtures();

  return new Promise((resolve) => {
    serverInstance = app.listen(0, () => {
      const port = serverInstance.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve({ server: serverInstance, baseUrl });
    });
  });
}

async function teardownTestServer() {
  if (serverInstance) {
    await new Promise((resolve) => serverInstance.close(resolve));
  }
  await mongoose.connection.close(false);
}

function getBaseUrl() {
  return baseUrl;
}

async function apiRequest(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await response.json();
  return { status: response.status, body: json };
}

module.exports = {
  setupTestServer,
  teardownTestServer,
  getBaseUrl,
  apiRequest,
};
