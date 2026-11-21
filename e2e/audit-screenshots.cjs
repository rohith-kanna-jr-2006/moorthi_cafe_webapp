// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:9004';
const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots/audit-before');

// Viewport configurations
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile-lg', width: 390, height: 844 },
  { name: 'mobile-sm', width: 375, height: 812 },
];

// Pages to screenshot
const PAGES = [
  { route: '/', label: 'Home' },
  { route: '/about', label: 'About' },
  { route: '/menu', label: 'Menu' },
  { route: '/gallery', label: 'Gallery' },
  { route: '/contact', label: 'Contact' },
  { route: '/cart', label: 'Cart' },
  { route: '/checkout', label: 'Checkout' },
  { route: '/login', label: 'Login' },
  { route: '/signup', label: 'Signup' },
  { route: '/forgot-password', label: 'ForgotPassword' },
  { route: '/item-details?id=test-fallback', label: 'ItemDetails' },
  { route: '/payment-details', label: 'PaymentDetails' },
  { route: '/admin/login', label: 'AdminLogin' },
];

async function capturePage(page, route, label) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 15000 });
  // Wait a bit for fonts/images
  await page.waitForTimeout(1000);
}

(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: true });

  // Ensure output dir exists
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      locale: 'en-IN',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36'
    });
    const p = await context.newPage();
    p.setDefaultTimeout(15000);

    for (const pg of PAGES) {
      const safeName = `${vp.name}_${pg.label}`.replace(/[^a-zA-Z0-9_-]/g, '_');
      try {
        await capturePage(p, pg.route, pg.label);
        await p.screenshot({
          path: path.join(SCREENSHOTS_DIR, `${safeName}.png`),
          fullPage: vp.name.includes('mobile') || vp.name.includes('tablet')
        });
        console.log(`✓ ${safeName}`);
      } catch (e) {
        console.error(`✗ ${safeName}: ${e.message.slice(0, 80)}`);
      }
    }
    await context.close();
  }

  await browser.close();
  console.log('\nDone! Screenshots saved to:', SCREENSHOTS_DIR);
})();
