const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  const consoleMsgs = [];
  const failedReqs = [];
  page.on('console', msg => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('requestfailed', req => failedReqs.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`));
  page.on('response', resp => {
    if (resp.status() >= 400) failedReqs.push(`HTTP ${resp.status()} ${resp.url()}`);
  });

  const url = 'https://moorthi-cafe-webapp-v2-cfgpo1rb7-rohith-kanna-jr-2006s-projects.vercel.app/?_vercel_share=fSlSjBs3bT3tLsqUJBY9SuQrx2Stt0zI';
  const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const title = await page.title();
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 3000));

  await page.screenshot({ path: 'qa_home.png', fullPage: true });

  console.log('=== HTTP STATUS ===');
  console.log(resp?.status());
  console.log('=== FINAL URL ===');
  console.log(page.url());
  console.log('=== PAGE TITLE ===');
  console.log(title);
  console.log('=== BODY TEXT (first 3000 chars) ===');
  console.log(bodyText);
  console.log('=== CONSOLE MESSAGES ===');
  console.log(consoleMsgs.join('\n'));
  console.log('=== FAILED/ERROR RESPONSES ===');
  console.log(failedReqs.join('\n'));

  await browser.close();
})();