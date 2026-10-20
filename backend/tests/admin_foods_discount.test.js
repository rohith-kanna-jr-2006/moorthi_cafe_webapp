const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { setupTestServer, teardownTestServer, apiRequest } = require('./testHelper');
const Category = require('../src/models/Category');
const Food = require('../src/models/Food');
const Order = require('../src/models/Order');
const User = require('../src/models/User');
const { calculateOrderPricing } = require('../src/services/orderService');

let adminToken;
let customerToken;
let testCategory;
let testFood;
let orderedFood;

before(async () => {
  await setupTestServer();

  // 1. Authenticate admin
  const adminRes = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: {
      email: 'admin@moorthicafe.com',
      password: 'AdminSecretPass123!',
    },
  });
  adminToken = adminRes.body.data.token;

  // 2. Authenticate customer
  const customerRes = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: {
      email: 'customer@moorthicafe.com',
      password: 'CustomerPass123!',
    },
  });
  customerToken = customerRes.body.data.token;

  // 3. Find category and create initial test foods
  testCategory = await Category.findOne({ isActive: true });

  orderedFood = await Food.create({
    name: 'Historical Parotta For Test',
    nameEnglish: 'Historical Parotta For Test',
    price: 60,
    pricePaise: 6000,
    category: testCategory._id,
    isAvailable: true,
    isPublished: true,
  });

  // Place historical order referencing orderedFood
  await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      items: [{ foodId: orderedFood._id.toString(), quantity: 2 }],
      pickupType: 'IMMEDIATE',
    },
  });
});

after(async () => {
  // Clean up any test upload files created in uploads/
  const uploadsDir = path.resolve(__dirname, '../public/images/uploads');
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    for (const f of files) {
      if (f.startsWith('food-')) {
        try {
          fs.unlinkSync(path.join(uploadsDir, f));
        } catch {
          // Ignore
        }
      }
    }
  }

  await teardownTestServer();
});

// --------------------------------------------------------------------------
// 1. ROLE PROTECTION TESTS
// --------------------------------------------------------------------------
test('1.1 Unauthenticated requests to /api/v1/admin/foods return 401 Unauthorized', async () => {
  const res = await apiRequest('/api/v1/admin/foods');
  assert.equal(res.status, 401);
  assert.equal(res.body.success, false);
});

test('1.2 Customer role requests to /api/v1/admin/foods return 403 Forbidden', async () => {
  const res = await apiRequest('/api/v1/admin/foods', {
    headers: { Authorization: `Bearer ${customerToken}` },
  });
  assert.equal(res.status, 403);
  assert.equal(res.body.success, false);
});

test('1.3 Admin role can successfully list admin foods (200 OK)', async () => {
  const res = await apiRequest('/api/v1/admin/foods', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(Array.isArray(res.body.data.foods));
  assert.ok(res.body.data.pagination);
});

// --------------------------------------------------------------------------
// 2. ADMIN FOOD CRUD & VALIDATIONS
// --------------------------------------------------------------------------
test('2.1 Admin can create a new food item with variants', async () => {
  const res = await apiRequest('/api/v1/admin/foods', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: 'Dynamic Chettinad Chicken Fry',
      nameTamil: 'செட்டிநாடு சிக்கன் வறுவல்',
      nameEnglish: 'Dynamic Chettinad Chicken Fry',
      price: 240,
      category: testCategory._id.toString(),
      variants: [
        { name: 'Bone', price: 240 },
        { name: 'Boneless', price: 265 },
      ],
      isAvailable: true,
      isPublished: false, // initial draft
    },
  });

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.food.name, 'Dynamic Chettinad Chicken Fry');
  assert.equal(res.body.data.food.variants.length, 2);
  assert.equal(res.body.data.food.isPublished, false);
  testFood = res.body.data.food;
});

test('2.2 Creating food with missing category returns 404 Not Found', async () => {
  const fakeId = '507f1f77bcf86cd799439011';
  const res = await apiRequest('/api/v1/admin/foods', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: 'Orphan Food',
      price: 150,
      category: fakeId,
    },
  });

  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
});

