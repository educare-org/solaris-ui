import type { Page, Locator } from '@playwright/test';

export class PhoneFieldPageObject {
  constructor(private readonly page: Page) {}

  field(index = 0): Locator {
    return this.page.locator('solaris-phone-field').nth(index);
  }

  countryButton(index = 0): Locator {
    return this.field(index).locator('.solaris-phone-field__country');
  }

  input(index = 0): Locator {
    return this.field(index).locator('input[solaris-input]');
  }

  dialCode(index = 0): Locator {
    return this.field(index).locator('.solaris-phone-field__dial-code');
  }

  listbox(): Locator {
    return this.page.locator('.solaris-phone-country-list__list');
  }

  options(): Locator {
    return this.listbox().locator('[role="option"]');
  }

  optionCode(optionIndex = 0): Locator {
    return this.options()
      .nth(optionIndex)
      .locator('.solaris-phone-country-list__code');
  }

  searchInput(): Locator {
    return this.page.locator('.solaris-phone-country-list__search-input');
  }

  async openCountrySelector(index = 0): Promise<void> {
    await this.countryButton(index).click();
  }

  async selectCountry(optionIndex = 0): Promise<void> {
    await this.options().nth(optionIndex).click();
  }
}
