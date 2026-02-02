import 'dotenv/config';
import { log } from '../utils/logger.js';

export async function login(page) {
  log('Opening SSO login page...');
  console.log('SSO URL:', process.env.SSO_LOGIN_URL);
  console.log('USERNAME:', process.env.MY_USERNAME);
  console.log('PASSWORD:', process.env.PASSWORD ? '***' : 'MISSING');

  await page.goto(process.env.SSO_LOGIN_URL, {
    waitUntil: 'networkidle'
  });

  // wait for username input
  await page.waitForSelector('input[name="username"]', { timeout: 15000 });
  await page.fill('input[name="username"]', process.env.MY_USERNAME);
  await page.fill('input[name="password"]', process.env.PASSWORD);

  // Click the login button
  const submitBtn = page.locator('#kc-login');
  await submitBtn.waitFor({ state: 'visible', timeout: 15000 });
  await submitBtn.highlight(); // optional for debugging
  await submitBtn.click();

  // Wait for dashboard redirect
  log('Waiting for dashboard redirect...');
  await page.waitForURL(process.env.DASHBOARD_URL, { timeout: 30000 });
  log('✅ Login successful!');
}
