import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Page Object — cart (generated from crawl).
 * Methods are derived from buttons, links and forms detected on this page.
 */
export class CartPage {
  public readonly page: Page;
  private readonly removeFromCartButton: Locator;
  private readonly proceedToCheckoutButton: Locator;
  private readonly clickContinueShoppingButton: Locator;
  private readonly clickOpenMenuButton: Locator;
  private readonly clickCloseMenuButton: Locator;
  private readonly cartItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.removeFromCartButton = page.locator("[id=\"remove-sauce-labs-backpack\"]");
    this.proceedToCheckoutButton = page.locator("[id=\"checkout\"]");
    this.clickContinueShoppingButton = page.locator("[id=\"continue-shopping\"]");
    this.clickOpenMenuButton = page.locator("[id=\"react-burger-menu-btn\"]");
    this.clickCloseMenuButton = page.locator("[id=\"react-burger-cross-btn\"]");
    this.cartItem = page.getByTestId('inventory-item-name');
  }

  /** Navigate to /cart.html. */
  async goto(): Promise<void> {
    await this.page.goto("/cart.html");
  }

  /** Remove an item from the cart. */
  async removeFromCart(): Promise<void> {
    await this.removeFromCartButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Start the checkout flow from this page. */
  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Click the "Continue Shopping" button. */
  async clickContinueShopping(): Promise<void> {
    await this.clickContinueShoppingButton.click();
  }

  /** Click the "Open Menu" button. */
  async clickOpenMenu(): Promise<void> {
    await this.clickOpenMenuButton.click();
  }

  /** Click the "Close Menu" button. */
  async clickCloseMenu(): Promise<void> {
    await this.clickCloseMenuButton.click();
  }

  /** Assert at least one cart line item is visible. */
  async expectItemVisible(): Promise<void> {
    await expect(this.cartItem).toBeVisible();
  }

  /** Assert the cart contains no line items. */
  async expectCartEmpty(): Promise<void> {
    await expect(this.cartItem).toHaveCount(0);
  }
}
