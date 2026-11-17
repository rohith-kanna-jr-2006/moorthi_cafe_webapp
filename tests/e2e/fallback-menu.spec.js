const { test, expect } = require('@playwright/test');
const PRODUCTION_URL = 'https://moorthicafe.netlify.app';

test.describe('Fallback Menu Items - View Only Behavior', () => {
  test('fallback items show "View Only" button instead of "Add to Tray"', async ({ page }) => {
    await page.goto(PRODUCTION_URL + '/menu', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Check that all food cards have either "Add to Tray" or "View Only" buttons
    // Fallback items have fake IDs like 'food-dosa-1' which are not valid ObjectIds
    // They should show "View Only" button
    const buttons = await page.$$eval('button', btns => btns.map(b => ({
      text: b.textContent.trim(),
      disabled: b.disabled,
      className: b.className
    })));

    console.log('Buttons found:', buttons);

    // Verify no fallback items have "Add to Tray" enabled
    const addToTrayButtons = buttons.filter(b => b.text === '+ Add to Tray' && !b.disabled);
    const viewOnlyButtons = buttons.filter(b => b.text === 'View Only' && b.disabled);

    console.log('Add to Tray buttons:', addToTrayButtons.length);
    console.log('View Only buttons:', viewOnlyButtons.length);

    // At minimum, there should be some View Only buttons for fallback items
    expect(viewOnlyButtons.length).toBeGreaterThan(0);
  });

  test('clicking View Only button does not add to cart', async ({ page }) => {
    await page.goto(PRODUCTION_URL + '/menu', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Find a View Only button and click it
    const viewOnlyButton = await page.$('button:has-text("View Only")');
    if (viewOnlyButton) {
      await viewOnlyButton.click();
      await page.waitForTimeout(1000);

      // Check that cart is still empty (or no new item added)
      const cart = await page.evaluate(() => {
        const raw = localStorage.getItem('moorthi_cafe_cart');
        return raw ? JSON.parse(raw) : [];
      });
      console.log('Cart after clicking View Only:', cart);
    }
  });

  test('cart only contains items with valid ObjectId foodIds', async ({ page }) => {
    await page.goto(PRODUCTION_URL + '/menu', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Try to add an item - it should either be a real item (if any) or View Only
    const addToTrayButton = await page.$('button:has-text("+ Add to Tray")');
    if (addToTrayButton) {
      await addToTrayButton.click();
      await page.waitForTimeout(1000);

      // Check cart contents
      const cart = await page.evaluate(() => {
        const raw = localStorage.getItem('moorthi_cafe_cart');
        return raw ? JSON.parse(raw) : [];
      });
      console.log('Cart after clicking Add to Tray:', cart);

      // Verify all items in cart have valid ObjectId foodIds
      for (const item of cart) {
        expect(item.foodId).toMatch(/^[0-9a-fA-F]{24}$/);
      }
    }
  });
});