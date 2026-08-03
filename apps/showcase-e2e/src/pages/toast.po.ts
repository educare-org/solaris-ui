import type { Page, Locator } from '@playwright/test';

export class ToastPageObject {
  constructor(private readonly page: Page) {}

  toast(): Locator {
    return this.page.locator('solaris-toast').first();
  }

  async show(name: string): Promise<void> {
    await this.page.getByRole('button', { name }).click();
  }

  async dismissAll(): Promise<void> {
    await this.page.getByRole('button', { name: 'Dismiss All Toasts' }).click();
  }

  async assertVisible(): Promise<void> {
    await this.toast().waitFor({ state: 'visible' });
  }

  async assertNotVisible(): Promise<void> {
    await this.toast().waitFor({ state: 'hidden' });
  }
}
