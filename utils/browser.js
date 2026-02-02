import { chromium } from 'playwright';

export async function launchBrowser() {
  return chromium.launch({
    headless: true,  // always use headless in server
    args: ['--no-sandbox', '--disable-setuid-sandbox']  // required for Linux servers
  });
}
