import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';

/**
 * Fixtures applicatives — héritent du `storageState` global (`playwright.config.ts`).
 * Tests login : importer `../fixtures/login.fixture` (contexte sans session).
 */
type Fixtures = {
  sharedPage: Page;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<Fixtures>({
  sharedPage: async ({ page }, use) => {
    await use(page);
  },

  inventoryPage: async ({ sharedPage }, use) => {
    await use(new InventoryPage(sharedPage));
  },

  cartPage: async ({ sharedPage }, use) => {
    await use(new CartPage(sharedPage));
  },

  checkoutPage: async ({ sharedPage }, use) => {
    await use(new CheckoutPage(sharedPage));
  },
});

export { expect } from '@playwright/test';
