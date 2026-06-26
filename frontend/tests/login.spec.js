const { test, expect } = require('@playwright/test');

test.describe('HomeEase Login Flow', () => {
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
});
