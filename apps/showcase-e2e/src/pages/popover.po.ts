import type { Page, Locator } from '@playwright/test';

export class PopoverPageObject {
  constructor(private readonly page: Page) {}

  panel(): Locator {
    return this.page.locator('.solaris-popover-panel__container');
  }

  async open(name: string): Promise<void> {
    await this.page.getByRole('button', { name }).click();
  }

  async closeViaEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  async assertVisible(): Promise<void> {
    await this.panel().waitFor({ state: 'visible' });
  }

  async assertNotVisible(): Promise<void> {
    await this.panel().waitFor({ state: 'hidden' });
  }
}
