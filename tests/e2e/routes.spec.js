const { test, expect } = require('@playwright/test');

test.describe('Public Route Rendering', () => {
  const routes = [
    { path: '/', titleKeyword: 'Hotel New Moorthi Cafe' },
    { path: '/about', titleKeyword: 'Hotel New Moorthi Cafe' },
    { path: '/menu', titleKeyword: 'Hotel New Moorthi Cafe' },
    { path: '/gallery', titleKeyword: 'Hotel New Moorthi Cafe' },
    { path: '/contact', titleKeyword: 'Hotel New Moorthi Cafe' },
    { path: '/login', titleKeyword: 'Hotel New Moorthi Cafe' },
    { path: '/signup', titleKeyword: 'Hotel New Moorthi Cafe' },
    { path: '/admin/login', titleKeyword: 'Hotel New Moorthi Cafe' },
  ];

  for (const r of routes) {
    test(`renders route ${r.path} with status 200`, async ({ page }) => {
      const response = await page.goto(r.path, { waitUntil: 'domcontentloaded' });
      expect(response).not.toBeNull();
      expect(response.status()).toBe(200);
      const title = await page.title();
      expect(title).toContain(r.titleKeyword);
    });
  }
});

test.describe('Navigation Links', () => {
  test('navbar contains all expected navigation items', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const links = page.locator('.navbar a');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(7);
  });
});
