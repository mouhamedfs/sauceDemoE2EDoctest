import type { Locator, Page } from '@playwright/test';

/**
 * Page Object — inventory (generated from crawl).
 * Methods are derived from buttons, links and forms detected on this page.
 */
export class InventoryPage {
  public readonly page: Page;
  private readonly addToCartButton: Locator;
  private readonly clickOpenMenuButton: Locator;
  private readonly clickCloseMenuButton: Locator;
  private readonly openCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator("[id=\"add-to-cart-sauce-labs-backpack\"]");
    this.clickOpenMenuButton = page.locator("[id=\"react-burger-menu-btn\"]");
    this.clickCloseMenuButton = page.locator("[id=\"react-burger-cross-btn\"]");
    this.openCartLink = page.locator('[data-test*="shopping-cart"], [data-test*="cart-link"]').first();
  }

  /** Navigate to /inventory.html. */
  async goto(): Promise<void> {
    await this.page.goto("/inventory.html");
  }

  /** Click the primary "Add to cart" action. */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Click the "Open Menu" button. */
  async clickOpenMenu(): Promise<void> {
    await this.clickOpenMenuButton.click();
  }

  /** Click the "Close Menu" button. */
  async clickCloseMenu(): Promise<void> {
    await this.clickCloseMenuButton.click();
  }

  /** Navigate to the cart via the header cart icon / cart link (not sidebar menu). */
  async openCart(): Promise<void> {
    await this.openCartLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
