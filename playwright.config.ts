import dotenv from 'dotenv';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  /* CI : définir BASE_URL dans GitHub Actions secrets (voir README). */

  /* Attribut test-id détecté au crawl : data-test → getByTestId() */

  testDir: './tests',
  globalSetup: require.resolve('./global-setup.ts'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ["list"],
    ["allure-playwright"],
    ['junit', { outputFile: 'playwright-report/junit.xml' }],
    ['json', { outputFile: 'playwright-report/report.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? "https://www.saucedemo.com",
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    storageState: 'playwright/.auth/user.json',
    testIdAttribute: "data-test",
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
