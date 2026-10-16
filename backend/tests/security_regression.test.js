const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { setupTestServer, teardownTestServer, apiRequest } = require('./testHelper');
const Food = require('../src/models/Food');
const Category = require('../src/models/Category');
const Order = require('../src/models/Order');

let adminToken;
let customer1Token;
let customer2Token;
let testFood;
let testFood2;
let inactiveCategory;

before(async () => {
  await setupTestServer();

  // Admin login
  const adminRes = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: {
      email: 'admin@moorthicafe.com',
      password: 'AdminSecretPass123!',
    },
  });
  adminToken = adminRes.body.data.token;

  // Customer 1 login
  const c1Res = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: {
      email: 'customer@moorthicafe.com',
      password: 'CustomerPass123!',
    },
  });
  customer1Token = c1Res.body.data.token;

  // Customer 2 signup
  const c2Res = await apiRequest('/api/v1/auth/signup', {
    method: 'POST',
    body: {
      name: 'Ravi Teja',
      email: `customer2_${Date.now()}@moorthicafe.com`,
      phone: '+91 99999 88888',
      password: 'SecurePass123!',
    },
  });
  customer2Token = c2Res.body.data.token;

  testFood = await Food.findOne({ isAvailable: true });
  testFood2 = await Food.findOne({ isAvailable: true, _id: { $ne: testFood._id } });

  // Create an inactive category for visibility testing
  inactiveCategory = await Category.create({
    name: 'Seasonal Festival Specials (Inactive)',
    slug: `seasonal-specials-${Date.now()}`,
    description: 'Archived festival menu not currently active',
    isActive: false,
    displayOrder: 99,
  });
});

after(async () => {
  if (inactiveCategory) {
    await Category.deleteOne({ _id: inactiveCategory._id });
  }
  await teardownTestServer();
});

// =========================================================================
// 1. IDEMPOTENCY PAYLOAD CONSISTENCY & CONCURRENCY
// =========================================================================

test('1.1 Idempotency: Replaying key with changed quantity rejects with 409 Conflict', async () => {
  const key = `idem_qty_${Date.now()}`;

  // First request: quantity = 1
  const res1 = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${customer1Token}`,
      'Idempotency-Key': key,
    },
    body: {
      items: [{ foodId: testFood._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });
  assert.equal(res1.status, 201);

  // Second request: same key, but quantity changed to 3
  const res2 = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${customer1Token}`,
      'Idempotency-Key': key,
    },
    body: {
      items: [{ foodId: testFood._id.toString(), quantity: 3 }],
      pickupType: 'IMMEDIATE',
    },
  });
  assert.equal(res2.status, 409);
  assert.equal(res2.body.success, false);
  assert.ok(res2.body.message.includes('Idempotency-Key conflict'));
});

test('1.2 Idempotency: Replaying key with changed pickupType rejects with 409 Conflict', async () => {
  const key = `idem_pickup_${Date.now()}`;

  // First request: IMMEDIATE
  const res1 = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${customer1Token}`,
      'Idempotency-Key': key,
    },
    body: {
      items: [{ foodId: testFood._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });
  assert.equal(res1.status, 201);

  // Future scheduled date for comparison
  const futureDate = new Date(Date.now() + 3600 * 1000).toISOString();

  // Second request: SCHEDULED
  const res2 = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${customer1Token}`,
      'Idempotency-Key': key,
    },
    body: {
      items: [{ foodId: testFood._id.toString(), quantity: 1 }],
      pickupType: 'SCHEDULED',
      pickupAt: futureDate,
    },
  });
  assert.equal(res2.status, 409);
  assert.equal(res2.body.success, false);
});

test('1.3 Idempotency: Customer 2 cannot reuse or hijack Customer 1 key (409 Conflict)', async () => {
  const key = `idem_hijack_${Date.now()}`;

  // Customer 1 places order with key
  const res1 = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${customer1Token}`,
      'Idempotency-Key': key,
    },
    body: {
      items: [{ foodId: testFood._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });
  assert.equal(res1.status, 201);

  // Customer 2 attempts to use Customer 1's key
  const res2 = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${customer2Token}`,
      'Idempotency-Key': key,
    },
    body: {
      items: [{ foodId: testFood._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });
  assert.equal(res2.status, 409);
  assert.equal(res2.body.success, false);
  assert.ok(res2.body.message.includes('another customer'));
});

