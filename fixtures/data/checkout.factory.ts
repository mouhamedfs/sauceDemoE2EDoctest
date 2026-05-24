import { faker } from '@faker-js/faker';

/**
 * Shipping information — checkout step 1.
 *
 * Specs that call `checkoutPage.fillAndSubmitShipping()` do **not** need this
 * factory — Faker lives inside the POM. Use `shippingInfoFactory()` when a
 * spec must mutate a single field (BVA) and pass the rest to a POM helper that
 * accepts an object.
 */
export type ShippingInfo = {
  firstName: string;
  lastName: string;
  zip: string;
  city: string;
  address: string;
  country: string;
};

export function shippingInfoFactory(overrides: Partial<ShippingInfo> = {}): ShippingInfo {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    zip: faker.location.zipCode(),
    city: faker.location.city(),
    address: faker.location.streetAddress(),
    country: faker.location.country(),
    ...overrides,
  };
}

/** Empty shape — for BVA "submit empty form" scenarios. */
export const emptyShippingInfo: ShippingInfo = {
  firstName: '',
  lastName: '',
  zip: '',
  city: '',
  address: '',
  country: '',
};
