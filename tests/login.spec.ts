import { faker } from '@faker-js/faker';
import { test, expect } from '../fixtures/login.fixture';

/**
 * Tests de la page de connexion — contexte **sans** session (`storageState` vide).
 *
 * Les autres specs héritent de `playwright/.auth/user.json` via `playwright.config.ts`.
 *
 * Couverture login :
 *   - Structure du formulaire          → automatique
 *   - Cas non passants (vides, invalides) → automatique
 *   - Cas passant (connexion réussie)  → skip si TEST_USER_EMAIL/PASSWORD vides dans .env
 */
test.describe('Page de connexion @smoke @auth', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.page).toHaveURL(new RegExp("https://www.saucedemo.com"));
  });

  test('les éléments du formulaire de connexion sont visibles', async ({ loginPage }) => {
    await loginPage.expectLoginFormVisible();
    await loginPage.expectSubmitButtonEnabled();
  });

  test('soumettre le formulaire avec des champs vides ne connecte pas', async ({ loginPage }) => {
    await loginPage.clickSubmit();
    await loginPage.expectLoginFormVisible();
    await expect(loginPage.page).not.toHaveURL(/\/(dashboard|home|app)(\/|$)/i);
  });

  test("credentials invalides ne donnent pas acces a l application", async ({ loginPage }) => {
    const invalidEmail = faker.internet.email();
    const invalidPassword = faker.internet.password({ length: 20 });

    await loginPage.fillAndSubmit(invalidEmail, invalidPassword);
    await loginPage.expectLoginFormVisible();
    await expect(loginPage.page).not.toHaveURL(/\/(dashboard|home|app)(\/|$)/i);

    const errorAlert = loginPage.page.getByRole('alert');
    const errorText = loginPage.page.getByText(/invalid|incorrect|erreur|error|failed|refus/i);
    if ((await errorAlert.count()) > 0) {
      await expect(errorAlert.first()).toBeVisible();
    } else if ((await errorText.count()) > 0) {
      await expect(errorText.first()).toBeVisible();
    }
  });

  test('login avec credentials valides redirige vers l application @critical', async ({ loginPage }) => {
    const email = process.env.TEST_USER_EMAIL?.trim();
    const password = process.env.TEST_USER_PASSWORD?.trim();

    test.skip(
      !email || !password,
      'Renseigner TEST_USER_EMAIL et TEST_USER_PASSWORD dans le fichier .env à la racine du projet.',
    );

    await loginPage.authenticate(email!, password!);

    await expect(loginPage.page).not.toHaveURL(/\/login|signin|auth/i);
  });

});
