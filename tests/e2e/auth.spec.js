const { test, expect } = require('@playwright/test');

test.describe('Authentication Form Validation', () => {
  test('login form validates required identifier field', async ({ page }) => {
    await page.goto('/login');
    const identifierInput = page.locator('#identifier');
    await expect(identifierInput).toHaveAttribute('required', '');
  });

  test('login form validates required password field', async ({ page }) => {
    await page.goto('/login');
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('login form shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#identifier', 'nonexistent@example.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type=submit]');
    const errorAlert = page.locator('.alert');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Invalid credentials');
  });

  test('signup form validates required name field', async ({ page }) => {
    await page.goto('/signup');
    const nameInput = page.locator('#name');
    await expect(nameInput).toHaveAttribute('required', '');
  });

  test('signup form validates required email field', async ({ page }) => {
    await page.goto('/signup');
    const emailInput = page.locator('#email');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('signup form validates required phone field', async ({ page }) => {
    await page.goto('/signup');
    const phoneInput = page.locator('#phone');
    await expect(phoneInput).toHaveAttribute('required', '');
  });

  test('signup form validates required password field', async ({ page }) => {
    await page.goto('/signup');
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('link from login to signup page works', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Sign Up');
    await expect(page).toHaveURL('/signup');
    await expect(page.locator('h1')).toHaveText(/Join Hotel New Moorthi Cafe/i);
  });

  test('link from signup to login page works', async ({ page }) => {
    await page.goto('/signup');
    await page.click('text=Already have an account? Login');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toHaveText(/Customer Login/i);
  });
});