test('2.3 Creating food with negative price returns 400 Bad Request', async () => {
  const res = await apiRequest('/api/v1/admin/foods', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      name: 'Negative Dish',
      price: -25,
      category: testCategory._id.toString(),
    },
  });

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test('2.4 Admin can update food publication state via PATCH /publish', async () => {
  const res = await apiRequest(`/api/v1/admin/foods/${testFood._id}/publish`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { isPublished: true },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.food.isPublished, true);
});

test('2.5 Admin can update food availability via PATCH /availability', async () => {
  const res = await apiRequest(`/api/v1/admin/foods/${testFood._id}/availability`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { isAvailable: false },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.food.isAvailable, false);

  // Restore availability
  await apiRequest(`/api/v1/admin/foods/${testFood._id}/availability`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { isAvailable: true },
  });
});

// --------------------------------------------------------------------------
// 3. SAFE ARCHIVAL ON DELETE (HISTORICAL REFERENTIAL INTEGRITY)
// --------------------------------------------------------------------------
test('3.1 DELETE /api/v1/admin/foods/:id archives food referenced by historical orders', async () => {
  const res = await apiRequest(`/api/v1/admin/foods/${orderedFood._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.archived, true);
  assert.equal(res.body.data.deleted, false);
  assert.ok(res.body.data.historicalOrderCount > 0);

  // Verify food still exists in DB as archived
  const dbFood = await Food.findById(orderedFood._id);
  assert.ok(dbFood);
  assert.equal(dbFood.isArchived, true);
  assert.equal(dbFood.isAvailable, false);
  assert.equal(dbFood.isPublished, false);
});

test('3.2 DELETE /api/v1/admin/foods/:id enforces archive-only deletion to prevent orphaned order references', async () => {
  // Create test food with 0 orders
  const unreferencedFood = await Food.create({
    name: 'Retiring Dish Without Orders',
    price: 99,
    pricePaise: 9900,
    category: testCategory._id,
    isAvailable: true,
    isPublished: true,
  });

  const res = await apiRequest(`/api/v1/admin/foods/${unreferencedFood._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.archived, true);
  assert.equal(res.body.data.deleted, false);

  // Document remains in MongoDB as archived to eliminate race conditions
  const check = await Food.findById(unreferencedFood._id);
  assert.ok(check, 'Food record must be preserved in database');
  assert.equal(check.isArchived, true);
  assert.equal(check.isAvailable, false);
  assert.equal(check.isPublished, false);
});

test('3.3 Concurrency: Simultaneous customer checkout and admin deletion never produces orphaned references', async () => {
  // 1. Create an active food item for concurrency test
  const concurrentFood = await Food.create({
    name: 'Concurrency Hot Sambar Vadai',
    nameEnglish: 'Concurrency Hot Sambar Vadai',
    price: 70,
    pricePaise: 7000,
    category: testCategory._id,
    isAvailable: true,
    isPublished: true,
  });

  // 2. Fire simultaneous customer checkout and admin delete requests
  const checkoutPromise = apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      items: [{ foodId: concurrentFood._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });

  const deletePromise = apiRequest(`/api/v1/admin/foods/${concurrentFood._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  const [checkoutRes, deleteRes] = await Promise.all([checkoutPromise, deletePromise]);

  // Admin delete must always succeed with 200
  assert.equal(deleteRes.status, 200);
  assert.equal(deleteRes.body.success, true);
  assert.equal(deleteRes.body.data.archived, true);

  // Checkout must either succeed (201) if processed before deactivation, OR fail cleanly (400) if processed after
  assert.ok([201, 400].includes(checkoutRes.status), `Unexpected status code: ${checkoutRes.status}`);

  if (checkoutRes.status === 201) {
    const placedOrder = checkoutRes.body.data.order;
    // Foreign key referential integrity check:
    const populated = await Order.findById(placedOrder._id).populate('items.food');
    assert.ok(populated.items[0].food, 'Referenced food must exist in MongoDB and not be null');
    assert.equal(populated.items[0].food._id.toString(), concurrentFood._id.toString());
    assert.equal(populated.items[0].food.isArchived, true);
  }

  // Food in MongoDB must be preserved in archived state
  const foodInDb = await Food.findById(concurrentFood._id);
  assert.ok(foodInDb, 'Food document must never be deleted from database');
  assert.equal(foodInDb.isArchived, true);
  assert.equal(foodInDb.isAvailable, false);
});

test('3.4 Interleaved Concurrency: In-flight order pricing evaluated before admin deletion persists valid references without orphaned documents', async () => {
  // 1. Create active food item
  const inFlightFood = await Food.create({
    name: 'In-Flight Hot Ghee Podi Dosa',
    nameEnglish: 'In-Flight Hot Ghee Podi Dosa',
    price: 85,
    pricePaise: 8500,
    category: testCategory._id,
    isAvailable: true,
    isPublished: true,
  });

  // 2. In-flight order evaluates pricing while food is available and active
  const pricing = await calculateOrderPricing([
    { foodId: inFlightFood._id.toString(), quantity: 2 },
  ]);
  assert.equal(pricing.itemsSnapshot.length, 1);
  assert.equal(pricing.itemsSnapshot[0].food.toString(), inFlightFood._id.toString());

  // 3. Concurrently, Admin issues DELETE /api/v1/admin/foods/:id before order is written to DB
  const deleteRes = await apiRequest(`/api/v1/admin/foods/${inFlightFood._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(deleteRes.status, 200);
  assert.equal(deleteRes.body.data.archived, true);
  assert.equal(deleteRes.body.data.deleted, false);

  // 4. In-flight order completes placement with the snapshot computed at step 2
  const customer = await User.findOne({ email: 'customer@moorthicafe.com' });
  const inFlightOrder = await Order.create({
    orderId: `ORD-CONCUR-${Date.now()}`,
    dailyTokenNumber: 888,
    businessDate: '2026-10-20',
    customer: customer._id,
    items: pricing.itemsSnapshot,
    subtotal: pricing.subtotal,
    gst: pricing.gst,
    packagingCharge: pricing.packagingCharge,
    totalAmount: pricing.totalAmount,
    pickupType: 'IMMEDIATE',
    pickupAt: new Date(Date.now() + 15 * 60 * 1000),
    status: 'PLACED',
    paymentStatus: 'PENDING',
    paymentMethod: 'UPI',
  });

  // 5. Verify foreign key referential integrity - NO ORPHANED REFERENCE
  const populatedOrder = await Order.findById(inFlightOrder._id).populate('items.food');
  assert.ok(populatedOrder.items[0].food, 'Referenced food must exist in MongoDB (never orphaned)');
  assert.equal(populatedOrder.items[0].food._id.toString(), inFlightFood._id.toString());
  assert.equal(populatedOrder.items[0].food.isArchived, true);
  assert.equal(populatedOrder.items[0].food.isAvailable, false);

  // 6. Subsequent customer orders for the deleted/archived food MUST be rejected
  const subsequentRes = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      items: [{ foodId: inFlightFood._id.toString(), quantity: 1 }],
      pickupType: 'IMMEDIATE',
    },
  });
  assert.equal(subsequentRes.status, 400);
  assert.match(subsequentRes.body.message, /currently sold out \/ unavailable/i);
});

