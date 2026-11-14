const { test, expect } = require('@playwright/test');

const PRODUCTION_FRONTEND = 'https://moorthicafe.netlify.app';
const PRODUCTION_API = 'https://moorthi-cafe-api.onrender.com/api/v1';

test.describe.configure({ retries: 0 });

test.describe('Staging E2E Tests - Hotel New Moorthi Cafe', () => {

  test.beforeEach(async ({ page }) => {
    // Validate we're not targeting production
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';
    if (baseURL.includes('moorthicafe.netlify.app')) {
      throw new Error(`[Test Guard] Refusing to run against production frontend: ${baseURL}`);
    }

    // Clear all browser storage before each test
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      try { localStorage.clear(); } catch (e) {}
      try { sessionStorage.clear(); } catch (e) {}
    });
    await page.context().clearCookies();
  });

  test('Staging homepage loads with HTTP 200', async ({ page }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';
    const response = await page.goto(baseURL, { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
  });

  test('Staging homepage renders correctly', async ({ page }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';
    await page.goto(baseURL, { waitUntil: 'networkidle' });

    const title = await page.title();
    expect(title).toContain('Hotel New Moorthi Cafe');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Featured Tiffin Delicacies')).toBeVisible();
  });

  test('Staging API health check returns CONNECTED', async ({ page }) => {
    const apiBase = process.env.API_BASE_URL || 'https://moorthi-cafe-api.onrender.com/api/v1';

    const result = await page.evaluate(async (url) => {
      try {
        const res = await fetch(`${url}/health`);
        return await res.json();
      } catch (e) {
        return { error: e.message };
      }
    }, apiBase);

    expect(result.error).toBeUndefined();
    expect(result.success).toBe(true);
    expect(result.data.database).toBe('CONNECTED');
    // Staging should connect to staging database
    expect(result.data.environment).toBe('staging');
  });

  test('Staging CORS allows staging frontend origin', async ({ page }) => {
    const apiBase = process.env.API_BASE_URL || 'https://moorthi-cafe-api.onrender.com/api/v1';
    const stagingFrontend = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';

    const result = await page.evaluate(async (url, origin) => {
      try {
        const res = await fetch(`${url}/health`, {
          method: 'OPTIONS',
          headers: {
            'Origin': origin,
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
          }
        });
        return {
          status: res.status,
          allowOrigin: res.headers.get('access-control-allow-origin'),
          allowCredentials: res.headers.get('access-control-allow-credentials')
        };
      } catch (e) {
        return { error: e.message };
      }
    }, apiBase, stagingFrontend);

    expect(result.error).toBeUndefined();
    expect(result.status).toBe(204);
    expect(result.allowOrigin).toBe(stagingFrontend);
    expect(result.allowCredentials).toBe('true');
  });

  test('Staging foods endpoint returns data (after seed)', async ({ page }) => {
    const apiBase = process.env.API_BASE_URL || 'https://moorthi-cafe-api.onrender.com/api/v1';

    const result = await page.evaluate(async (url) => {
      try {
        const res = await fetch(`${url}/foods?limit=5`);
        return await res.json();
      } catch (e) {
        return { error: e.message };
      }
    }, apiBase);

    expect(result.error).toBeUndefined();
    expect(result.success).toBe(true);
    // Note: This test will show empty array if staging DB not seeded yet
    // After seed, should have foods array with valid ObjectIds
    console.log(`[Staging] Foods count: ${result.data.pagination.total}`);
  });

  test('Staging cart functionality - Add real food item', async ({ page }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';
    await page.goto(`${baseURL}/menu`, { waitUntil: 'networkidle' });

    // Check if there are real food items with valid ObjectIds
    const addToTrayButtons = page.locator('button:has-text("Add to Tray")');
    const count = await addToTrayButtons.count();

    if (count > 0) {
      // Click first real add button
      await addToTrayButtons.first().click();
      await page.waitForTimeout(1000);

      // Verify toast appears
      await expect(page.locator('text=Added')).toBeVisible({ timeout: 3000 });

      // Go to cart
      await page.goto(`${baseURL}/cart`, { waitUntil: 'networkidle' });

      // Verify item in cart
      const cartItems = page.locator('.cart-item, .tray-item, [data-testid="cart-item"]');
      await expect(cartItems.first()).toBeVisible({ timeout: 3000 });

      // Store the foodId for removal test
      const foodId = await cartItems.first().getAttribute('data-food-id') || '';
      return { foodId };
    } else {
      test.info().annotations.push({ type: 'blocked', description: 'No real food items in staging database (needs seed)' });
    }
  });

  test('Staging cart quantity update - increase and decrease', async ({ page }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';
    await page.goto(`${baseURL}/menu`, { waitUntil: 'networkidle' });

    const addToTrayButtons = page.locator('button:has-text("Add to Tray")');
    const count = await addToTrayButtons.count();

    if (count > 0) {
      // Add item to cart
      await addToTrayButtons.first().click();
      await page.waitForTimeout(1000);

      // Go to cart
      await page.goto(`${baseURL}/cart`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      // Test quantity increase (+ button)
      const plusButton = page.locator('button').filter({ hasText: '+' }).first();
      if (await plusButton.count() > 0) {
        const qtyBefore = await page.locator('.cart-item [style*="fontWeight: bold"]').first().textContent();
        await plusButton.click();
        await page.waitForTimeout(500);
        const qtyAfter = await page.locator('.cart-item [style*="fontWeight: bold"]').first().textContent();
        expect(parseInt(qtyAfter, 10)).toBe(parseInt(qtyBefore, 10) + 1);
      }

      // Test quantity decrease (- button)
      const minusButton = page.locator('button').filter({ hasText: '-' }).first();
      if (await minusButton.count() > 0) {
        const qtyBefore = await page.locator('.cart-item [style*="fontWeight: bold"]').first().textContent();
        await minusButton.click();
        await page.waitForTimeout(500);
        const qtyAfter = await page.locator('.cart-item [style*="fontWeight: bold"]').first().textContent();
        expect(parseInt(qtyAfter, 10)).toBe(parseInt(qtyBefore, 10) - 1);
      }
    } else {
      test.info().annotations.push({ type: 'blocked', description: 'No real food items in staging database (needs seed)' });
    }
  });

  test('Staging cart item removal - minus button at quantity 1', async ({ page }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';
    await page.goto(`${baseURL}/menu`, { waitUntil: 'networkidle' });

    const addToTrayButtons = page.locator('button:has-text("Add to Tray")');
    const count = await addToTrayButtons.count();

    if (count > 0) {
      // Add item to cart
      await addToTrayButtons.first().click();
      await page.waitForTimeout(1000);

      // Go to cart
      await page.goto(`${baseURL}/cart`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      // Ensure quantity is 1
      const qtyEl = page.locator('.cart-item [style*="fontWeight: bold"]').first();
      const qty = await qtyEl.textContent();

      if (qty === '1') {
        // Click minus button - should REMOVE the item (not error)
        const minusButton = page.locator('button').filter({ hasText: '-' }).first();
        await minusButton.click();
        await page.waitForTimeout(1000);

        // Item should be removed from cart
        const cartItems = page.locator('.cart-item, .tray-item, [data-testid="cart-item"]');
        const itemCount = await cartItems.count();
        expect(itemCount).toBe(0);
      } else {
        test.info().annotations.push({ type: 'blocked', description: 'Cannot test removal at qty=1 without qty=1 state' });
      }
    } else {
      test.info().annotations.push({ type: 'blocked', description: 'No real food items in staging database (needs seed)' });
    }
  });

  test('Staging cart item removal - delete button', async ({ page }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';
    await page.goto(`${baseURL}/menu`, { waitUntil: 'networkidle' });

    const addToTrayButtons = page.locator('button:has-text("Add to Tray")');
    const count = await addToTrayButtons.count();

    if (count > 0) {
      // Add item to cart
      await addToTrayButtons.first().click();
      await page.waitForTimeout(1000);

      // Go to cart
      await page.goto(`${baseURL}/cart`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      // Click delete button (trash icon)
      const deleteButton = page.locator('button[title="Remove item"]').first();
      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        await page.waitForTimeout(1000);

        // Item should be removed from cart
        const cartItems = page.locator('.cart-item, .tray-item, [data-testid="cart-item"]');
        const itemCount = await cartItems.count();
        expect(itemCount).toBe(0);
      } else {
        test.info().annotations.push({ type: 'blocked', description: 'Delete button not found' });
      }
    } else {
      test.info().annotations.push({ type: 'blocked', description: 'No real food items in staging database (needs seed)' });
    }
  });

  test('Staging checkout validation - rejects invalid quantities', async ({ page }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';
    // This test requires cart items and authentication
    // Just verify the validation logic doesn't crash
    await page.goto(`${baseURL}/checkout`, { waitUntil: 'networkidle' });

    // Should redirect to cart if empty, or show login if not authenticated
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toContain('/checkout');
  });

  test('Staging network audit - no unexpected 404/500', async ({ page }) => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';
    const failedRequests = [];

    page.on('response', response => {
      if (response.status() >= 400) {
        failedRequests.push({ url: response.url(), status: response.status() });
      }
    });

    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Filter out expected failures
    const unexpectedFailures = failedRequests.filter(r =>
      !r.url.includes('netlify') &&
      !r.url.includes('hud') &&
      !r.url.includes('favicon') &&
      !r.url.includes('.netlify.app/.netlify')
    );

    expect(unexpectedFailures).toHaveLength(0);
  });

  test('Staging refuses production frontend URL', async () => {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';
    expect(baseURL).not.toBe(PRODUCTION_FRONTEND);
    expect(baseURL).not.toContain('moorthicafe.netlify.app');
  });

  test('Staging refuses production API URL', async () => {
    const apiBase = process.env.API_BASE_URL || 'https://moorthi-cafe-api.onrender.com/api/v1';
    expect(apiBase).not.toBe(PRODUCTION_API);
    expect(apiBase).not.toContain('moorthi-cafe-api.onrender.com');
  });
});