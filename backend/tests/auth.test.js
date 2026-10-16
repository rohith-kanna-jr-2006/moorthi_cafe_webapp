const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { setupTestServer, teardownTestServer, apiRequest } = require('./testHelper');
const User = require('../src/models/User');

let customerToken;
let adminToken;

before(async () => {
  await setupTestServer();
});

after(async () => {
  // Clean up any test users created during run
  await User.deleteMany({ email: /test_auth_.*@example\.com/ });
  await teardownTestServer();
});

test('1. Health check endpoint reports UP and connected database', async () => {
  const res = await apiRequest('/api/v1/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.database, 'CONNECTED');
});

test('2. Customer can register with valid credentials', async () => {
  const uniqueEmail = `test_auth_${Date.now()}@example.com`;
  const res = await apiRequest('/api/v1/auth/signup', {
    method: 'POST',
    body: {
      name: 'Ragul S Diner',
      email: uniqueEmail,
      phone: '+91 98765 11111',
      password: 'StrongPassword123!',
    },
  });

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.token);
  assert.equal(res.body.data.user.role, 'customer');
  assert.equal(res.body.data.user.email, uniqueEmail);
  assert.equal(res.body.data.user.passwordHash, undefined, 'passwordHash must never be exposed');

  customerToken = res.body.data.token;
});

test('3. Duplicate email signup is rejected with 409 Conflict', async () => {
  const duplicateEmail = `test_auth_dup_${Date.now()}@example.com`;

  // First signup
  await apiRequest('/api/v1/auth/signup', {
    method: 'POST',
    body: {
      name: 'User One',
      email: duplicateEmail,
      phone: '9876500000',
      password: 'StrongPassword123!',
    },
  });

  // Second duplicate signup
  const res = await apiRequest('/api/v1/auth/signup', {
    method: 'POST',
    body: {
      name: 'User Two',
      email: duplicateEmail,
      phone: '9876500001',
      password: 'StrongPassword123!',
    },
  });

  assert.equal(res.status, 409);
  assert.equal(res.body.success, false);
});

test('4. Public signup cannot escalate privileges to admin role', async () => {
  const email = `test_auth_admin_attempt_${Date.now()}@example.com`;
  const res = await apiRequest('/api/v1/auth/signup', {
    method: 'POST',
    body: {
      name: 'Sneaky Attacker',
      email,
      phone: '9876522222',
      password: 'StrongPassword123!',
      role: 'admin', // Attempted role escalation
    },
  });

  assert.equal(res.status, 201);
  assert.equal(res.body.data.user.role, 'customer', 'Server must ignore or override public role request to customer');
});

test('5. Customer login with valid email succeeds', async () => {
  const res = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: {
      email: 'customer@moorthicafe.com',
      password: 'CustomerPass123!',
    },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.token);
});

test('6. Customer login with registered mobile number succeeds', async () => {
  const res = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: {
      identifier: '+91 98765 43210',
      password: 'CustomerPass123!',
    },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.token);
});

test('7. Login with invalid password fails safely with 401', async () => {
  const res = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: {
      email: 'customer@moorthicafe.com',
      password: 'WrongPassword999!',
    },
  });

  assert.equal(res.status, 401);
  assert.equal(res.body.success, false);
});

test('8. Current profile endpoint GET /api/v1/auth/me returns authenticated user', async () => {
  const res = await apiRequest('/api/v1/auth/me', {
    headers: { Authorization: `Bearer ${customerToken}` },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.user.name, 'Ragul S Diner');
});

test('9. GET /api/v1/auth/me without token fails with 401', async () => {
  const res = await apiRequest('/api/v1/auth/me');
  assert.equal(res.status, 401);
  assert.equal(res.body.success, false);
});
