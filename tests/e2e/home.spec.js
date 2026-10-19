
const { test, expect } = require('@playwright/test');

test('homepage loads successfully', async ({ page }) => {
  const response = await page.goto('/');

  expect(response, 'The server should return a response').not.toBeNull();
  expect(response.status()).toBeLessThan(400);

  await expect(page.locator('body')).toBeVisible();
});
