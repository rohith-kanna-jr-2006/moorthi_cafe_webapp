const { test, expect } = require('@playwright/test');

test.describe('Responsive Layout & Overflow', () => {
  const viewports = [
    { width: 320, height: 700, name: '320x700' },
    { width: 375, height: 812, name: '375x812' },
    { width: 390, height: 844, name: '390x844' },
    { width: 1366, height: 768, name: '1366x768' },
  ];

  for (const vp of viewports) {
    test(`no horizontal overflow at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const isOverflowing = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(isOverflowing).toBe(false);
    });
  }
});
