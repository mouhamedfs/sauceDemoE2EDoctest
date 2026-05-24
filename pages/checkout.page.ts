import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export type ShippingInfo = {
  firstname: string;
  lastname: string;
  postalcode: string;
};

/**
 * Page Object — checkout (generated from crawl).
 * Methods are derived from buttons, links and forms detected on this page.
 */
export class CheckoutPage {
  public readonly page: Page;
  private readonly firstnameInput: Locator;
  private readonly lastnameInput: Locator;
  private readonly postalcodeInput: Locator;
  private readonly clickContinueButton: Locator;
  private readonly clickOpenMenuButton: Locator;
  private readonly clickCloseMenuButton: Locator;
  private readonly submitButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstnameInput = page.locator("[id=\"first-name\"]");
    this.lastnameInput = page.locator("[id=\"last-name\"]");
    this.postalcodeInput = page.locator("[id=\"postal-code\"]");
    this.clickContinueButton = page.locator("[id=\"continue\"]");
    this.clickOpenMenuButton = page.locator("[id=\"react-burger-menu-btn\"]");
    this.clickCloseMenuButton = page.locator("[id=\"react-burger-cross-btn\"]");
    this.submitButton = page.locator("[id=\"continue\"]");
    this.errorMessage = page.getByTestId('error');
  }

  /** Navigate to /checkout-step-one.html. */
  async goto(): Promise<void> {
    await this.page.goto("/checkout-step-one.html");
  }

  /** Click Continue / Next in a multi-step flow. */
  async clickContinue(): Promise<void> {
    await this.clickContinueButton.click();
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

  /** Fill all shipping form fields (explicit values — prefer fillShippingWithSampleData in specs). */
  async fillShippingInfo(info: ShippingInfo): Promise<void> {
    await this.firstnameInput.fill(info.firstname);
    await this.lastnameInput.fill(info.lastname);
    await this.postalcodeInput.fill(info.postalcode);
  }

  /** Submit the shipping form. */
  async submitShippingInfo(): Promise<void> {
    await this.submitButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Submit the shipping form without filling fields (BVA). */
  async submitShippingInfoWithoutFill(): Promise<void> {
    await this.submitButton.click();
  }

  /** Assert a validation error is visible after empty/invalid shipping submit. */
  async expectShippingValidationError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }

  /** Fill shipping form with Faker sample data — use in specs instead of hardcoded objects. */
  async fillShippingWithSampleData(): Promise<void> {
    await this.firstnameInput.fill(faker.person.firstName());
    await this.lastnameInput.fill(faker.person.lastName());
    await this.postalcodeInput.fill(faker.location.zipCode());
  }

  /** Fill shipping form (Faker) and submit. */
  async fillAndSubmitShipping(): Promise<void> {
    await this.fillShippingWithSampleData();
    await this.submitShippingInfo();
  }

  /** Assert checkout reached overview / step 2 after shipping (not step 1 Continue). */
  async expectCheckoutOverview(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout.*(step-two|step-2|step_two|overview|review)/i);
  }
}
