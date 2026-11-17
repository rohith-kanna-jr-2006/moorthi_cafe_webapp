const { test, expect } = require('@playwright/test');
const PRODUCTION_URL = 'https://moorthicafe.netlify.app';

test.describe('JavaScript Runtime Tests', () => {
  test('console errors and jsxDEV check', async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('requestfailed', req => failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
    
    await page.goto(PRODUCTION_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    console.log('Console errors:', consoleErrors);
    console.log('Page errors:', pageErrors);
    console.log('Failed requests:', failedRequests);
    
    const jsxDEVError = consoleErrors.some(e => e.includes('jsxDEV')) || pageErrors.some(e => e.includes('jsxDEV'));
    console.log('jsxDEV error present:', jsxDEVError);
  });

  test('React root verification', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'domcontentloaded' });
    
    const rootChildren = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root ? root.children.length : 0;
    });
    console.log('Root children count:', rootChildren);
    expect(rootChildren).toBeGreaterThan(0);
    
    const hasReactRoot = await page.evaluate(() => {
      const root = document.getElementById('root');
      if (!root) return false;
      return !!root._reactRootContainer || !!root._reactInternals || 
        Array.from(root.children).some(c => c.dataset && Object.keys(c.dataset).some(k => k.startsWith('react')));
    });
    console.log('React root detected:', hasReactRoot);
  });
});