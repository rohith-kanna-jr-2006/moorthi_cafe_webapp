const { test, expect } = require('@playwright/test');
const PRODUCTION_URL = 'https://moorthicafe.netlify.app';

test.describe('Image Asset Tests', () => {
  const images = [
    { path: '/images/menu/dosa.jpg', type: 'image/jpeg' },
    { path: '/images/menu/pepper-chicken.jpg', type: 'image/jpeg' },
    { path: '/images/menu/kal-dosa.svg', type: 'image/svg+xml' },
    { path: '/images/menu/veg-pulao.svg', type: 'image/svg+xml' }
  ];

  for (const img of images) {
    test('direct image: ' + img.path, async ({ page }) => {
      const response = await page.request.get(PRODUCTION_URL + img.path);
      console.log(img.path, 'Status:', response.status(), 'Content-Type:', response.headers()['content-type'], 'Size:', response.headers()['content-length']);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain(img.type);
      expect(response.headers()['content-type']).not.toContain('text/html');
      const body = await response.body();
      expect(body.length).toBeGreaterThan(0);
    });
  }

  test('inspect img elements on homepage', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
        alt: img.alt
      }));
    });
    
    console.log('All img elements:', JSON.stringify(images, null, 2));
    
    const brokenImages = images.filter(img => !img.complete || img.naturalWidth === 0);
    console.log('Broken images:', brokenImages);
    if (brokenImages.length > 0) {
      console.log('BROKEN IMAGE PATHS:', brokenImages.map(i => i.src));
    }
  });
});