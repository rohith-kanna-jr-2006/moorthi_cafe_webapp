const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

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
      console.log(`Testing ${route} at ${viewport.name} (${viewport.width}x${viewport.height})`);

      // Launch browser for each combination to avoid state issues
      const browser = await chromium.launch();
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height }
      });
      const page = await context.newPage();

      // Arrays to collect errors and failed requests
      const consoleErrors = [];
      const failedRequests = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push({
            text: msg.text(),
            args: msg.args().map(a => a.toString()),
            location: msg.location()
          });
        }
      });

      page.on('requestfailed', request => {
        failedRequests.push({
          url: request.url(),
          method: request.method(),
          resourceType: request.resourceType(),
          error: request.failure() ? request.failure().errorText : null,
          timestamp: new Date().toISOString()
        });
      });

      page.on('response', response => {
        const status = response.status();
        if (status >= 400) {
          const request = response.request();
          failedRequests.push({
            url: request.url(),
            method: request.method(),
            resourceType: request.resourceType(),
            status: status,
            statusText: response.statusText(),
            timestamp: new Date().toISOString()
          });
        }
      });

      try {
        // Navigate and wait for network idle
        await page.goto(`http://localhost:9003${route}`, { waitUntil: 'networkidle', timeout: 30000 });

        // Wait a bit for any animations or dynamic content
        await page.waitForTimeout(500);

        // Check for horizontal overflow
        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.body.scrollWidth > document.body.clientWidth;
        });

        // Get computed CSS values for key design tokens
        const computedStyles = await page.evaluate(() => {
          const root = document.documentElement;
          const style = getComputedStyle(root);
          return {
            '--cafe-primary': style.getPropertyValue('--cafe-primary') || '',
            '--cafe-secondary': style.getPropertyValue('--cafe-secondary') || '',
            '--cafe-background': style.getPropertyValue('--cafe-background') || '',
            '--cafe-font-primary': style.getPropertyValue('--cafe-font-primary') || '',
            '--cafe-font-secondary': style.getPropertyValue('--cafe-font-secondary') || ''
          };
        });

        // Capture screenshot
        const sanitizedRoute = route.replace(/^\//, '') || 'home';
        const screenshotPath = path.join(screenshotsDir, `${sanitizedRoute}-${viewport.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        results.push({
          route,
          viewport: `${viewport.width}x${viewport.height}`,
          viewportName: viewport.name,
          status: 'success',
          screenshotPath,
          consoleErrors,
          failedRequests,
          hasHorizontalOverflow,
          computedStyles
        });

      } catch (error) {
        console.error(`Error testing ${route} at ${viewport.name}:`, error.message);
        results.push({
          route,
          viewport: `${viewport.width}x${viewport.height}`,
          viewportName: viewport.name,
          status: 'error',
          error: error.message
        });
      } finally {
        await page.close();
        await context.close();
        await browser.close();
      }
    }
  }

  // Save results to JSON file
  const resultsPath = path.join(__dirname, 'results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`Verification complete. Results saved to ${resultsPath}`);

  // Also create a summary report
  const summary = {
    totalTests: routes.length * viewports.length,
    passed: results.filter(r => r.status === 'success').length,
    failed: results.filter(r => r.status === 'error').length,
    horizontalOverflowIssues: results.filter(r => r.hasHorizontalOverflow === true).length,
    consoleErrors: results.flatMap(r => r.consoleErrors || []),
    failedRequests: results.flatMap(r => r.failedRequests || [])
  };
  const summaryPath = path.join(__dirname, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`Summary saved to ${summaryPath}`);
})();