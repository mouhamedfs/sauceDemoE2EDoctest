import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Page Object — Formulaire de connexion.
 *
 * Généré par Doctest à partir des éléments détectés au crawl.
 * Utilisé par `global-setup.ts` (session) et `fixtures/login.fixture.ts` (tests login).
 *
 * `page` est public pour les assertions d'URL / titre. Les `Locator` du formulaire sont `private`.
 */
export class LoginPage {
  public readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("[id=\"user-name\"]");
    this.passwordInput = page.locator("[id=\"password\"]");
    this.submitButton = page.locator("[id=\"login-button\"]");
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  /** Remplit les identifiants et soumet le formulaire (global-setup + tests passants). */
  async authenticate(username: string, password: string): Promise<void> {
    await this.fillAndSubmit(username, password);
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  async fillAndSubmit(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.clickSubmit();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  /** Soumet le formulaire (clic sur le bouton de connexion). */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  /** Vérifie que le formulaire de login est affiché (parcours non authentifié). */
  async expectLoginFormVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectSubmitButtonEnabled(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
  }
}
