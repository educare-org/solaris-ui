import type { Page, Locator } from '@playwright/test';

export class SelectPageObject {
  constructor(private readonly page: Page) {}

  trigger(index = 0): Locator {
    return this.page.locator('solaris-select').nth(index).locator('.solaris-select__trigger');
  }

  options(): Locator {
    return this.page.locator('solaris-option');
  }

  async open(index = 0): Promise<void> {
    await this.trigger(index).click();
  }

  async selectOption(optionIndex = 0): Promise<void> {
    await this.options().nth(optionIndex).click();
  }

  async openAndSelect(selectIndex = 0, optionIndex = 0): Promise<void> {
    await this.open(selectIndex);
    await this.selectOption(optionIndex);
  }

  value(index = 0): Locator {
    return this.trigger(index).locator('.solaris-select__value');
  }

  async assertHasValue(index = 0): Promise<void> {
    await this.value(index).waitFor({ state: 'visible' });
  }

  async keyboardNavigateAndSelect(selectIndex = 0): Promise<void> {
    await this.open(selectIndex);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }
}
