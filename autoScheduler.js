import 'dotenv/config';
import cron from 'node-cron';
import { launchBrowser } from './utils/browser.js';
import { login } from './scripts/login.js';
import { CHECKIN_TIME, CHECKOUT_TIME } from './config/schedule.js';
import { log } from './utils/logger.js';

/**
 * Performs check-in or check-out.
 * @param {'checkin' | 'checkout'} action
 */
async function performCheck(action) {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  try {
    // 1️⃣ Login
    await login(page);

    // 2️⃣ Wait for dashboard
    await page.waitForTimeout(2000);

    const isCheckIn = action === 'checkin';
    const buttonText = isCheckIn ? 'Clock In' : 'Clock Out';

    // 3️⃣ Locate main button and click
    const mainBtn = page.locator(`button:has(span:text("${buttonText}"))`);
    await mainBtn.waitFor({ state: 'visible', timeout: 15000 });
    await mainBtn.click();
    log(`🟢 ${buttonText} clicked!`);

    // 4️⃣ Modal confirmation
    try {
      const modalBtn = page.locator(`div.action-buttons >> button:has-text("${buttonText}")`);
      await modalBtn.waitFor({ state: 'visible', timeout: 10000 });
      await modalBtn.click();
      log(`✅ ${buttonText} confirmed via modal!`);
    } catch {
      log(`⚠️ No ${buttonText} modal appeared.`);
    }

    await page.waitForTimeout(2000);
    log(`✅ ${buttonText} process finished!`);
  } catch (err) {
    log(`❌ Error during ${action}: ${err.message}`);
  } finally {
    await browser.close();
  }
}

// ---------------- Schedule check-in -----------------
cron.schedule(`${CHECKIN_TIME.minute} ${CHECKIN_TIME.hour} * * *`, () => {
  log('🕘 Running scheduled check-in...');
  performCheck('checkin');
});

// ---------------- Schedule check-out -----------------
cron.schedule(`${CHECKOUT_TIME.minute} ${CHECKOUT_TIME.hour} * * *`, () => {
  log('🕕 Running scheduled check-out...');
  performCheck('checkout');
});

log('✅ Auto scheduler started. Waiting for scheduled check-in/out times...');
