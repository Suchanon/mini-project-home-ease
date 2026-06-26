/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const path = require('path');

async function testLogin() {
  console.log('🚀 Starting Login Flow verification...');
  
  // Launch the browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Navigate to login page
    console.log('🌐 Navigating to http://localhost:3000/login...');
    await page.goto('http://localhost:3000/login');

    // 2. Wait for form elements
    console.log('⏳ Waiting for input fields...');
    await page.waitForSelector('input[name="email"]');
    await page.waitForSelector('input[name="password"]');

    // 3. Fill details
    console.log('✍️ Filling credentials for alex@homeease.test...');
    await page.fill('input[name="email"]', 'alex@homeease.test');
    await page.fill('input[name="password"]', 'password123');

    // 4. Click login
    console.log('🖱️ Clicking Sign In button...');
    await Promise.all([
      page.waitForNavigation({ url: '**/bookings', timeout: 5000 }),
      page.click('button[type="submit"]')
    ]);

    // 5. Verify redirect & cookies
    const currentUrl = page.url();
    console.log(`✅ Navigation finished. Current URL: ${currentUrl}`);

    if (currentUrl.includes('/bookings')) {
      console.log('🎉 SUCCESS: Redirected to /bookings dashboard!');
      
      // Take a screenshot
      const screenshotPath = path.join(__dirname, 'login-success.png');
      await page.screenshot({ path: screenshotPath });
      console.log(`📸 Screenshot saved to: ${screenshotPath}`);
    } else {
      console.log('❌ FAILURE: Was not redirected to /bookings dashboard.');
    }
  } catch (error) {
    console.error('💥 Error during login flow verification:', error);
    
    // Save error screenshot
    const errorScreenshotPath = path.join(__dirname, 'login-error.png');
    await page.screenshot({ path: errorScreenshotPath }).catch(() => {});
    console.log(`📸 Error screenshot saved to: ${errorScreenshotPath}`);
  } finally {
    await browser.close();
    console.log('🏁 Browser closed.');
  }
}

testLogin();