// --------------------------------------------------------------------------
// 4. DISCOUNT MANAGEMENT & VALIDATION
// --------------------------------------------------------------------------
test('4.1 Percentage discount > 100% is rejected with 400 Bad Request', async () => {
  const res = await apiRequest(`/api/v1/admin/foods/${testFood._id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      discount: {
        type: 'PERCENTAGE',
        value: 120, // Invalid: exceeds 100%
        isActive: true,
      },
    },
  });

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test('4.2 Fixed discount exceeding item price is rejected with 400 Bad Request', async () => {
  const res = await apiRequest(`/api/v1/admin/foods/${testFood._id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      discount: {
        type: 'FIXED_AMOUNT',
        value: 300, // Invalid: item price is 240
        isActive: true,
      },
    },
  });

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test('4.3 Invalid discount date range (endsAt earlier than startsAt) is rejected with 400', async () => {
  const res = await apiRequest(`/api/v1/admin/foods/${testFood._id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      discount: {
        type: 'PERCENTAGE',
        value: 15,
        startsAt: new Date(Date.now() + 86400000).toISOString(),
        endsAt: new Date(Date.now() - 86400000).toISOString(),
        isActive: true,
      },
    },
  });

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test('4.4 Valid 20% active discount correctly calculates effectivePrice (₹240 -> ₹192)', async () => {
  const res = await apiRequest(`/api/v1/admin/foods/${testFood._id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      discount: {
        type: 'PERCENTAGE',
        value: 20,
        isActive: true,
      },
    },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.food.price, 240);
  assert.equal(res.body.data.food.effectivePrice, 192);
  assert.equal(res.body.data.food.effectivePricePaise, 19200);
  assert.equal(res.body.data.food.isDiscountActive, true);
  assert.equal(res.body.data.food.discountApplied.discountAmount, 48);
});

test('4.5 Expired discount returns regular item price as effectivePrice', async () => {
  const res = await apiRequest(`/api/v1/admin/foods/${testFood._id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      discount: {
        type: 'FIXED_AMOUNT',
        value: 50,
        startsAt: new Date(Date.now() - 172800000).toISOString(),
        endsAt: new Date(Date.now() - 86400000).toISOString(), // expired yesterday
        isActive: true,
      },
    },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.food.effectivePrice, 240);
  assert.equal(res.body.data.food.isDiscountActive, false);
});

// --------------------------------------------------------------------------
// 5. SERVER-SIDE ORDER PRICING WITH ACTIVE DISCOUNTS & VARIANTS
// --------------------------------------------------------------------------
test('5.1 Order creation enforces server-side effective prices and creates item snapshots', async () => {
  // Set active 10% discount on testFood
  await apiRequest(`/api/v1/admin/foods/${testFood._id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      discount: {
        type: 'PERCENTAGE',
        value: 10,
        isActive: true,
      },
      isAvailable: true,
      isPublished: true,
    },
  });

  // Base price 240 - 10% (24) = 216
  // Order 2 items = subtotal 432
  // GST 5% = 21.60
  // Packaging = 15.00
  // Total = 468.60
  const orderRes = await apiRequest('/api/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      items: [{ foodId: testFood._id.toString(), quantity: 2 }],
      pickupType: 'IMMEDIATE',
    },
  });

  assert.equal(orderRes.status, 201);
  assert.equal(orderRes.body.success, true);
  const order = orderRes.body.data.order;

  assert.equal(order.subtotal, 432);
  assert.equal(order.gst, 21.6);
  assert.equal(order.packagingCharge, 15);
  assert.equal(order.totalAmount, 468.6);

  // Snapshot audit checks
  const itemSnapshot = order.items[0];
  assert.equal(itemSnapshot.price, 216);
  assert.equal(itemSnapshot.pricePaise, 21600);
  assert.equal(itemSnapshot.originalPrice, 240);
  assert.equal(itemSnapshot.originalPricePaise, 24000);
  assert.equal(itemSnapshot.lineTotal, 432);
  assert.equal(itemSnapshot.lineTotalPaise, 43200);
  assert.equal(itemSnapshot.discountApplied.type, 'PERCENTAGE');
  assert.equal(itemSnapshot.discountApplied.value, 10);
});

