const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  // Arrays to collect console errors and failed requests
  const consoleErrors = [];
  const failedRequests = [];

  // Listen for console events
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Listen for failed requests
  page.on('requestfailed', request => {
    const resourceType = request.resourceType();
    failedRequests.push({
      url: request.url(),
      resourceType: resourceType,
      error: request.failure() ? request.failure().errorText : 'Unknown error'
    });
  });

  // Go to the page and wait until network idle
  await page.goto('http://localhost:9003/about', { waitUntil: 'networkidle' });

  // Capture full page screenshot
  const screenshotBuffer = await page.screenshot({ fullPage: true });
  const screenshotBase64 = screenshotBuffer.toString('base64');

  // Close the browser
  await browser.close();

  // Output the result as JSON
  const result = {
    screenshot: screenshotBase64,
    consoleErrors,
    failedRequests
  };

  console.log(JSON.stringify(result));
})();
