import 'dotenv/config';
import { launchBrowser } from '../utils/browser.js';
import { login } from './login.js';
import { log } from '../utils/logger.js';

(async () => {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  // 1️⃣ Login first
  await login(page);

  // 2️⃣ Short delay to let dashboard render
  await page.waitForTimeout(10000);

  // 3️⃣ Locate the main Clock Out button
  const checkoutBtn = page.locator('button:has(span:text("Clock Out"))');

  await checkoutBtn.waitFor({ state: 'visible', timeout: 15000 });
  await checkoutBtn.highlight();
  await checkoutBtn.click();
  log('🔴 Main Clock Out clicked!');

  // 4️⃣ Wait for confirmation modal
  await page.waitForTimeout(5000);

  try {
    const modalConfirmBtn = page.locator('div.action-buttons >> button:has-text("Clock Out")');
    await modalConfirmBtn.waitFor({ state: 'visible', timeout: 10000 });
    await modalConfirmBtn.highlight();
    await modalConfirmBtn.click();
    log('✅ Clock Out confirmed via modal!');
  } catch {
    log('⚠️ No modal appeared, skipping confirmation...');
  }

  // 5️⃣ Optional wait to ensure action completes
  await page.waitForTimeout(3000);

  await browser.close();
  log('✅ Check-out process finished!');
})();
