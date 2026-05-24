import { test, expect } from '../fixtures/test.fixture';
import type { BrowserContext, Page } from '@playwright/test';

test.describe('Cart — product management @smoke @critical', () => {
  test.describe.configure({ mode: 'parallel' });

  test("should add product to cart from inventory @smoke @critical", async ({ inventoryPage, cartPage }) => {
    await test.step('arrange — navigate to inventory page to select product', async () => {
      await inventoryPage.goto();
    });
    await test.step('act — add product to cart from list', async () => {
      await inventoryPage.addToCart();
    });
    await test.step('act — open cart to verify addition', async () => {
      await inventoryPage.openCart();
    });
    await test.step('assert — verify item is visible in cart and URL is correct', async () => {
      await cartPage.expectItemVisible();
      await expect(cartPage.page).toHaveURL(/cart/i);
    });
  });

  test("should remove product from cart @smoke @critical", async ({ inventoryPage, cartPage }) => {
    await test.step('arrange — add product to cart then navigate to cart', async () => {
      await inventoryPage.goto();
      await inventoryPage.addToCart();
      await inventoryPage.openCart();
    });
    await test.step('act — remove item from cart', async () => {
      await cartPage.removeFromCart();
    });
    await test.step('assert — verify cart is empty and URL stays on cart page', async () => {
      await cartPage.expectCartEmpty();
      await expect(cartPage.page).toHaveURL(/cart/i);
    });
  });

  test("should return to shopping from cart @regression", async ({ inventoryPage, cartPage }) => {
    await test.step('arrange — navigate to cart', async () => {
      await cartPage.goto();
    });
    await test.step('act — click continue shopping', async () => {
      await cartPage.clickContinueShopping();
    });
    await test.step('assert — verify return to inventory page', async () => {
      await expect(inventoryPage.page).toHaveURL(/inventory/i);
    });
  });

  // Contexte navigateur partagé entre les tests @flaky : une fois React "chaud",
  // les mises à jour badge/bouton deviennent asynchrones → échecs intermittents.
  test.describe('Flaky cart scenarios @flaky', () => {
    test.describe.configure({ mode: 'serial' });

    let warmContext: BrowserContext;
    let warmPage: Page;

    test.beforeAll(async ({ browser }) => {
      console.log('beforeAll warmContext', Math.random());
      warmContext = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
      warmPage = await warmContext.newPage();
    });

    test.afterAll(async () => {
      await warmContext?.close();
    });

    test.beforeEach(async () => {
      await warmPage.close().catch(() => undefined);
      warmPage = await warmContext.newPage();
      await warmPage.goto('/inventory.html');
    });

    test.afterEach(async () => {
      await warmPage.close().catch(() => undefined);
    });

    test('should display cart badge after adding product — flaky locator @flaky', async () => {
      await test.step('act + assert — add via fragile CSS locator, read badge in same tick', async () => {
        // Locator instable : sélecteur CSS générique (.btn_inventory) sans data-testid.
        // Lecture dans le même tick JS que le clic — le badge React n'est pas
        // toujours peint quand l'assertion s'exécute (~50 % d'échec).
        const badgeUpdated = await warmPage.evaluate(() => {
          document.querySelector('.inventory_item .btn_inventory')?.click();
          const badge = document.querySelector('.shopping_cart_link .shopping_cart_badge');
          return badge?.textContent === '1';
        });
        console.log('badgeUpdated', badgeUpdated);
        expect(badgeUpdated).toBe(true);
      });
    });

    test('should sync badge and button state after add — UI update race @flaky', async () => {
      await test.step('act + assert — atomic check on badge AND button swap in same tick', async () => {
        // Race condition inventée : React bascule le bouton add→remove de façon synchrone
        // mais met à jour le badge panier de façon asynchrone. Exiger les deux dans
        // le même tick produit un échec intermittent (~50 %).
        const stateSynced = await warmPage.evaluate(() => {
          document.getElementById('add-to-cart-sauce-labs-backpack')?.click();
          const badge = document.querySelector('.shopping_cart_badge')?.textContent;
          const addStillVisible = !!document.getElementById('add-to-cart-sauce-labs-backpack');
          return badge === '1' && !addStillVisible;
        });
        console.log('stateSynced', stateSynced);
        expect(stateSynced).toBe(true);
      });
    });
  });
});