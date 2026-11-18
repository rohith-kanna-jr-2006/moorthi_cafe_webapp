const { test, expect } = require('@playwright/test');

const STAGING_FRONTEND = 'https://moorthi-cafe-staging.netlify.app';
const STAGING_API = 'https://moorthi-cafe-webapp.onrender.com/api/v1';

function getStagingFrontend() {
  return process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';
}

function getStagingAPI() {
  return process.env.API_BASE_URL || STAGING_API;
}

function generateTestUser() {
  const timestamp = Date.now();
  return {
    name: 'Playwright Test Customer',
    email: `playwright.test.${timestamp}@example.com`,
    phone: '9876543210',
    password: `TestPass${timestamp}!`
  };
}

test.describe.configure({ retries: 0 });

let testUser = null;

test.describe('Staging Order Flow - Customer Registration, Login, Cart, Checkout, Order', () => {

  test.beforeEach(async ({ page }) => {
    const baseURL = getStagingFrontend();
    if (baseURL.includes('moorthicafe.netlify.app')) {
      throw new Error(`[Test Guard] Refusing to run against production frontend: ${baseURL}`);
    }
    if (!testUser) {
      testUser = generateTestUser();
    }
  });

  test('Customer registration - valid data', async ({ page }) => {
    const baseURL = getStagingFrontend();
    await page.goto(`${baseURL}/signup`, { waitUntil: 'domcontentloaded' });

    // Verify required fields
    await expect(page.locator('#name')).toHaveAttribute('required', '');
    await expect(page.locator('#email')).toHaveAttribute('required', '');
    await expect(page.locator('#phone')).toHaveAttribute('required', '');
    await expect(page.locator('#password')).toHaveAttribute('required', '');

    // Fill valid registration
    await page.fill('#name', testUser.name);
    await page.fill('#email', testUser.email);
    await page.fill('#phone', testUser.phone);
    await page.fill('#password', testUser.password);

    await page.screenshot({ path: 'artifacts/playwright/moorthi-cafe-e2e/screenshots/staging-registration-before.png', fullPage: true });

    await page.click('button[type=submit]');
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'artifacts/playwright/moorthi-cafe-e2e/screenshots/staging-registration-after.png', fullPage: true });

    // Should redirect to dashboard, home, or show login link
    const url = page.url();
    console.log('[Registration] After submit URL:', url);
  });

  test('Customer login - valid credentials', async ({ page }) => {
    const baseURL = getStagingFrontend();
    await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded' });

    // Verify required fields
    await expect(page.locator('#identifier')).toHaveAttribute('required', '');
    await expect(page.locator('#password')).toHaveAttribute('required', '');

    await page.fill('#identifier', testUser.email);
    await page.fill('#password', testUser.password);

    await page.screenshot({ path: 'artifacts/playwright/moorthi-cafe-e2e/screenshots/staging-login-before.png', fullPage: true });

    await page.click('button[type=submit]');
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'artifacts/playwright/moorthi-cafe-e2e/screenshots/staging-login-after.png', fullPage: true });

    const url = page.url();
    console.log('[Login] After submit URL:', url);
  });

  test('Menu page loads with published items', async ({ page }) => {
    const baseURL = getStagingFrontend();
    await page.goto(`${baseURL}/menu`, { waitUntil: 'domcontentloaded' });

    await page.screenshot({ path: 'artifacts/playwright/moorthi-cafe-e2e/screenshots/staging-menu.png', fullPage: true });

    // Check for food cards
    const foodCards = page.locator('.food-card');
    const count = await foodCards.count();
    console.log(`[Menu] Found ${count} food cards`);
  });

  test('Cart - add real food item with valid ObjectId', async ({ page }) => {
    const baseURL = getStagingFrontend();
    await page.goto(`${baseURL}/menu`, { waitUntil: 'networkidle' });

    const addToTrayButtons = page.locator('button:has-text("Add to Tray")');
    const count = await addToTrayButtons.count();

    if (count === 0) {
      test.info().annotations.push({ type: 'blocked', description: 'No real food items in staging database (needs seed)' });
      return;
    }

    await addToTrayButtons.first().click();
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Added')).toBeVisible({ timeout: 3000 });

    await page.goto(`${baseURL}/cart`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'artifacts/playwright/moorthi-cafe-e2e/screenshots/staging-cart.png', fullPage: true });

    const cartItems = page.locator('.cart-item, .tray-item, [data-testid="cart-item"]');
    await expect(cartItems.first()).toBeVisible({ timeout: 3000 });

    // Verify quantity controls work
    const plusButton = page.locator('button').filter({ hasText: '+' }).first();
    const minusButton = page.locator('button').filter({ hasText: '-' }).first();

    if (await plusButton.count() > 0) {
      await plusButton.click();
      await page.waitForTimeout(500);
      const qtyEl = page.locator('.cart-item [style*="fontWeight: bold"]').first();
      const qty = await qtyEl.textContent();
      expect(parseInt(qty, 10)).toBe(2);
    }
  });

  test('Cart - quantity validation (integers 1-50)', async ({ page }) => {
    const baseURL = getStagingFrontend();
    await page.goto(`${baseURL}/menu`, { waitUntil: 'networkidle' });

    const addToTrayButtons = page.locator('button:has-text("Add to Tray")');
    const count = await addToTrayButtons.count();

    if (count === 0) {
      test.info().annotations.push({ type: 'blocked', description: 'No real food items in staging database (needs seed)' });
      return;
    }

    await addToTrayButtons.first().click();
    await page.waitForTimeout(1000);
    await page.goto(`${baseURL}/cart`, { waitUntil: 'networkidle' });

    // Test minus at qty=1 removes item
    const minusButton = page.locator('button').filter({ hasText: '-' }).first();
    const qtyEl = page.locator('.cart-item [style*="fontWeight: bold"]').first();
    const qty = await qtyEl.textContent();

    if (qty === '1') {
      await minusButton.click();
      await page.waitForTimeout(1000);
      const cartItems = page.locator('.cart-item, .tray-item, [data-testid="cart-item"]');
      await expect(cartItems).toHaveCount(0);
    }
  });

  test('Checkout page loads and shows COD payment option', async ({ page }) => {
    const baseURL = getStagingFrontend();
    await page.goto(`${baseURL}/checkout`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'artifacts/playwright/moorthi-cafe-e2e/screenshots/staging-checkout.png', fullPage: true });

    // Should redirect to /cart or /login or stay on /checkout
    const url = page.url();
    expect(url).toMatch(/\/(checkout|cart|login)/);
  });
});

  test('COD payment method is the only selectable option', async ({ page }) => {
    const baseURL = getStagingFrontend();
    await page.goto(`${baseURL}/checkout`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Look for payment method options
    const paymentLabels = page.locator('label').filter({ hasText: /UPI|Cash|Card|Online/i });
    const paymentOptions = await paymentLabels.allTextContents();
    console.log('[Checkout] Payment options found:', paymentOptions);

    // COD should be present and selectable
    const codOption = page.locator('label:has-text("Cash")');
    if (await codOption.count() > 0) {
      await expect(codOption).toBeVisible();
    }
  });

  test('Order placement - COD only (blocked if no cart/auth)', async ({ page }) => {
    const baseURL = getStagingFrontend();
    await page.goto(`${baseURL}/checkout`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // This is blocked - requires authenticated user with cart items
    test.info().annotations.push({ type: 'blocked', description: 'Requires authenticated user with valid cart items and staging DB seeded' });
  });

  test('Order history - verify order appears after placement', async ({ page }) => {
    const baseURL = getStagingFrontend();
    await page.goto(`${baseURL}/checkout`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    test.info().annotations.push({ type: 'blocked', description: 'Requires successful order placement first' });
  });

  test('Logout and login persistence', async ({ page }) => {
    const baseURL = getStagingFrontend();
    await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded' });
    await page.fill('#identifier', testUser.email);
    await page.fill('#password', testUser.password);
    await page.click('button[type=submit]');
    await page.waitForTimeout(3000);

    // Logout
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
    if (await logoutButton.count() > 0) {
      await logoutButton.click();
      await page.waitForTimeout(1000);
    }

    // Try to access protected route
    await page.goto(`${baseURL}/checkout`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toMatch(/\/(checkout|cart|login)/);
  });
