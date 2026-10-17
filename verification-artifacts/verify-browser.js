const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  const routes = ['/', '/about', '/menu', '/gallery', '/contact', '/admin/login'];
  const viewports = [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
    { name: 'narrow-mobile', width: 360, height: 800 }
  ];

  const results = [];

  for (const route of routes) {
    for (const viewport of viewports) {
      try {
        const page = await context.newPage();
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        // Navigate to route
        const response = await page.goto(`http://localhost:9003${route}`, { waitUntil: 'networkidle' });

        // Wait for meaningful rendered state (adjust based on what's meaningful)
        await page.waitForTimeout(1000);

        // Capture screenshot
        const screenshotPath = `verification-artifacts/screenshots/${route.replace(/^\//, '') || 'home'}-${viewport.width}x${viewport.height}.png`;
        await page.screenshot({ path: screenshotPath });

        // Collect console errors
        const consoleErrors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        // Collect failed network requests
        const failedRequests = [];
        page.on('requestfailed', request => {
          failedRequests.push({
            url: request.url(),
            failure: request.failure()
          });
        });

        // Check for horizontal overflow
        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.body.scrollWidth > document.body.clientWidth;
        });

        // Get computed CSS values for key elements
        const computedStyles = await page.evaluate(() => {
          const root = document.documentElement;
          const style = getComputedStyle(root);
          return {
            primary: style.getPropertyValue('--cafe-primary') || style.getPropertyValue('--primary') || '#C05621',
            secondary: style.getPropertyValue('--cafe-secondary') || style.getPropertyValue('--secondary') || '#2F855A',
            background: style.getPropertyValue('--cafe-background') || style.getPropertyValue('--background') || '#FAF5EF',
            fontPrimary: style.getPropertyValue('--cafe-font-primary') || style.getPropertyValue('--font-primary') || 'Noto Serif',
            fontSecondary: style.getPropertyValue('--cafe-font-secondary') || style.getPropertyValue('--font-secondary') || 'Plus Jakarta Sans'
          };
        });

        results.push({
          route,
          viewport: `${viewport.width}x${viewport.height}`,
          status: response ? response.status() : 'unknown',
          screenshotPath,
          consoleErrors,
          failedRequests,
          hasHorizontalOverflow,
          computedStyles
        });

        await page.close();
      } catch (error) {
        results.push({
          route,
          viewport: `${viewport.width}x${viewport.height}`,
          error: error.message
        });
      }
    }
  }

  await browser.close();

  // Save results to JSON file
  const fs = require('fs');
  fs.writeFileSync('verification-artifacts/results.json', JSON.stringify(results, null, 2));
  console.log('Verification complete. Results saved to verification-artifacts/results.json');
})();