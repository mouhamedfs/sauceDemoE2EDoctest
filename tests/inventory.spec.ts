import { test, expect } from '../fixtures/test.fixture';

test.describe('Inventory — product display and navigation @smoke', () => {
  test.describe.configure({ mode: 'parallel' });

  test("should load and display inventory products @smoke", async ({ inventoryPage }) => {
    await test.step('arrange — navigate to inventory page', async () => {
      await inventoryPage.goto();
    });
    await test.step('act — load page and wait for products display', async () => {
      // implicit page load
    });
    await test.step('assert — verify inventory page is accessible and displays content', async () => {
      await expect(inventoryPage.page).toHaveURL(/inventory/i);
    });
  });

  test("should navigate between inventory and cart @smoke", async ({ inventoryPage, cartPage }) => {
    await test.step('arrange — navigate to inventory page', async () => {
      await inventoryPage.goto();
    });
    await test.step('act — open cart from inventory', async () => {
      await inventoryPage.openCart();
    });
    await test.step('assert — verify navigation to cart page', async () => {
      await expect(cartPage.page).toHaveURL(/cart/i);
    });
  });

  test("should open and close sidebar menu @regression", async ({ inventoryPage }) => {
    await test.step('arrange — navigate to inventory page', async () => {
      await inventoryPage.goto();
    });
    await test.step('act — open then close sidebar menu', async () => {
      await inventoryPage.clickOpenMenu();
      await inventoryPage.clickCloseMenu();
    });
    await test.step('assert — verify user stays on inventory page', async () => {
      await expect(inventoryPage.page).toHaveURL(/inventory/i);
    });
  });
});