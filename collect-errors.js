const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({
        text: msg.text(),
        args: msg.args().map(a => a.toString()),
        location: msg.location()
      });
    }
  });

  // Collect failed network requests
  const failedRequests = [];
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

  await page.goto('http://localhost:9003/', { waitUntil: 'load', timeout: 20000 });

  // Output results as JSON
  const result = {
    consoleErrors,
    failedRequests
  };
  console.log(JSON.stringify(result));

  await browser.close();
})();
