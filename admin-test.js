const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  await page.goto('http://localhost:9003/admin/login');
  await page.waitForLoadState('networkidle');
  const screenshotBuffer = await page.screenshot({ fullPage: true });
  const base64 = screenshotBuffer.toString('base64');
  console.log('SCREENSHOT_START');
  console.log(base64);
  console.log('SCREENSHOT_END');
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  const failedRequests = [];
  page.on('requestfailed', request => {
    failedRequests.push(request.url());
  });
  // Wait a bit to capture events
  await new Promise(r => setTimeout(r, 1000));
  console.log('CONSOLE_ERRORS:' + JSON.stringify(errors));
  console.log('FAILED_REQUESTS:' + JSON.stringify(failedRequests));
  await browser.close();
})();