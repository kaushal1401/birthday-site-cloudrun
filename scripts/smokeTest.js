#!/usr/bin/env node

/**
 * Smoke Test Script for Birthday Site
 * Runs basic health checks on the application
 */

const puppeteer = require('puppeteer');

async function runSmokeTests() {
  console.log('🎂 Starting Birthday Site Smoke Tests...\n');
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Test 1: Page Load
    console.log('Test 1: Page Load');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    const title = await page.title();
    console.log(`✅ Page loaded successfully. Title: ${title}\n`);
    
    // Test 2: Main Content
    console.log('Test 2: Main Content');
    const mainTitle = await page.$eval('h1', el => el.textContent);
    if (mainTitle.includes('Birthday')) {
      console.log('✅ Main title found\n');
    } else {
      throw new Error('Main title not found');
    }
    
    // Test 3: Event Details
    console.log('Test 3: Event Details');
    const venueText = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).find(el => 
        el.textContent.includes('Mythri Banquet Hall')
      )?.textContent;
    });
    
    if (venueText) {
      console.log('✅ Event details found\n');
    } else {
      throw new Error('Event details not found');
    }
    
    // Test 4: Admin Button
    console.log('Test 4: Admin Button');
    const adminButton = await page.$('[aria-label="admin"]');
    if (adminButton) {
      console.log('✅ Admin button found\n');
      
      // Test button click
      await adminButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Admin button clickable\n');
    } else {
      throw new Error('Admin button not found');
    }
    
    // Test 5: Responsive Design (Mobile)
    console.log('Test 5: Mobile Responsiveness');
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    const mobileTitle = await page.$eval('h1', el => el.textContent);
    if (mobileTitle.includes('Birthday')) {
      console.log('✅ Mobile view works\n');
    }
    
    console.log('🎉 All smoke tests passed!');
    
  } catch (error) {
    console.error('❌ Smoke test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Check if running directly
if (require.main === module) {
  runSmokeTests().catch(console.error);
}

module.exports = { runSmokeTests };
