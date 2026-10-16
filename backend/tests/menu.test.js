const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { setupTestServer, teardownTestServer, apiRequest } = require('./testHelper');
const Category = require('../src/models/Category');
const Food = require('../src/models/Food');

let adminToken;
let customerToken;
let testCategoryId;
let testFoodId;

before(async () => {
  await setupTestServer();

  // Login as seeded admin
  const adminRes = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: {
      email: 'admin@moorthicafe.com',
      password: 'AdminSecretPass123!',
    },
  });
  adminToken = adminRes.body.data.token;

  // Login as seeded customer
  const customerRes = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: {
      email: 'customer@moorthicafe.com',
      password: 'CustomerPass123!',
    },
  });
  customerToken = customerRes.body.data.token;
});

after(async () => {
  await teardownTestServer();
});

test('1. Public can list active categories', async () => {
  const res = await apiRequest('/api/v1/categories');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.categories.length > 0);
  testCategoryId = res.body.data.categories[0]._id;
});

test('2. Public can list available foods with category & search filters', async () => {
  const res = await apiRequest('/api/v1/foods?search=Dosa');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.foods.length > 0);
  assert.ok(res.body.data.foods[0].name.includes('Dosa'));
  testFoodId = res.body.data.foods[0]._id;
});

test('3. Admin can create a new food item', async () => {
  const res = await apiRequest('/api/v1/foods', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: 'Ghee Podi Mini Idli (14 Pcs)',
      description: 'Button mini idlis bathed in spiced gunpowder and piping hot pure ghee',
      price: 130.0,
      category: testCategoryId,
      isVeg: true,
      portion: '14 Mini Idlis',
      prepTimeMinutes: 7,
      tags: ['mini-idli', 'ghee-special'],
    },
  });

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.food.name, 'Ghee Podi Mini Idli (14 Pcs)');
});

test('4. Customer cannot create a food item (403 Forbidden)', async () => {
  const res = await apiRequest('/api/v1/foods', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      name: 'Unauthorized Dish',
      price: 50.0,
      category: testCategoryId,
    },
  });

  assert.equal(res.status, 403);
  assert.equal(res.body.success, false);
});

test('5. Creating food with invalid category ID returns 404', async () => {
  const fakeId = '507f1f77bcf86cd799439011';
  const res = await apiRequest('/api/v1/foods', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: 'Nonexistent Category Dish',
      price: 100.0,
      category: fakeId,
    },
  });

  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
});

test('6. Admin can update food availability status', async () => {
  const res = await apiRequest(`/api/v1/foods/${testFoodId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { isAvailable: false },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.data.food.isAvailable, false);

  // Re-enable availability
  await apiRequest(`/api/v1/foods/${testFoodId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { isAvailable: true },
  });
});
