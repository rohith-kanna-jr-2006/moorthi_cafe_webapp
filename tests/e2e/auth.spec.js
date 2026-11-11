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
    // Backend returns: "Invalid credentials. Please verify your login details and password"
    const errorMessage = page.locator('text=/Invalid credentials/');
    await expect(errorMessage).toBeVisible();
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
    await page.click('text=Create an Account');
    await expect(page).toHaveURL('/signup');
    await expect(page.locator('h1')).toHaveText(/Join Hotel New Moorthi Cafe/i);
  });

  test('link from signup to login page works', async ({ page }) => {
    await page.goto('/signup');
    await page.click('text=Sign In to Your Account');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toHaveText(/Customer Sign In|Customer Login/i);
  });
});
