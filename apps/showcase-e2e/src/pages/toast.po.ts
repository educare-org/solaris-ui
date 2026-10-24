import type { Page, Locator } from '@playwright/test';

export class ToastPageObject {
  constructor(private readonly page: Page) {}

  toast(): Locator {
    return this.page.locator('solaris-toast').first();
  }

  async show(): Promise<void> {
    await this.page.getByTestId('toast-basic-trigger').click();
  }

  async dismiss(): Promise<void> {
    await this.toast().locator('.solaris-toast__trailing-btn').first().click();
  }

  async assertVisible(): Promise<void> {
    await this.toast().waitFor({ state: 'visible' });
  }

  async assertNotVisible(): Promise<void> {
    await this.toast().waitFor({ state: 'hidden' });
  }
}
