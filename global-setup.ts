import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { chromium } from '@playwright/test';
import { LoginPage } from './pages/login.page';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const authFile = path.resolve(__dirname, "playwright/.auth/user.json");
const baseURL = process.env.BASE_URL ?? "https://www.saucedemo.com";

const LOGIN_PATH = /\/login|signin|sign-in|auth(\/|$)/i;

async function globalSetup(): Promise<void> {
  const username = process.env.TEST_USER_EMAIL?.trim();
  const password = process.env.TEST_USER_PASSWORD?.trim();

  if (!username || !password) {
    if (fs.existsSync(authFile)) {
      // eslint-disable-next-line no-console
      console.log('[global-setup] TEST_USER_* vides — réutilisation de playwright/.auth/user.json');
      return;
    }
    throw new Error(
      'Missing TEST_USER_EMAIL / TEST_USER_PASSWORD in .env and no playwright/.auth/user.json seed. ' +
        'Regenerate the zip with Session Capture so Doctest pre-fills .env, or set credentials manually.',
    );
  }

  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.authenticate(username, password);

    await page.waitForURL(
      (url) => !LOGIN_PATH.test(new URL(url).pathname),
      { timeout: 30_000 },
    );

    await context.storageState({ path: authFile });
    // eslint-disable-next-line no-console
    console.log('[global-setup] Session rafraîchie → playwright/.auth/user.json');
  } finally {
    await browser.close();
  }
}

export default globalSetup;
