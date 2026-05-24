import { test, expect } from '../fixtures/test.fixture';

test.describe('Checkout — order process @critical', () => {
  test.describe.configure({ mode: 'parallel' });

  test("should complete checkout with valid shipping info @smoke @critical", async ({ inventoryPage, cartPage, checkoutPage }) => {
    await test.step('arrange — add product to cart and proceed to checkout', async () => {
      await inventoryPage.goto();
      await inventoryPage.addToCart();
      await inventoryPage.openCart();
      await cartPage.proceedToCheckout();
    });
    await test.step('act — fill and submit shipping information', async () => {
      await checkoutPage.fillAndSubmitShipping();
    });
    await test.step('assert — verify access to order review step', async () => {
      await checkoutPage.expectCheckoutOverview();
      await expect(checkoutPage.page).toHaveURL(/step-two|overview|review/i);
    });
  });

  test("should validate required fields at checkout @regression @critical", async ({ inventoryPage, cartPage, checkoutPage }) => {
    await test.step('arrange — add product to cart and access checkout form', async () => {
      await inventoryPage.goto();
      await inventoryPage.addToCart();
      await inventoryPage.openCart();
      await cartPage.proceedToCheckout();
    });
    await test.step('act — submit form without filling required fields', async () => {
      await checkoutPage.submitShippingInfoWithoutFill();
    });
    await test.step('assert — verify validation errors display for required fields', async () => {
      await checkoutPage.expectShippingValidationError();
      await expect(checkoutPage.page).toHaveURL(/checkout-step-one/i);
    });
  });

  test("should cancel checkout process @regression", async ({ inventoryPage, cartPage, checkoutPage }) => {
    await test.step('arrange — add product and access checkout', async () => {
      await inventoryPage.goto();
      await inventoryPage.addToCart();
      await inventoryPage.openCart();
      await cartPage.proceedToCheckout();
    });
    await test.step('act — cancel checkout process', async () => {
      await checkoutPage.page.getByTestId('cancel').click();
    });
    await test.step('assert — verify return to cart page', async () => {
      await expect(cartPage.page).toHaveURL(/cart/i);
    });
  });
});