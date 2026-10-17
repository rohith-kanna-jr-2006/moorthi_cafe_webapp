const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  // Focus on the problematic routes and viewports
  const routes = ['/contact'];
  const viewports = [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'narrow-mobile', width: 360, height: 800 }
  ];

  for (const route of routes) {
    for (const viewport of viewports) {
      console.log(`Investigating ${route} at ${viewport.name} (${viewport.width}x${viewport.height})`);

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

        // Get detailed overflow information
        const overflowInfo = await page.evaluate(() => {
          const body = document.body;
          const html = document.documentElement;

          return {
            bodyScrollWidth: body.scrollWidth,
            bodyClientWidth: body.clientWidth,
            htmlScrollWidth: html.scrollWidth,
            htmlClientWidth: html.clientWidth,
            overflowX: window.getComputedStyle(body).overflowX,
            widthExceeds: body.scrollWidth > body.clientWidth
          };
        });

        // Find elements causing overflow
        const overflowingElements = await page.evaluate(() => {
          const elements = [];
          const walk = (node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const style = window.getComputedStyle(node);
              if (node.scrollWidth > node.clientWidth &&
                  (style.position === 'static' ||
                   style.position === 'relative' ||
                   style.position === '')) {
                elements.push({
                  tag: node.tagName,
                  id: node.id,
                  className: node.className,
                  scrollWidth: node.scrollWidth,
                  clientWidth: node.clientWidth,
                  overflow: style.overflow,
                  width: style.width,
                  maxWidth: style.maxWidth,
                  padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
                  margin: `${style.marginTop} ${style.marginRight} ${style.marginBottom} ${style.marginLeft}`
                });
              }
            }
            node = node.firstChild;
            while (node) {
              walk(node);
              node = node.nextSibling;
            }
          };
          walk(document.body);
          return elements.slice(0, 10); // Limit to first 10
        });

        console.log(`Overflow Info:`, JSON.stringify(overflowInfo, null, 2));
        console.log(`Overflowing Elements:`, JSON.stringify(overflowingElements, null, 2));

        // Save investigation results
        const investigationDir = path.join(__dirname, 'investigation');
        if (!fs.existsSync(investigationDir)) {
          fs.mkdirSync(investigationDir);
        }

        const investigationResult = {
          route,
          viewport: `${viewport.width}x${viewport.height}`,
          viewportName: viewport.name,
          overflowInfo,
          overflowingElements,
          timestamp: new Date().toISOString()
        };

        const investigationPath = path.join(investigationDir, `${route.replace(/^\//, '')}-${viewport.name}-investigation.json`);
        fs.writeFileSync(investigationPath, JSON.stringify(investigationResult, null, 2));
        console.log(`Investigation saved to ${investigationPath}`);

      } catch (error) {
        console.error(`Error investigating ${route} at ${viewport.name}:`, error.message);
      } finally {
        await page.close();
        await context.close();
        await browser.close();
      }
    }
  }
})();