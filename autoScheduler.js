import 'dotenv/config';
import cron from 'node-cron';
import { launchBrowser } from './utils/browser.js';
import { login } from './scripts/login.js';
import { CHECKIN_TIME, CHECKOUT_TIME } from './config/schedule.js';
import { log } from './utils/logger.js';

async function performCheck(action) {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  // 1️⃣ Login first
  await login(page);

  // 2️⃣ Short delay to let dashboard render
  await page.waitForTimeout(2000);

  const isCheckIn = action === 'checkin';
  const buttonText = isCheckIn ? 'Clock In' : 'Clock Out';

  // 3️⃣ Locate main button
  const mainBtn = page.locator(`button:has(span:text("${buttonText}"))`);
  await mainBtn.waitFor({ state: 'visible', timeout: 15000 });
  await mainBtn.highlight();
  await mainBtn.click();
  log(`🟢 Main ${buttonText} clicked!`);

  // 4️⃣ Wait for modal confirmation
  await page.waitForTimeout(1000);
  try {
    const modalBtn = page.locator(`div.action-buttons >> button:has-text("${buttonText}")`);
    await modalBtn.waitFor({ state: 'visible', timeout: 10000 });
    await modalBtn.highlight();
    await modalBtn.click();
    log(`✅ ${buttonText} confirmed via modal!`);
  } catch {
    log(`⚠️ No ${buttonText} modal appeared, skipping confirmation...`);
  }

  // 5️⃣ Short wait to ensure action completes
  await page.waitForTimeout(2000);

  await browser.close();
  log(`✅ ${buttonText} process finished!`);
}

// ----------------- Schedule check-in -----------------
cron.schedule(`${CHECKIN_TIME.minute} ${CHECKIN_TIME.hour} * * *`, () => {
  log('🕘 Running scheduled check-in...');
  performCheck('checkin');
});

// ----------------- Schedule check-out -----------------
cron.schedule(`${CHECKOUT_TIME.minute} ${CHECKOUT_TIME.hour} * * *`, () => {
  log('🕕 Running scheduled check-out...');
  performCheck('checkout');
});

log('✅ Auto scheduler started. Waiting for scheduled check-in/out times...');
