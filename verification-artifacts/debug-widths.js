const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  // Focus on the problematic routes and viewports
  const routes = ['/contact'];
  const viewports = [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'narrow-mobile', width: 360, height: 800 },
    { name: 'tablet', width: 768, height: 1024 }
  ];

  for (const route of routes) {
    for (const viewport of viewports) {
      console.log(`Debugging widths for ${route} at ${viewport.name} (${viewport.width}x${viewport.height})`);

      // Launch browser
      const browser = await chromium.launch();
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height }
      });
      const page = await context.newPage();

      try {
        // Navigate and wait for network idle
        await page.goto(`http://localhost:9003${route}`, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(500);

        // Debug specific elements
        const debugInfo = await page.evaluate(() => {
          const getStyles = (el) => {
            if (!el) return null;
            const style = window.getComputedStyle(el);
            return {
              width: style.width,
              maxWidth: style.maxWidth,
              padding: style.paddingLeft + ' ' + style.paddingRight,
              margin: style.marginLeft + ' ' + style.marginRight,
              boxSizing: style.boxSizing,
              offsetWidth: el.offsetWidth,
              clientWidth: el.clientWidth,
              scrollWidth: el.scrollWidth
            };
          };

          const body = document.body;
          const html = document.documentElement;
          const root = document.getElementById('root');
          const siteShell = document.querySelector('.site-shell');
          const pageContainer = document.querySelector('.page-container');
          const contactForm = document.querySelector('.contact-form');

          return {
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            },
            body: getStyles(body),
            html: getStyles(html),
            root: getStyles(root),
            siteShell: getStyles(siteShell),
            pageContainer: getStyles(pageContainer),
            contactForm: getStyles(contactForm)
          };
        });

        console.log(`Debug Info:`, JSON.stringify(debugInfo, null, 2));

        // Save debug results
        const debugDir = path.join(__dirname, 'debug');
        if (!fs.existsSync(debugDir)) {
          fs.mkdirSync(debugDir);
        }

        const debugPath = path.join(debugDir, `${route.replace(/^\//, '')}-${viewport.name}-debug.json`);
        fs.writeFileSync(debugPath, JSON.stringify(debugInfo, null, 2));
        console.log(`Debug saved to ${debugPath}`);

      } catch (error) {
        console.error(`Error debugging ${route} at ${viewport.name}:`, error.message);
      } finally {
        await page.close();
        await context.close();
        await browser.close();
      }
    }
  }
})();