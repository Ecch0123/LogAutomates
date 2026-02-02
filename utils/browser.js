import { chromium } from 'playwright';

export async function launchBrowser() {
  return chromium.launch({
    headless: false,   // change to true later
    slowMo: 200
  });
}