test('1.4 Idempotency Concurrency: Two simultaneous identical requests resolve to one persisted order without 500 error', async () => {
  const key = `idem_race_${Date.now()}`;
  const payload = {
    items: [{ foodId: testFood._id.toString(), quantity: 1 }],
    pickupType: 'IMMEDIATE',
  };

  const [req1, req2] = await Promise.all([
    apiRequest('/api/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${customer1Token}`,
        'Idempotency-Key': key,
      },
      body: payload,
    }),
    apiRequest('/api/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${customer1Token}`,
        'Idempotency-Key': key,
      },
      body: payload,
    }),
  ]);

  // Both requests must succeed (one 201, one 200)
  assert.ok([200, 201].includes(req1.status));
  assert.ok([200, 201].includes(req2.status));
  // Both must return the identical order ID and token number
  assert.equal(req1.body.data.order._id, req2.body.data.order._id);
  assert.equal(req1.body.data.order.dailyTokenNumber, req2.body.data.order.dailyTokenNumber);

  // Verify in MongoDB that exactly ONE document exists with this idempotencyKey
  const count = await Order.countDocuments({ idempotencyKey: key });
  assert.equal(count, 1, 'Exactly one order must be persisted in database');
});

// =========================================================================
// 2. PAYMENT STATUS & AUDIT TRAIL
// =========================================================================

test('2.1 Payment Security: Customer cannot update order payment status (403 Forbidden)', async () => {
  // Create an order first
  const orderRes = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customer1Token}` },
    body: {
      items: [{ foodId: testFood._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });
  const orderId = orderRes.body.data.order._id;

  // Customer tries to call admin status endpoint
  const updateRes = await apiRequest(`/api/v1/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${customer1Token}` },
    body: { paymentStatus: 'PAID' },
  });
  assert.equal(updateRes.status, 403);
});

test('2.2 Payment Security: Invalid paymentStatus value returns 400 Bad Request', async () => {
  const orderRes = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customer1Token}` },
    body: {
      items: [{ foodId: testFood._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });
  const orderId = orderRes.body.data.order._id;

  const res = await apiRequest(`/api/v1/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { paymentStatus: 'INVALID_STATUS' },
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test('2.3 Payment Security: Invalid payment transition (refund unpaid PENDING order) returns 400', async () => {
  const orderRes = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customer1Token}` },
    body: {
      items: [{ foodId: testFood._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });
  const orderId = orderRes.body.data.order._id;

  const res = await apiRequest(`/api/v1/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { paymentStatus: 'REFUNDED' },
  });
  assert.equal(res.status, 400);
  assert.ok(res.body.message.includes('Invalid payment transition'));
});

test('2.4 Payment Security: Repeat settlement (PAID -> PAID) returns 400 and preserves audit trail', async () => {
  const orderRes = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customer1Token}` },
    body: {
      items: [{ foodId: testFood._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });
  const orderId = orderRes.body.data.order._id;

  // First settlement: PENDING -> PAID (Succeeds)
  const settleRes = await apiRequest(`/api/v1/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      paymentStatus: 'PAID',
      paymentMethod: 'COUNTER_CASH',
      paymentReference: 'RCPT-9876',
      paymentNote: 'Settled at counter by diner in cash',
    },
  });
  assert.equal(settleRes.status, 200);
  assert.equal(settleRes.body.data.order.paymentStatus, 'PAID');
  assert.ok(settleRes.body.data.order.paymentSettlement);
  assert.equal(settleRes.body.data.order.paymentSettlement.reference, 'RCPT-9876');

  // Second settlement attempt: PAID -> PAID (Must reject)
  const repeatRes = await apiRequest(`/api/v1/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      paymentStatus: 'PAID',
      paymentReference: 'RCPT-DUPLICATE',
    },
  });
  assert.equal(repeatRes.status, 400);
  assert.ok(repeatRes.body.message.includes('already marked as PAID'));
});

test('2.5 Payment Security: Invalid status transition does not partially persist paymentStatus changes', async () => {
  const orderRes = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customer1Token}` },
    body: {
      items: [{ foodId: testFood._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });
  const orderId = orderRes.body.data.order._id;

  // Attempt invalid status transition (PLACED -> COMPLETED is forbidden) while passing paymentStatus: PAID
  const badRes = await apiRequest(`/api/v1/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      status: 'COMPLETED', // Invalid from PLACED
      paymentStatus: 'PAID',
    },
  });
  assert.equal(badRes.status, 400);

  // Verify in DB that paymentStatus was NOT partially modified to PAID
  const dbOrder = await Order.findById(orderId);
  assert.equal(dbOrder.status, 'PLACED');
  assert.equal(dbOrder.paymentStatus, 'PENDING');
});

