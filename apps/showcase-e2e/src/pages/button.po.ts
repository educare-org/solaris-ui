import type { Page, Locator } from '@playwright/test';

export class ButtonPageObject {
  constructor(private readonly page: Page) {}

  buttons(): Locator {
    return this.page.locator('button[solaris-button]');
  }

  anchorButtons(): Locator {
    return this.page.locator('a[solaris-button]');
  }

  disabledButton(): Locator {
    return this.page.locator('button[solaris-button][disabled]').first();
  }

  async assertDisabled(): Promise<void> {
    await this.disabledButton().waitFor({ state: 'attached' });
  }

  async assertAnchorVisible(): Promise<void> {
    await this.anchorButtons().first().waitFor({ state: 'visible' });
  }
}
