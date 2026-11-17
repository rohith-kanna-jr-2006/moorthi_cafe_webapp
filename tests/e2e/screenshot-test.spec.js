const { test, expect } = require('@playwright/test');
const PRODUCTION_URL = 'https://moorthicafe.netlify.app';
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, '..', '..', 'test-results');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

test.describe('Screenshot Tests', () => {
  test('desktop 1366x768', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto(PRODUCTION_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotDir, 'production-desktop-1366x768.png'), fullPage: true });
    console.log('Desktop screenshot saved');
  });

  test('tablet 768x1024', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(PRODUCTION_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotDir, 'production-tablet-768x1024.png'), fullPage: true });
    console.log('Tablet screenshot saved');
  });

  test('mobile 390x844', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PRODUCTION_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotDir, 'production-mobile-390x844.png'), fullPage: true });
    console.log('Mobile screenshot saved');
  });
});