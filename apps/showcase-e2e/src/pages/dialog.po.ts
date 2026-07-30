import type { Page, Locator } from '@playwright/test';

export class DialogPageObject {
  constructor(private readonly page: Page) {}

  panel(): Locator {
    return this.page.locator('.solaris-dialog-panel');
  }

  backdrop(): Locator {
    return this.page.locator('.solaris-dialog-backdrop');
  }

  header(): Locator {
    return this.panel().locator('solaris-dialog-header');
  }

  actions(): Locator {
    return this.page.locator('solaris-dialog-actions');
  }

  async open(buttonName: string): Promise<void> {
    await this.page.getByRole('button', { name: buttonName }).click();
    await this.panel().waitFor({ state: 'visible' });
  }

  async closeViaButton(name: string): Promise<void> {
    await this.panel().getByRole('button', { name }).click();
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

  async assertTitle(text: string): Promise<void> {
    await this.panel().locator('h2').waitFor({ state: 'visible' });
  }
}
