const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.describe('Google Stitch Admin Dashboard E2E Verification', () => {
  const artifactsDir = path.resolve(__dirname, '../../artifacts/playwright/moorthi-cafe-e2e');

  test.beforeAll(() => {
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }
  });

  test('1. Unauthenticated state displays honest auth prompt', async ({ page }) => {
    await page.goto('/admin/dashboard');
    // Ensure no token in localStorage
    await page.evaluate(() => localStorage.removeItem('moorthi_token'));
    await page.reload();

    const bannerTitle = page.locator('.stitch-banner-title');
    await expect(bannerTitle).toBeVisible();
    await expect(bannerTitle).toContainText('Operations & Kitchen Dashboard');

    const errorCard = page.locator('.stitch-card-panel');
    await expect(errorCard).toContainText('Admin authentication required. Please log in.');

    const signInBtn = page.locator('a.stitch-action-btn.primary', { hasText: 'Sign In as Admin' });
    await expect(signInBtn).toBeVisible();
  });

  test('2. Desktop (1440x900) layout & Stitch fidelity', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Set token BEFORE navigation so API calls are made
    await page.goto('/admin/dashboard');
    await page.evaluate(() => localStorage.setItem('moorthi_token', 'valid-test-admin-jwt'));

    // Mock dashboard API response
    await page.route('**/api/v1/admin/dashboard', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            metrics: {
              businessDate: '18 Nov 2026',
              revenue: { total: 24850, upi: 18400, cash: 6450, card: 0 },
              orders: { total: 142, READY: 118, PREPARING: 18, PLACED: 6, CONFIRMED: 0 },
              activeTokensQueue: { count: 7, lowestToken: 42, highestToken: 48 }
            },
            recentOrders: [
              {
                _id: 'ord_67394801',
                orderId: 'MC-9048',
                dailyTokenNumber: 48,
                customer: { name: 'Karthik Sundaram' },
                pickupType: 'DINE_IN',
                items: [{ name: 'Special Ghee Roast Masala Dosa', quantity: 2 }],
                totalAmount: 290,
                status: 'PENDING',
                createdAt: new Date().toISOString()
              }
            ]
          }
        })
      });
    });

    // Mock sales report API for today (Top Selling)
    await page.route(/.*\/api\/v1\/admin\/reports\/sales\?from=.*&to=.*/, async (route) => {
      const url = new URL(route.request().url());
      const from = url.searchParams.get('from');
      const to = url.searchParams.get('to');

      // Today's report
      if (from === to) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              bestSellers: [
                { name: 'Special Ghee Roast Masala Dosa', quantitySold: 42, revenueGenerated: 5460 },
                { name: 'Degree Filter Coffee', quantitySold: 38, revenueGenerated: 1140 }
              ]
            }
          })
        });
      }
      // 7-day report
      else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              dailyReport: [
                { date: '2026-11-17', sales: 22000 },
                { date: '2026-11-18', sales: 24850 }
              ]
            }
          })
        });
      }
    });

    // Reload to trigger API calls with token
    await page.reload();

    // Verify Brand in Sidebar
    const brandTitle = page.locator('.stitch-brand-title');
    await expect(brandTitle).toHaveText('Moorthi Cafe');

    const brandSubtitle = page.locator('.stitch-brand-subtitle');
    await expect(brandSubtitle).toHaveText('Counter & Kitchen Console');

    // Verify Active Dashboard Link
    const activeNav = page.locator('.stitch-nav-item.active');
    await expect(activeNav).toContainText('Dashboard');

    // Verify Header details
    await expect(page.locator('.stitch-header')).toContainText('Chidambaram Central Counter');
    await expect(page.locator('.stitch-header')).toContainText('Kitchen Online / Active');
    await expect(page.locator('.stitch-header')).toContainText('Shift A (06:00 - 15:00)');
    await expect(page.locator('.stitch-header')).toContainText('S. Ramanathan');

    // Verify KPI Cards
    const kpiCards = page.locator('.stitch-kpi-card');
    await expect(kpiCards).toHaveCount(4);
    await expect(kpiCards.nth(0)).toContainText('₹24,850');
    await expect(kpiCards.nth(0)).toContainText('UPI: ₹18,400');
    await expect(kpiCards.nth(0)).toContainText('Cash: ₹6,450');
    await expect(kpiCards.nth(0)).toContainText('▲');
    await expect(kpiCards.nth(0)).toContainText('13% vs prev day');

    await expect(kpiCards.nth(1)).toContainText('142 Orders');
    await expect(kpiCards.nth(1)).toContainText('118 Ready');
    await expect(kpiCards.nth(1)).toContainText('18 Prep');

    await expect(kpiCards.nth(2)).toContainText('Token #42 - #48');
    await expect(kpiCards.nth(3)).toContainText('No Telemetry');

    // Verify Recent Orders Table
    const tableRows = page.locator('.stitch-orders-table tbody tr');
    await expect(tableRows).toHaveCount(1);
    await expect(tableRows.nth(0)).toContainText('#48');
    await expect(tableRows.nth(0)).toContainText('Karthik Sundaram');
    await expect(tableRows.nth(0)).toContainText('Pending');

    // Verify Side Panels
    await expect(page.locator('.stitch-card-panel', { hasText: 'Top Selling Today' })).toBeVisible();
    await expect(page.locator('.stitch-card-panel', { hasText: 'Kitchen Station Load' })).toBeVisible();

    // Verify Kitchen Station Load shows No Telemetry (honest state, not fake data)
    await expect(page.locator('.stitch-card-panel', { hasText: 'Kitchen Station Load' })).toBeVisible();
    await expect(page.locator('.stitch-card-panel', { hasText: 'No Telemetry' })).toBeVisible();
    await expect(page.locator('.stitch-card-panel', { hasText: 'Station telemetry unavailable' })).toBeVisible();

    // Verify Inventory card shows No Telemetry
    await expect(page.locator('.stitch-kpi-value', { hasText: 'No Telemetry' })).toHaveCount(1);

    // Verify no Emergency Pause button exists
    const pauseBtn = page.locator('button.stitch-action-btn', { hasText: 'Emergency Kitchen Pause' });
    await expect(pauseBtn).not.toBeAttached();

    // Capture desktop screenshot
    await page.screenshot({
      path: path.join(artifactsDir, 'stitch-dashboard-desktop-1440x900.png'),
      fullPage: true
    });
  });

  test('3. Tablet (768x1024) layout & sidebar drawer', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/admin/dashboard');
    await page.evaluate(() => localStorage.setItem('moorthi_token', 'valid-test-admin-jwt'));

    await page.route('**/api/v1/admin/dashboard', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            metrics: {
              revenue: { total: 15200, upi: 11000, cash: 4200, card: 0 },
              orders: { total: 80, READY: 65, PREPARING: 10, PLACED: 5 },
              activeTokensQueue: { count: 4, lowestToken: 20, highestToken: 24 }
            },
            recentOrders: []
          }
        })
      });
    });

    // Mock sales reports for tablet
    await page.route(/.*\/api\/v1\/admin\/reports\/sales\?from=.*&to=.*/, async (route) => {
      const url = new URL(route.request().url());
      const from = url.searchParams.get('from');
      const to = url.searchParams.get('to');

      if (from === to) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { bestSellers: [], dailyReport: [] }
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { dailyReport: [] }
          })
        });
      }
    });

    await page.reload();

    // Mobile toggle should be visible
    const mobileToggle = page.locator('.stitch-mobile-toggle');
    await expect(mobileToggle).toBeVisible();

    // Sidebar should be off-canvas initially
    const sidebar = page.locator('.stitch-sidebar');
    await expect(sidebar).not.toHaveClass(/open/);

    // Open drawer
    await mobileToggle.click();
    await expect(sidebar).toHaveClass(/open/);

    // Backdrop should appear
    const backdrop = page.locator('.stitch-sidebar-backdrop');
    await expect(backdrop).toBeVisible();

    // Close drawer by clicking backdrop
    await backdrop.click();
    await expect(sidebar).not.toHaveClass(/open/);

    // Capture tablet screenshot
    await page.screenshot({
      path: path.join(artifactsDir, 'stitch-dashboard-tablet-768x1024.png'),
      fullPage: true
    });
  });

  test('4. Mobile (375x812) layout & responsive grid', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/admin/dashboard');
    await page.evaluate(() => localStorage.setItem('moorthi_token', 'valid-test-admin-jwt'));

    await page.route('**/api/v1/admin/dashboard', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            metrics: {
              revenue: { total: 9500, upi: 7000, cash: 2500, card: 0 },
              orders: { total: 45, READY: 35, PREPARING: 7, PLACED: 3 },
              activeTokensQueue: { count: 3, lowestToken: 12, highestToken: 15 }
            },
            recentOrders: []
          }
        })
      });
    });

    // Mock sales reports for mobile
    await page.route(/.*\/api\/v1\/admin\/reports\/sales\?from=.*&to=.*/, async (route) => {
      const url = new URL(route.request().url());
      const from = url.searchParams.get('from');
      const to = url.searchParams.get('to');

      if (from === to) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { bestSellers: [], dailyReport: [] }
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { dailyReport: [] }
          })
        });
      }
    });

    await page.reload();

    // Banner and KPI cards should be stacked
    const kpiCards = page.locator('.stitch-kpi-card');
    await expect(kpiCards).toHaveCount(4);

    // Verify horizontal overflow is absent
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // allowance for subpixel rendering

    // Capture mobile screenshot
    await page.screenshot({
      path: path.join(artifactsDir, 'stitch-dashboard-mobile-375x812.png'),
      fullPage: true
    });
  });
});
