const { test, expect } = require('@playwright/test');
const PRODUCTION_URL = 'https://moorthicafe.netlify.app';
const BACKEND_URL = 'https://moorthi-cafe-api.onrender.com/api/v1';

test.describe('CORS Test', () => {
  test('CORS from Netlify origin', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'domcontentloaded' });
    const corsResult = await page.evaluate(async (url) => {
      try {
        const r = await fetch(url + '/health', { mode: 'cors' });
        return { status: r.status, ok: r.ok, headers: Object.fromEntries(r.headers.entries()) };
      } catch (e) {
        return { error: e.message, name: e.name };
      }
    }, BACKEND_URL);
    console.log('CORS Result:', JSON.stringify(corsResult, null, 2));
  });
});