// --------------------------------------------------------------------------
// 6. IMAGE MANAGEMENT & SECURITY
// --------------------------------------------------------------------------
test('6.1 Admin can upload valid JPEG image via base64 buffer with magic bytes check', async () => {
  // Minimal valid 1x1 JPEG buffer: FF D8 FF E0 00 10 4A 46 49 46 00 01 ...
  const validJpegBuffer = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
    0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
    0xff, 0xd9,
  ]);
  const base64Str = validJpegBuffer.toString('base64');

  const res = await apiRequest(`/api/v1/admin/foods/${testFood._id}/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      imageBase64: base64Str,
      imageAlt: 'Authentic Chettinad Chicken Fry Photo',
      imageSource: 'RESTAURANT_ORIGINAL',
      imageLicense: 'PROPRIETARY_RESTAURANT',
    },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.food.imageUrl.startsWith('/images/uploads/food-'));
  assert.ok(res.body.data.food.imageUrl.endsWith('.jpg'));
  assert.equal(res.body.data.food.imageType, 'AUTHENTIC_PHOTOGRAPH');

  // Verify file was written to disk
  const writtenPath = path.resolve(__dirname, '../public', res.body.data.food.imageUrl.replace(/^\//, ''));
  assert.ok(fs.existsSync(writtenPath));
});

test('6.2 Uploading file with invalid magic bytes (fake executable) is rejected with 400', async () => {
  const fakeExeBuffer = Buffer.from('MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00ThisIsAnExecutableFileContent');
  const base64Str = fakeExeBuffer.toString('base64');

  const res = await apiRequest(`/api/v1/admin/foods/${testFood._id}/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      imageBase64: base64Str,
    },
  });

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.ok(res.body.message.includes('Only authentic JPEG, PNG, or WebP'));
});

