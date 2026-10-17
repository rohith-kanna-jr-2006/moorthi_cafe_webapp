const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { setupTestServer, teardownTestServer, apiRequest } = require('./testHelper');
const Food = require('../src/models/Food');

let adminToken;
let customerToken;
let orderForTransitionId;

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

  // Customer login
  const customerRes = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: {
      email: 'customer@moorthicafe.com',
      password: 'CustomerPass123!',
    },
  });
  customerToken = customerRes.body.data.token;

  // Place a test order for status transition tests
  const food = await Food.findOne({ isAvailable: true });
  const orderRes = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      items: [{ foodId: food._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });
  orderForTransitionId = orderRes.body.data.order._id;
});

after(async () => {
  await teardownTestServer();
});

test('1. Customer cannot access admin dashboard (403 Forbidden)', async () => {
  const res = await apiRequest('/api/v1/admin/dashboard', {
    headers: { Authorization: `Bearer ${customerToken}` },
  });

  assert.equal(res.status, 403);
  assert.equal(res.body.success, false);
});

test('2. Admin can access operations dashboard', async () => {
  const res = await apiRequest('/api/v1/admin/dashboard', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.metrics);
  assert.ok(typeof res.body.data.metrics.revenue.total === 'number');
  assert.ok(res.body.data.metrics.orders);
  assert.ok(Array.isArray(res.body.data.recentOrders));
});

test('3. Admin can list orders with filters and pagination', async () => {
  const res = await apiRequest('/api/v1/admin/orders?limit=10', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(Array.isArray(res.body.data.orders));
  assert.ok(res.body.data.pagination);
});

test('4. Admin status state machine: valid sequence PLACED -> CONFIRMED -> PREPARING -> READY -> COMPLETED', async () => {
  // Step 1: PLACED -> CONFIRMED
  const step1 = await apiRequest(`/api/v1/admin/orders/${orderForTransitionId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { status: 'CONFIRMED' },
  });
  assert.equal(step1.status, 200);
  assert.equal(step1.body.data.order.status, 'CONFIRMED');

  // Step 2: CONFIRMED -> PREPARING
  const step2 = await apiRequest(`/api/v1/admin/orders/${orderForTransitionId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { status: 'PREPARING' },
  });
  assert.equal(step2.status, 200);
  assert.equal(step2.body.data.order.status, 'PREPARING');

  // Step 3: PREPARING -> READY
  const step3 = await apiRequest(`/api/v1/admin/orders/${orderForTransitionId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { status: 'READY' },
  });
  assert.equal(step3.status, 200);
  assert.equal(step3.body.data.order.status, 'READY');

  // Step 4: READY -> COMPLETED
  const step4 = await apiRequest(`/api/v1/admin/orders/${orderForTransitionId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { status: 'COMPLETED' },
  });
  assert.equal(step4.status, 200);
  assert.equal(step4.body.data.order.status, 'COMPLETED');
});

test('5. Admin status state machine: invalid transition is rejected with 400 Bad Request', async () => {
  // Once COMPLETED, no further transitions are permitted
  const res = await apiRequest(`/api/v1/admin/orders/${orderForTransitionId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { status: 'PLACED' },
  });

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.ok(res.body.message.includes('Invalid status transition'));
});

test('6. Admin can retrieve sales aggregation report', async () => {
  const res = await apiRequest('/api/v1/admin/reports/sales', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(Array.isArray(res.body.data.dailyReport));
  assert.ok(Array.isArray(res.body.data.bestSellers));
});

test('7. Admin can list customers with total orders, customer role cannot (403)', async () => {
  // Customer attempt should fail with 403
  const forbiddenRes = await apiRequest('/api/v1/admin/customers', {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  assert.equal(forbiddenRes.status, 403);
  assert.equal(forbiddenRes.body.success, false);

  // Admin attempt should succeed with 200
  const adminRes = await apiRequest('/api/v1/admin/customers', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(adminRes.status, 200);
  assert.equal(adminRes.body.success, true);
  assert.ok(Array.isArray(adminRes.body.data.customers));
  assert.ok(adminRes.body.data.pagination);
  assert.ok(adminRes.body.data.customers.length > 0);
  assert.ok(adminRes.body.data.customers[0].email);
  assert.ok(typeof adminRes.body.data.customers[0].totalOrders === 'number');
});

test('8. Admin can update paymentStatus of an order to PAID', async () => {
  const res = await apiRequest(`/api/v1/admin/orders/${orderForTransitionId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { paymentStatus: 'PAID' },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.order.paymentStatus, 'PAID');
});