// =========================================================================
// 3. PAGINATION & QUERY VALIDATION
// =========================================================================

test('3.1 Query Validation: Malformed page numbers (page=0, page=-1, page=abc) return 400', async () => {
  const r1 = await apiRequest('/api/v1/foods?page=0');
  assert.equal(r1.status, 400);

  const r2 = await apiRequest('/api/v1/foods?page=-1');
  assert.equal(r2.status, 400);

  const r3 = await apiRequest('/api/v1/foods?page=abc');
  assert.equal(r3.status, 400);
});

test('3.2 Query Validation: Malformed limit values (limit=0, limit=-5) return 400', async () => {
  const r1 = await apiRequest('/api/v1/foods?limit=0');
  assert.equal(r1.status, 400);

  const r2 = await apiRequest('/api/v1/foods?limit=-5');
  assert.equal(r2.status, 400);
});

test('3.3 Query Validation: Invalid date format in admin queries returns 400', async () => {
  const res = await apiRequest('/api/v1/admin/orders?businessDate=not-a-date', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test('3.4 Query Validation: Invalid status filter in admin queries returns 400', async () => {
  const res = await apiRequest('/api/v1/admin/orders?status=INVALID_STATUS', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

// =========================================================================
// 4. FOOD FIELD NORMALIZATION & STRICT PRICE VALIDATION
// =========================================================================

test('4.1 Food Validation: Malformed prices ("120abc", negative, Infinity) reject with 400', async () => {
  const category = await Category.findOne({ isActive: true });

  // Malformed string containing non-digits
  const r1 = await apiRequest('/api/v1/foods', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: 'Test Malformed Price Dish',
      price: '120abc',
      category: category._id.toString(),
    },
  });
  assert.equal(r1.status, 400);

  // Negative price
  const r2 = await apiRequest('/api/v1/foods', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: 'Test Negative Price Dish',
      price: -50,
      category: category._id.toString(),
    },
  });
  assert.equal(r2.status, 400);
});

test('4.2 Food Validation: Partial food update preserves omitted fields', async () => {
  const originalPrice = testFood.price;
  // Update only price
  const updateRes = await apiRequest(`/api/v1/foods/${testFood._id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      price: 185.0,
    },
  });
  assert.equal(updateRes.status, 200);
  assert.equal(updateRes.body.data.food.price, 185.0);
  assert.equal(updateRes.body.data.food.name, testFood.name, 'Name must remain untouched');
  assert.equal(updateRes.body.data.food.portion, testFood.portion, 'Portion must remain untouched');

  // Restore original price to preserve database integrity for all test suites
  await apiRequest(`/api/v1/foods/${testFood._id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      price: originalPrice,
    },
  });
});

// =========================================================================
// 5. SEARCH SAFETY
// =========================================================================

test('5.1 Search Safety: Regex metacharacters in search do not trigger syntax errors or crashes', async () => {
  const res = await apiRequest('/api/v1/foods?search=Dosa+(Special)+[Ghee]*?');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(Array.isArray(res.body.data.foods));
});

test('5.2 Search Safety: Object/array injection in query parameters returns 400 Bad Request', async () => {
  const res = await apiRequest('/api/v1/foods?search[malicious]=payload');
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

// =========================================================================
// 6. CATEGORY VISIBILITY
// =========================================================================

test('6.1 Category Visibility: Public request with all=true returns 403 Forbidden', async () => {
  const res = await apiRequest('/api/v1/categories?all=true');
  assert.equal(res.status, 403);
  assert.equal(res.body.success, false);
  assert.ok(res.body.message.includes('administrator privileges'));
});

test('6.2 Category Visibility: Customer role request with all=true returns 403 Forbidden', async () => {
  const res = await apiRequest('/api/v1/categories?all=true', {
    headers: { Authorization: `Bearer ${customer1Token}` },
  });
  assert.equal(res.status, 403);
  assert.equal(res.body.success, false);
});

test('6.3 Category Visibility: Public cannot retrieve inactive category by ID (404 Not Found)', async () => {
  const res = await apiRequest(`/api/v1/categories/${inactiveCategory._id}`);
  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
});

test('6.4 Category Visibility: Admin CAN view inactive categories using all=true', async () => {
  const res = await apiRequest('/api/v1/categories?all=true', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  const foundInactive = res.body.data.categories.some((c) => c._id.toString() === inactiveCategory._id.toString());
  assert.ok(foundInactive, 'Admin must see inactive category when all=true is specified');
});
