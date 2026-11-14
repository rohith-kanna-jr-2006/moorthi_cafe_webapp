const { test, expect } = require('@playwright/test');

const PRODUCTION_API = 'https://moorthi-cafe-api.onrender.com/api/v1';

function getAPIBaseURL() {
  const url = process.env.API_BASE_URL;
  if (url) {
    // Normalize trailing slashes
    return url.replace(/\/+$/, '');
  }
  // Local fallback only - never production
  return 'http://127.0.0.1:5000/api/v1';
}

function validateAPIURL() {
  const apiURL = getAPIBaseURL();

  if (apiURL.includes('moorthi-cafe-api.onrender.com') || apiURL === PRODUCTION_API) {
    throw new Error(`[Backend API Test Guard] Refusing to run against production API: ${apiURL}`);
  }

  console.log('[Backend API Test Guard] ✅ API URL validated');
  console.log(`  API: ${apiURL}`);
}

// Validate before any tests run
validateAPIURL();

const API_BASE = getAPIBaseURL();

test.describe('Backend API Tests', () => {
  test('health', async ({ page }) => {
    const r = await page.request.get(`${API_BASE}/health`);
    console.log('Health:', r.status(), await r.text());
    expect(r.status()).toBe(200);
  });
  test('categories', async ({ page }) => {
    const r = await page.request.get(`${API_BASE}/categories`);
    const b = await r.json();
    console.log('Categories:', r.status(), Array.isArray(b) ? b.length : b);
    expect(r.status()).toBe(200);
  });
  test('foods', async ({ page }) => {
    const r = await page.request.get(`${API_BASE}/foods?limit=6`);
    const b = await r.json();
    console.log('Foods:', r.status(), Array.isArray(b) ? b.length : b);
    expect(r.status()).toBe(200);
  });
});