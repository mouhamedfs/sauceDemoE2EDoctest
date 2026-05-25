import { test, expect } from '../fixtures/test.fixture';

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

  test("should add backpack using first inventory button — flaky locator @flaky", async ({ inventoryPage, cartPage }) => {
    await test.step('arrange — navigate to inventory and pick a random sort order', async () => {
      await inventoryPage.goto();
      const randomSort = Math.random() > 0.5 ? 'az' : 'lohi';
      await inventoryPage.page.locator('[data-test="product-sort-container"]').selectOption(randomSort);
    });
    await test.step('act — click the first add-to-cart button with a positional locator', async () => {
      // Locator volontairement flaky : on suppose que le premier bouton du listing
      // correspond toujours au backpack, alors que l ordre dépend du tri choisi.
      await inventoryPage.page.locator('.inventory_item .btn_inventory').first().click();
      await inventoryPage.openCart();
    });
    await test.step('assert — verify the backpack was added', async () => {
      await expect(cartPage.page.getByTestId('inventory-item-name').first()).toHaveText('Sauce Labs Backpack');
    });
  });

  test("should keep a single item in cart — invented hidden precondition @flaky", async ({ inventoryPage, cartPage }) => {
    await test.step('arrange — navigate to inventory and always add the backpack', async () => {
      await inventoryPage.goto();
      await inventoryPage.addToCart();
    });
    await test.step('act — sometimes add a second product without reflecting it in the assertion', async () => {
      // Flaky inventé : précondition cachée aléatoire.
      // Une exécution sur deux ajoute aussi le second produit, mais l assertion
      // continue de supposer que le panier contient exactement un item.
      if (Math.random() > 0.5) {
        await inventoryPage.page.locator('.inventory_item button').nth(1).click();
      }
      await inventoryPage.openCart();
    });
    await test.step('assert — verify the cart still contains exactly one line item', async () => {
      await expect(cartPage.page.getByTestId('inventory-item-name')).toHaveCount(1);
    });
  });
});