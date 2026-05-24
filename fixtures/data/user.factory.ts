import { faker } from '@faker-js/faker';

/**
 * Test user credentials.
 *
 * Use this factory in negative auth specs (invalid credentials) and in flows
 * that need a fresh signup payload. For the happy-path login, prefer the
 * `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` env vars wired in `.env`.
 */
export type UserCredentials = {
  email: string;
  password: string;
};

export function userCredentialsFactory(overrides: Partial<UserCredentials> = {}): UserCredentials {
  const uniq = faker.string.alphanumeric(6).toLowerCase();
  return {
    email: `qa+${uniq}@${faker.internet.domainName()}`,
    password: faker.internet.password({ length: 16, memorable: false }),
    ...overrides,
  };
}

/** Fixed invalid credentials — useful for negative auth tests with stable assertions. */
export const invalidCredentials: UserCredentials = {
  email: 'invalid_user@example.test',
  password: 'wrong_password',
};
