import 'dotenv/config';
import { chromium } from 'playwright';
import { log } from '../utils/logger.js';

console.log('SSO URL:', process.env.SSO_LOGIN_URL);
console.log('USERNAME:', process.env.MY_USERNAME);
console.log('PASSWORD:', process.env.PASSWORD ? '***' : 'MISSING');


(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const page = await browser.newPage();

  log('Opening SSO login page...');
  console.log('SSO URL:', process.env.SSO_LOGIN_URL);

  await page.goto(process.env.SSO_LOGIN_URL, { waitUntil: 'networkidle' });

  // wait for username input
  await page.waitForSelector('input[name="username"]', { timeout: 15000 });
  await page.fill('input[name="username"]', process.env.MY_USERNAME);
  await page.fill('input[name="password"]', process.env.PASSWORD);

  // Highlight and click the login button
const submitBtn = page.locator('#kc-login');
await submitBtn.waitFor({ state: 'visible', timeout: 15000 });
await submitBtn.highlight(); // optional for debugging
await submitBtn.click();


  // Wait for dashboard redirect
  await page.waitForURL(process.env.DASHBOARD_URL, { timeout: 30000 });
  log('✅ Login successful!');

  // Keep browser open for inspection
  // await browser.close();
})();
