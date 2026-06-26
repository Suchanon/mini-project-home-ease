const { test, expect } = require('@playwright/test');

test.describe('HomeEase Auth Flows', () => {
  test('should successfully log in and redirect to bookings page', async ({ page }) => {
    // 1. Go to the login page
    await page.goto('http://localhost:3000/login');

    // 2. Verify page has login header
    await expect(page.locator('h2')).toHaveText('Login to HomeEase');

    // 3. Fill details
    await page.fill('input[name="email"]', 'alex@homeease.test');
    await page.fill('input[name="password"]', 'password123');

    // 4. Click Sign In and wait for redirect
    await page.click('button[type="submit"]');

    // 5. Verify successful redirect
    await expect(page).toHaveURL('http://localhost:3000/bookings', { timeout: 5000 });
  });

  test('should successfully log out and redirect to login page', async ({ page }) => {
    // 1. Login first
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'alex@homeease.test');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/bookings', { timeout: 5000 });

    // 2. Click Logout button in the Navbar
    console.log('🖱️ Clicking Logout button...');
    await page.click('button:has-text("Logout")');

    // 3. Verify redirected to login page
    await expect(page).toHaveURL('http://localhost:3000/login', { timeout: 5000 });

    // 4. Verify login page header is visible
    await expect(page.locator('h2')).toHaveText('Login to HomeEase');
  });
});
