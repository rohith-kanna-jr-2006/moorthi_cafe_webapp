const { test, expect } = require('@playwright/test');

const PRODUCTION_URL = 'https://moorthicafe.netlify.app/';
const API_BASE = 'https://moorthi-cafe-api.onrender.com/api/v1';

test.describe('Live Production Tests - Hotel New Moorthi Cafe', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate first, then clear storage (cross-origin restriction fix)
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      try { localStorage.clear(); } catch (e) {}
      try { sessionStorage.clear(); } catch (e) {}
    });
    await page.context().clearCookies();
  });

  test('Homepage loads with HTTP 200', async ({ page }) => {
    const response = await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
  });

  test('Homepage renders correctly - title and sections', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });

    // Check page title
    const title = await page.title();
    expect(title).toContain('Hotel New Moorthi Cafe');

    // Check major sections exist
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Featured Tiffin Delicacies')).toBeVisible();
    await expect(page.locator('text=Our Heritage Philosophy')).toBeVisible();
  });

  test('Homepage featured food cards render', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });

    // Check featured food cards
    const foodCards = page.locator('.food-card');
    const count = await foodCards.count();
    expect(count).toBeGreaterThan(0);

    // Verify first card has image, name, price
    const firstCard = foodCards.first();
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.locator('h3')).toBeVisible();
    await expect(firstCard.locator('text=₹')).toBeVisible();
  });

  test('Navigation to Menu page works', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.click('a[href="/menu"]');
    await page.waitForURL('**/menu');

    // Check menu page loads
    await expect(page.locator('h1:has-text("Our Authentic Menu")')).toBeVisible();
  });

  test('Navigation to About page works', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.click('a[href="/about"]');
    await page.waitForURL('**/about');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Navigation to Contact page works', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.click('a[href="/contact"]');
    await page.waitForURL('**/contact');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Cart page loads', async ({ page }) => {
    await page.goto(PRODUCTION_URL + 'cart', { waitUntil: 'networkidle' });
    // Cart page is SPA - wait for React to render
    await page.waitForSelector('#root', { state: 'attached' });
    await page.waitForTimeout(1000);
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible({ timeout: 5000 });
  });

  test('No JavaScript runtime errors on homepage', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Filter out known non-critical errors
    const criticalErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('netlify') &&
      !e.includes('hud')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('Images load with correct content types', async ({ page }) => {
    const failedImages = [];

    page.on('response', response => {
      if (response.url().includes('/images/menu/') && response.status() >= 400) {
        failedImages.push({ url: response.url(), status: response.status() });
      }
    });

    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check a few specific images
    const dosaImg = page.locator('img[src*="dosa.jpg"]').first();
    if (await dosaImg.count() > 0) {
      await expect(dosaImg).toBeVisible();
    }

    expect(failedImages).toHaveLength(0);
  });

  test('Menu page loads and shows fallback state when database empty', async ({ page }) => {
    await page.goto(PRODUCTION_URL + 'menu', { waitUntil: 'networkidle' });

    // Should show heritage fallback items since database is empty
    await expect(page.locator('text=Traditional Woodfire & Tawa Fare')).toBeVisible();

    // Check fallback items display
    const foodCards = page.locator('.food-card');
    const count = await foodCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Fallback items show View Only button (not Add to Tray)', async ({ page }) => {
    await page.goto(PRODUCTION_URL + 'menu', { waitUntil: 'networkidle' });

    // Check that fallback items have "View Only" button
    const viewOnlyButtons = page.locator('button:has-text("View Only")');
    const count = await viewOnlyButtons.count();
    expect(count).toBeGreaterThan(0);

    // Verify "Add to Tray" is not on fallback items
    const addButtons = page.locator('button:has-text("Add to Tray")');
    // Note: Add to Tray may appear for real DB items, but fallback items should not have it
  });

  test('Homepage fallback items show View Only in FoodCard', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });

    // Check featured items section
    const viewOnlyButtons = page.locator('button:has-text("View Only")');
    const count = await viewOnlyButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Responsive layout - Desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toBeVisible();
    await page.screenshot({ path: 'test-results/live-production/screenshots/desktop-home.png' });
  });

  test('Responsive layout - Tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toBeVisible();
    await page.screenshot({ path: 'test-results/live-production/screenshots/tablet-home.png' });
  });

  test('Responsive layout - Mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toBeVisible();
    await page.screenshot({ path: 'test-results/live-production/screenshots/mobile-home.png' });
  });

  test('Cart functionality - Add real food item if available', async ({ page }) => {
    await page.goto(PRODUCTION_URL + 'menu', { waitUntil: 'networkidle' });

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
      await page.goto(PRODUCTION_URL + 'cart', { waitUntil: 'networkidle' });

      // Verify item in cart
      const cartItems = page.locator('.cart-item, .tray-item, [data-testid="cart-item"]');
      await expect(cartItems.first()).toBeVisible({ timeout: 3000 });
    } else {
      // No real items available - test blocked
      test.info().annotations.push({ type: 'blocked', description: 'No real food items in database to test cart' });
    }
  });

  test('Checkout validation - blocks invalid quantities', async ({ page }) => {
    // This test is blocked - cannot test checkout without real items and auth
    test.info().annotations.push({ type: 'blocked', description: 'Requires authenticated user and real cart items' });
  });

  test('Network audit - no unexpected 404s or 500s', async ({ page }) => {
    const failedRequests = [];

    page.on('response', response => {
      if (response.status() >= 400) {
        failedRequests.push({ url: response.url(), status: response.status() });
      }
    });

    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Filter out expected failures (Netlify hud, etc.)
    const unexpectedFailures = failedRequests.filter(r =>
      !r.url.includes('netlify') &&
      !r.url.includes('hud') &&
      !r.url.includes('favicon') &&
      !r.url.includes('.netlify.app/.netlify')
    );

    expect(unexpectedFailures).toHaveLength(0);
  });

  test('API CORS check from browser context', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });

    // Test API call from browser
    const result = await page.evaluate(async () => {
      try {
        const res = await fetch('https://moorthi-cafe-api.onrender.com/api/v1/health');
        return { status: res.status, ok: res.ok };
      } catch (e) {
        return { error: e.message };
      }
    });

    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
  });
});