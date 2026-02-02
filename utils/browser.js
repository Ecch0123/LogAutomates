import { chromium } from 'playwright';

export async function launchBrowser() {
  return chromium.launch({
    headless: true, // always headless on server
    args: [
      '--no-sandbox',          // required for Linux containers
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process'
    ]
  });
}
