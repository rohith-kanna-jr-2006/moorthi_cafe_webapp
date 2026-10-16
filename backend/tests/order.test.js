const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { setupTestServer, teardownTestServer, apiRequest } = require('./testHelper');
const Food = require('../src/models/Food');
const Order = require('../src/models/Order');

let customer1Token;
let customer2Token;
let adminToken;
let dosaFood;
let vadaFood;
let placedOrderId;

before(async () => {
  await setupTestServer();

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
  const c2Email = `diner2_${Date.now()}@example.com`;
  const c2Res = await apiRequest('/api/v1/auth/signup', {
    method: 'POST',
    body: {
      name: 'Ravi Kumar',
      email: c2Email,
      phone: '+91 98765 99999',
      password: 'StrongPassword123!',
    },
  });
  customer2Token = c2Res.body.data.token;

  // Admin login
  const adminRes = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: {
      email: 'admin@moorthicafe.com',
      password: 'AdminSecretPass123!',
    },
  });
  adminToken = adminRes.body.data.token;

  dosaFood = await Food.findOne({ name: 'Golden Ghee Roast Masala Dosa' });
  vadaFood = await Food.findOne({ name: 'Medu Vada (2 Pcs)' });
});

after(async () => {
  await teardownTestServer();
});

test('1. Price calculation preview is strictly derived from database prices', async () => {
  // Dosa: 160 x 1 = 160, Vada: 80 x 2 = 160 -> Subtotal: 320
  // GST 5%: 16, Packaging: 15 -> Total: 351
  const res = await apiRequest('/api/v1/orders/preview', {
    method: 'POST',
    body: {
      items: [
        { foodId: dosaFood._id.toString(), quantity: 1 },
        { foodId: vadaFood._id.toString(), quantity: 2 },
      ],
    },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.subtotal, 320);
  assert.equal(res.body.data.gst, 16);
  assert.equal(res.body.data.packagingCharge, 15);
  assert.equal(res.body.data.totalAmount, 351);
});

test('2. Successful order placement allocates atomic token and calculates total correctly', async () => {
  const res = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customer1Token}` },
    body: {
      items: [
        { foodId: dosaFood._id.toString(), quantity: 1, price: 5 }, // Client attempt to forge price 5 is ignored
      ],
      pickupType: 'IMMEDIATE',
      notes: 'Crispy roast, separate sambar bowl',
    },
  });

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.order.orderId.startsWith('HNMC-'));
  assert.ok(typeof res.body.data.order.dailyTokenNumber === 'number');
  assert.equal(res.body.data.order.subtotal, 160);
  assert.equal(res.body.data.order.gst, 8); // 5% of 160
  assert.equal(res.body.data.order.packagingCharge, 15);
  assert.equal(res.body.data.order.totalAmount, 183);
  assert.equal(res.body.data.order.status, 'PLACED');

  placedOrderId = res.body.data.order._id;
});

test('3. Idempotent order placement: replaying same Idempotency-Key returns existing order without creating new token', async () => {
  const key = `idem_${Date.now()}`;

  // First placement
  const res1 = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${customer1Token}`,
      'Idempotency-Key': key,
    },
    body: {
      items: [{ foodId: dosaFood._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });

  assert.equal(res1.status, 201);
  const firstToken = res1.body.data.order.dailyTokenNumber;

  // Replay request with same key
  const res2 = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${customer1Token}`,
      'Idempotency-Key': key,
    },
    body: {
      items: [{ foodId: dosaFood._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });

  assert.equal(res2.status, 200);
  assert.equal(res2.body.data.order.dailyTokenNumber, firstToken, 'Must return the same token without allocating another');
  assert.equal(res2.body.data.order._id, res1.body.data.order._id);
});

test('4. Customer 2 cannot view Customer 1\'s order (403 Forbidden)', async () => {
  const res = await apiRequest(`/api/v1/orders/${placedOrderId}`, {
    headers: { Authorization: `Bearer ${customer2Token}` },
  });

  assert.equal(res.status, 403);
  assert.equal(res.body.success, false);
});

test('5. Customer 1 can retrieve own order history', async () => {
  const res = await apiRequest('/api/v1/orders/my', {
    headers: { Authorization: `Bearer ${customer1Token}` },
  });

  assert.equal(res.status, 200);
  assert.ok(res.body.data.orders.length > 0);
  assert.ok(res.body.data.orders[0].customer, 'Order must reference customer');
});

test('6. Customer 1 can cancel own order while in PLACED status', async () => {
  const res = await apiRequest(`/api/v1/orders/${placedOrderId}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${customer1Token}` },
    body: { reason: 'Change of travel plan' },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.data.order.status, 'CANCELLED');
});
