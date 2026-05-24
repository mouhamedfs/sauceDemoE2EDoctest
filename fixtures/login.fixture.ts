import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

/**
 * Fixture login — contexte **sans** session (storageState vide).
 * Utiliser uniquement dans `tests/login.spec.ts` (ou specs @auth négatifs).
 */
export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

test.use({ storageState: { cookies: [], origins: [] } });

export { expect };
