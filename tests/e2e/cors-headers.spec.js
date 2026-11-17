const { test, expect } = require('@playwright/test');
const BACKEND_URL = 'https://moorthi-cafe-api.onrender.com/api/v1';

test.describe('CORS Headers Check', () => {
  test('check CORS headers on health endpoint', async ({ page }) => {
    const response = await page.request.get(BACKEND_URL + '/health');
    console.log('Health CORS headers:', response.headers());
  });
  
  test('check CORS headers on categories endpoint', async ({ page }) => {
    const response = await page.request.get(BACKEND_URL + '/categories');
    console.log('Categories CORS headers:', response.headers());
  });
  
  test('check CORS headers on foods endpoint', async ({ page }) => {
    const response = await page.request.get(BACKEND_URL + '/foods?limit=6');
    console.log('Foods CORS headers:', response.headers());
  });
});