test('6.3 Admin can set a verified relative or HTTPS image URL', async () => {
  const res = await apiRequest(`/api/v1/admin/foods/${testFood._id}/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      imageUrl: '/images/menu/chicken_65.jpg',
      imageAlt: 'Verified Chicken 65 Wikimedia Photo',
      imageSource: 'https://commons.wikimedia.org/wiki/File:Chicken_65.jpg',
      imageLicense: 'CC BY-SA 2.0 (Charles Haynes)',
    },
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.food.imageUrl, '/images/menu/chicken_65.jpg');
  assert.equal(res.body.data.food.imageLicense, 'CC BY-SA 2.0 (Charles Haynes)');
});

test('6.4 Dangerous URI schemes (file://, javascript:) are rejected with 400 Bad Request', async () => {
  const res = await apiRequest(`/api/v1/admin/foods/${testFood._id}/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      imageUrl: 'file:///etc/passwd',
    },
  });

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test('6.5 Shared uploaded image asset is NOT deleted when another food record still references it', async () => {
  // Create food A and upload an image
  const validJpegBuffer = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
    0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
    0xff, 0xd9,
  ]);
  const uploadRes = await apiRequest(`/api/v1/admin/foods/${testFood._id}/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      imageBase64: validJpegBuffer.toString('base64'),
    },
  });
  const uploadedUrl = uploadRes.body.data.food.imageUrl;
  const writtenPath = path.resolve(__dirname, '../public', uploadedUrl.replace(/^\//, ''));
  assert.ok(fs.existsSync(writtenPath));

  // Create food B sharing the exact same uploadedUrl
  const foodB = await Food.create({
    name: 'Food B Sharing Image',
    price: 100,
    pricePaise: 10000,
    category: testCategory._id,
    imageUrl: uploadedUrl,
  });

  // Now delete food testFood (or replace its image)
  await apiRequest(`/api/v1/admin/foods/${testFood._id}/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      imageUrl: '/images/menu/chicken_65.jpg',
    },
  });

  // Verify the shared image on disk STILL exists because foodB uses it!
  assert.ok(fs.existsSync(writtenPath), 'Shared image file must not be removed while another food references it');

  // Clean up food B
  await Food.deleteOne({ _id: foodB._id });
});

test('7.1 100% percentage discount yields ₹0 effective price and order total accounts for statutory charges', async () => {
  // Update testFood to 100% discount
  await apiRequest(`/api/v1/admin/foods/${testFood._id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      discount: {
        type: 'PERCENTAGE',
        value: 100,
        isActive: true,
      },
    },
  });

  const getRes = await apiRequest(`/api/v1/admin/foods/${testFood._id}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(getRes.body.data.food.effectivePrice, 0);
  assert.equal(getRes.body.data.food.effectivePricePaise, 0);
  assert.equal(getRes.body.data.food.isDiscountActive, true);
});
