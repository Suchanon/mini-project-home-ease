/* eslint-disable @typescript-eslint/no-require-imports */
const { test, expect } = require('@playwright/test');

test.describe('HomeEase Booking Redirect Flows', () => {
  test('should redirect unauthenticated user to login and then back to booking page with service_id', async ({ page }) => {
    // 1. Go to the homepage
    console.log('🌐 Navigating to HomeEase Homepage...');
    await page.goto('http://localhost:3000/');

    // 2. Wait for a service card to be visible
    console.log('⏳ Waiting for service cards to load...');
    await page.waitForSelector('text=Book Now');

    // 3. Find the first "Book Now" button/link and get its service_id from the href
    const firstBookNowLink = page.locator('a:has-text("Book Now")').first();
    const href = await firstBookNowLink.getAttribute('href');
    console.log(`🔗 Found first booking link: ${href}`);
    
    // Extract service_id from the href (e.g., /bookings/create?service_id=1)
    const match = href.match(/service_id=(\d+)/);
    const serviceId = match ? match[1] : null;
    expect(serviceId).not.toBeNull();
    console.log(`🎯 Target service ID: ${serviceId}`);

    // 4. Click the "Book Now" link and wait for the redirect
    console.log('🖱️ Clicking "Book Now" link...');
    await Promise.all([
      page.waitForURL(url => url.pathname === '/login', { timeout: 5000 }),
      firstBookNowLink.click()
    ]);

    // 5. Verify redirect URL contains the correct redirect parameter with service_id
    const currentUrl = page.url();
    console.log(`✅ Redirected to: ${currentUrl}`);
    expect(currentUrl).toContain(`redirect=%2Fbookings%2Fcreate%3Fservice_id%3D${serviceId}`);

    // 6. Fill login details
    console.log('✍️ Filling credentials for alex@homeease.test...');
    await page.fill('input[name="email"]', 'alex@homeease.test');
    await page.fill('input[name="password"]', 'password123');

    // 7. Click Sign In and wait for redirect back to booking page
    console.log('🖱️ Clicking Sign In button...');
    await Promise.all([
      page.waitForURL(url => url.pathname === '/bookings/create' && url.searchParams.get('service_id') === serviceId, { timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);

    // 8. Verify the booking creation form is visible
    console.log(`🎉 Arrived at booking creation page. URL: ${page.url()}`);
    await expect(page.locator('h1')).toHaveText('Book Home Service');
    
    // Verify steps indicator is showing
    await expect(page.locator('text=Select Provider')).toBeVisible();
    await expect(page.locator('text=Schedule & Details')).toBeVisible();
  });
});
